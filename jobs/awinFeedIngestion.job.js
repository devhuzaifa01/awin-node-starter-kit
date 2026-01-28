const cron = require('node-cron');
const axios = require('axios');
const zlib = require('zlib');
const csv = require('csv-parser');
const { sendEmail } = require('../utils/helpers');
const Product = require('../models/Product');
const { getLocalizedMessage } = require('../utils/localization');

let isRunning = false;

// Configuration
const getJobConfig = () => {
  const language = process.env.AWIN_FEED_CRON_LANGUAGE || 'en';
  const maxAttempts = parseInt(process.env.AWIN_FEED_CRON_ATTEMPTS, 10) || 3;
  const feedUrl = process.env.AWIN_PRODUCT_FEED_URL;
  const cronSchedule = process.env.AWIN_FEED_CRON_SCHEDULE;
  const jobEmail = process.env.JOB_EMAIL;
  const runOnStart = process.env.RUN_AWIN_FEED_ON_START === 'true';

  return {
    language,
    maxAttempts,
    feedUrl,
    cronSchedule,
    jobEmail,
    runOnStart
  };
};

// Localization helper
const getJobMessage = (key, replacements = {}) => {
  const config = getJobConfig();
  let message = getLocalizedMessage(key, config.language);
  
  if (!message) {
    return key;
  }

  // Replace placeholders
  Object.keys(replacements).forEach(placeholder => {
    const value = replacements[placeholder] !== undefined && replacements[placeholder] !== null 
      ? String(replacements[placeholder]) 
      : '';
    message = message.replace(new RegExp(`\\{${placeholder}\\}`, 'g'), value);
  });

  return message;
};

// Logging helper
const logInfo = (key, replacements = {}, data = null) => {
  const message = getJobMessage(key, replacements);
  if (data) {
    console.log(`[AWIN FEED] ${message}`, data);
  } else {
    console.log(`[AWIN FEED] ${message}`);
  }
};

const logWarn = (key, replacements = {}, data = null) => {
  const message = getJobMessage(key, replacements);
  if (data) {
    console.warn(`[AWIN FEED] ${message}`, data);
  } else {
    console.warn(`[AWIN FEED] ${message}`);
  }
};

const logError = (key, replacements = {}, error = null) => {
  const message = getJobMessage(key, replacements);
  if (error) {
    console.error(`[AWIN FEED] ${message}`, error);
  } else {
    console.error(`[AWIN FEED] ${message}`);
  }
};

// Price parsing utility
function parseAwinPrice(value) {
  if (!value || typeof value !== 'string') {
    return null;
  }

  let cleaned = value.replace(/[^\d.,]/g, '').trim();
  
  if (!cleaned) {
    return null;
  }

  const lastComma = cleaned.lastIndexOf(',');
  const lastDot = cleaned.lastIndexOf('.');
  
  if (lastComma > lastDot) {
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  } else if (lastDot > lastComma) {
    cleaned = cleaned.replace(/,/g, '');
  } else if (lastComma !== -1) {
    cleaned = cleaned.replace(',', '.');
  }

  const parsed = parseFloat(cleaned);
  
  if (isNaN(parsed)) {
    return null;
  }

  return parsed;
}

// Email helpers
async function sendFailureEmail(attempt, error, timestamp) {
  const config = getJobConfig();
  
  if (!config.jobEmail) {
    logWarn('awin.job.email.notSet');
    return;
  }

  try {
    const subject = getJobMessage('awin.job.email.failure.subject', {
      attempt,
      maxAttempts: config.maxAttempts
    });
    
    const text = getJobMessage('awin.job.email.failure.body', {
      timestamp,
      attempt,
      maxAttempts: config.maxAttempts,
      error: error.message || String(error),
      stack: error.stack || 'N/A'
    });

    await sendEmail({
      to: config.jobEmail,
      subject,
      text
    });
  } catch (emailError) {
    logError('awin.job.email.sendError', { type: 'failure' }, {
      attempt,
      error: emailError.message || String(emailError),
      stack: emailError.stack
    });
  }
}

async function sendSuccessEmail(processedRows, skippedRows, duration, timestamp) {
  const config = getJobConfig();
  
  if (!config.jobEmail) {
    logWarn('awin.job.email.notSet');
    return;
  }

  try {
    const subject = getJobMessage('awin.job.email.success.subject');
    
    const text = getJobMessage('awin.job.email.success.body', {
      timestamp,
      processedRows,
      skippedRows,
      totalRows: processedRows + skippedRows,
      duration
    });

    await sendEmail({
      to: config.jobEmail,
      subject,
      text
    });
  } catch (emailError) {
    logError('awin.job.email.sendError', { type: 'success' }, {
      processedRows,
      skippedRows,
      error: emailError.message || String(emailError),
      stack: emailError.stack
    });
  }
}

