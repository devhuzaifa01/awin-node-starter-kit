const express = require('express');
const languageMiddleware = require('./middleware/languageMiddleware');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Language detection middleware (must be before routes)
app.use(languageMiddleware);

// Routes
const testRoutes = require('./routes/testRoutes');
const clickRoutes = require('./routes/clickRoutes');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/test', testRoutes);
app.use('/api/click', clickRoutes.api);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/', clickRoutes.redirect);

// Error handling middleware (must be after all routes)
app.use(errorHandler);

// Start cron jobs
const { startAwinFeedIngestionJob } = require('./jobs/awinFeedIngestion.job');
startAwinFeedIngestionJob();

module.exports = app;