// Product data mapping
function mapCsvRowToProduct(row) {
  return {
    awinMerchantId: row.merchant_id ? parseInt(row.merchant_id, 10) : null,
    awinProductId: row.aw_product_id || null,
    merchantName: row.merchant_name || null,
    productName: row.product_name || null,
    price: {
      storePrice: parseAwinPrice(row.store_price),
      displayPrice: parseAwinPrice(row.display_price),
      currency: row.currency || null
    },
    imageUrl: row.aw_image_url || null,
    deeplinkUrl: row.aw_deep_link || null,
    category: {
      id: row.category_id || null,
      name: row.category_name || null
    },
    commissionGroup: row.commission_group || null,
    language: row.language || null,
    lastUpdatedAt: row.last_updated ? new Date(row.last_updated) : null,
    ingestedAt: new Date()
  };
}

// Feed processing
async function processFeed() {
  const startTime = Date.now();
  let processedRows = 0;
  let skippedRows = 0;
  const config = getJobConfig();

  if (!config.feedUrl) {
    const error = new Error(getJobMessage('awin.job.error.missingFeedUrl'));
    throw error;
  }

  logInfo('awin.job.log.downloading', { url: config.feedUrl });

  const response = await axios({
    method: 'get',
    url: config.feedUrl,
    responseType: 'stream'
  });

  logInfo('awin.job.log.downloaded');

  const gunzip = zlib.createGunzip();
  const csvStream = csv();

  return new Promise((resolve, reject) => {
    csvStream.on('data', async (row) => {
      csvStream.pause();
      try {
        const productData = mapCsvRowToProduct(row);

        if (!productData.awinMerchantId || !productData.awinProductId) {
          skippedRows++;
          logWarn('awin.job.log.skippingRow', {}, {
            merchant_id: row.merchant_id,
            aw_product_id: row.aw_product_id
          });
        } else {
          await Product.findOneAndUpdate(
            {
              awinMerchantId: productData.awinMerchantId,
              awinProductId: productData.awinProductId
            },
            productData,
            {
              upsert: true,
              new: true,
              setDefaultsOnInsert: true
            }
          );

          processedRows++;
        }
      } catch (rowError) {
        skippedRows++;
        logError('awin.job.log.errorProcessingRow', {
          error: rowError.message
        }, { row });
      } finally {
        csvStream.resume();
      }
    });

    csvStream.on('end', () => {
      const duration = Date.now() - startTime;
      logInfo('awin.job.log.csvParsingCompleted', {}, {
        processedRows,
        skippedRows,
        duration: `${duration}ms`
      });
      resolve({ processedRows, skippedRows, duration });
    });

    csvStream.on('error', (error) => {
      logError('awin.job.log.csvParsingError', {}, error);
      reject(error);
    });

    gunzip.on('error', (error) => {
      logError('awin.job.log.gzipError', {}, error);
      reject(error);
    });

    response.data.pipe(gunzip).pipe(csvStream);
  });
}

// Job execution with retries
async function runJobWithRetries() {
  const config = getJobConfig();
  const maxAttempts = config.maxAttempts;
  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      logInfo('awin.job.log.startingAttempt', {
        attempt,
        maxAttempts
      });
      
      const result = await processFeed();
      
      logInfo('awin.job.log.completed', {}, {
        processedRows: result.processedRows,
        skippedRows: result.skippedRows,
        duration: `${result.duration}ms`
      });

      await sendSuccessEmail(
        result.processedRows,
        result.skippedRows,
        result.duration,
        new Date().toISOString()
      );

      return;
    } catch (error) {
      lastError = error;
      logError('awin.job.log.attemptFailed', {
        attempt,
        maxAttempts,
        error: error.message
      });

      await sendFailureEmail(attempt, error, new Date().toISOString());

      if (attempt < maxAttempts) {
        logInfo('awin.job.log.retrying', {
          nextAttempt: attempt + 1,
          maxAttempts
        });
      } else {
        logError('awin.job.log.allAttemptsFailed');
      }
    }
  }

  throw lastError;
}

// Job initialization
function startAwinFeedIngestionJob() {
  const config = getJobConfig();

  if (!config.feedUrl) {
    logError('awin.job.error.missingFeedUrl');
    return;
  }

  if (!config.cronSchedule) {
    logError('awin.job.error.missingCronSchedule');
    return;
  }

  if (!cron.validate(config.cronSchedule)) {
    logError('awin.job.error.invalidCronSchedule', {
      schedule: config.cronSchedule
    });
    return;
  }

  if (config.runOnStart) {
    if (!isRunning) {
      logInfo('awin.job.log.runningOnStartup');
      isRunning = true;

      runJobWithRetries()
        .catch(err => logError('awin.job.log.immediateRunFailed', {}, err))
        .finally(() => {
          isRunning = false;
        });
    }
  }

  cron.schedule(config.cronSchedule, async () => {
    if (isRunning) {
      logWarn('awin.job.log.previousRunInProgress');
      return;
    }

    isRunning = true;
    const jobStartTime = new Date().toISOString();
    logInfo('awin.job.log.jobStarted', { timestamp: jobStartTime });

    try {
      await runJobWithRetries();
    } catch (err) {
      logError('awin.job.log.jobFailedAfterRetries', {}, err);
    } finally {
      isRunning = false;
      const jobEndTime = new Date().toISOString();
      logInfo('awin.job.log.jobFinished', { timestamp: jobEndTime });
    }
  });

  logInfo('awin.job.log.jobScheduled', { schedule: config.cronSchedule });
}

module.exports = {
  startAwinFeedIngestionJob
};
