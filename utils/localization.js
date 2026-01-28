// Localization utilities

// Supported languages and their message dictionaries
const messages = {
  en: {
    'test.hello.success': 'Hello. This project is up and running.',
    'test.hello.message': 'Hello. This project is up and running.',
    // Awin job messages
    'awin.job.email.notSet': 'JOB_EMAIL not set. Skipping email.',
    'awin.job.email.failure.subject': '[AWIN FEED] Job failed (attempt {attempt}/{maxAttempts})',
    'awin.job.email.failure.body': 'AWIN Feed Ingestion Job Failed\n\nTimestamp: {timestamp}\nAttempt: {attempt}/{maxAttempts}\nError: {error}\n\nStack: {stack}',
    'awin.job.email.success.subject': '[AWIN FEED] Job completed successfully',
    'awin.job.email.success.body': 'AWIN Feed Ingestion Job Completed Successfully\n\nTimestamp: {timestamp}\nProcessed Rows: {processedRows}\nSkipped Rows: {skippedRows}\nTotal Rows: {totalRows}\nExecution Duration: {duration}ms',
    'awin.job.email.sendError': 'Failed to send {type} email',
    'awin.job.log.downloading': 'Downloading feed from: {url}',
    'awin.job.log.downloaded': 'Feed downloaded, starting decompression and parsing...',
    'awin.job.log.startingAttempt': 'Starting attempt {attempt}/{maxAttempts}',
    'awin.job.log.completed': 'Job completed successfully',
    'awin.job.log.attemptFailed': 'Attempt {attempt}/{maxAttempts} failed: {error}',
    'awin.job.log.retrying': 'Retrying immediately (attempt {nextAttempt}/{maxAttempts})...',
    'awin.job.log.allAttemptsFailed': 'All attempts failed. Skipping this run.',
    'awin.job.log.skippingRow': 'Skipping row - missing required fields',
    'awin.job.log.errorProcessingRow': 'Error processing row',
    'awin.job.log.csvParsingCompleted': 'CSV parsing completed',
    'awin.job.log.csvParsingError': 'CSV parsing error',
    'awin.job.log.gzipError': 'Gzip decompression error',
    'awin.job.log.previousRunInProgress': 'Previous run still in progress. Skipping.',
    'awin.job.log.jobStarted': 'Job started at {timestamp}',
    'awin.job.log.jobFinished': 'Job finished at {timestamp}',
    'awin.job.log.jobScheduled': 'Cron job scheduled with schedule: {schedule}',
    'awin.job.log.runningOnStartup': 'Running feed ingestion immediately on startup',
    'awin.job.log.immediateRunFailed': 'Immediate run failed',
    'awin.job.log.jobFailedAfterRetries': 'Job failed after all retries',
    'awin.job.error.missingFeedUrl': 'AWIN_PRODUCT_FEED_URL environment variable is missing',
    'awin.job.error.missingCronSchedule': 'AWIN_FEED_CRON_SCHEDULE environment variable is missing. Job will not start.',
    'awin.job.error.invalidCronSchedule': 'Invalid cron schedule: {schedule}. Job will not start.',
    // Click API messages
    'click.create.success': 'Click created successfully.',
    'click.create.error.invalidProductId': 'Invalid productId. Must be a valid MongoDB ObjectId.',
    'click.create.error.sourceRequired': 'source is required.',
    'click.create.error.productNotFound': 'Product not found.',
    'click.create.error.productInactive': 'Product not found or inactive.',
    'click.create.error.failed': 'Failed to create click.',
    'click.redirect.error.clickIdRequired': 'clickId is required.',
    'click.redirect.error.clickNotFound': 'Click not found.',
    'click.redirect.error.productNotFound': 'Product not found.',
    'click.redirect.error.missingPublisherId': 'Server configuration error.',
    'click.redirect.error.missingDeeplinkUrl': 'Product deeplink URL is missing.',
    'click.redirect.error.failed': 'Failed to redirect.',
    // Product API messages
    'product.list.success': 'Products retrieved successfully.',
    'product.paginated.success': 'Paginated products retrieved successfully.',
    'product.error.invalidPage': 'Invalid page parameter. Must be a positive integer starting from 1.',
    'product.error.invalidPageSize': 'Invalid pageSize parameter. Must be a positive integer.',
    'product.error.failed': 'Failed to fetch products.',
    // User messages
    'user.profile.success': 'User details retrieved successfully.',
    'user.profile.error.notFound': 'User not found.',
    'user.profile.error.unauthorized': 'Authentication required.',
    // Auth / OTP / User messages
    'auth.requestOtp.success': 'OTP sent successfully. Check your email.',
    'auth.requestOtp.error.invalidEmail': 'Invalid email format.',
    'auth.requestOtp.error.userExists': 'An account with this email already exists.',
    'auth.requestOtp.error.failed': 'Failed to send OTP.',
    'auth.verifyOtp.success': 'OTP verified successfully.',
    'auth.verifyOtp.error.required': 'Email and OTP are required.',
    'auth.verifyOtp.error.invalidOrExpired': 'Invalid or expired OTP.',
    'auth.verifyOtp.error.maxAttempts': 'Maximum attempts exceeded. Please request a new OTP.',
    'auth.verifyOtp.error.failed': 'Failed to verify OTP.',
    'auth.register.success': 'Registration successful.',
    'auth.register.error.unauthorized': 'Valid temporary token required.',
    'auth.register.error.invalidToken': 'Invalid or expired token. Please complete OTP verification again.',
    'auth.register.error.fieldsRequired': 'Email, name, password and confirmPassword are required.',
    'auth.register.error.passwordMismatch': 'Passwords do not match.',
    'auth.register.error.passwordTooShort': 'Password must be at least 6 characters.',
    'auth.register.error.failed': 'Registration failed.',
    'auth.otp.email.subject': 'Your verification code',
    'auth.otp.email.body': 'Your verification code is: {otp}. It expires in 2 minutes.',
    'auth.email.error.nodemailerNotConfigured': 'Nodemailer is not configured. EMAIL_HOST, EMAIL_USER and EMAIL_PASS are required.',
    'auth.email.error.sendGridNotConfigured': 'SendGrid is not configured. SENDGRID_API_KEY and SENDGRID_FROM_EMAIL are required.',
    // Login messages
    'auth.login.success': 'Login successful.',
    'auth.login.error.emailRequired': 'Email is required.',
    'auth.login.error.invalidEmail': 'Invalid email format.',
    'auth.login.error.passwordRequired': 'Password is required.',
    'auth.login.error.emailNotFound': 'No account exists with this email.',
    'auth.login.error.incorrectPassword': 'Password is incorrect.',
    'auth.login.error.failed': 'Login failed.',
    // Forgot password / reset flow
    'auth.forgotPassword.success': 'If an account exists with this email, you will receive an OTP.',
    'auth.forgotPassword.error.invalidEmail': 'Invalid email format.',
    'auth.forgotPassword.error.failed': 'Failed to process request.',
    'auth.resetPassword.otp.email.subject': 'Your password reset code',
    'auth.resetPassword.otp.email.body': 'Your password reset code is: {otp}. It expires in 2 minutes.',
    'auth.verifyResetOtp.success': 'OTP verified successfully. You can now reset your password.',
    'auth.verifyResetOtp.error.required': 'Email and OTP are required.',
    'auth.verifyResetOtp.error.invalidOrExpired': 'Invalid or expired OTP.',
    'auth.verifyResetOtp.error.maxAttempts': 'Maximum attempts exceeded. Please request a new OTP.',
    'auth.verifyResetOtp.error.failed': 'Failed to verify OTP.',
    'auth.resetPassword.success': 'Password reset successful.',
    'auth.resetPassword.error.unauthorized': 'Valid temporary token required.',
    'auth.resetPassword.error.invalidToken': 'Invalid or expired token. Please complete OTP verification again.',
    'auth.resetPassword.error.fieldsRequired': 'New password and confirm password are required.',
    'auth.resetPassword.error.passwordMismatch': 'Passwords do not match.',
    'auth.resetPassword.error.passwordTooShort': 'Password must be at least 6 characters.',
    'auth.resetPassword.error.failed': 'Password reset failed.',
    // Add more English messages here
  },
  de: {
    'test.hello.success': 'Hallo. Dieses Projekt läuft.',
    'test.hello.message': 'Hallo. Dieses Projekt läuft.',
    // Awin job messages
    'awin.job.email.notSet': 'JOB_EMAIL nicht gesetzt. E-Mail wird übersprungen.',
    'awin.job.email.failure.subject': '[AWIN FEED] Job fehlgeschlagen (Versuch {attempt}/{maxAttempts})',
    'awin.job.email.failure.body': 'AWIN Feed Ingestion Job fehlgeschlagen\n\nZeitstempel: {timestamp}\nVersuch: {attempt}/{maxAttempts}\nFehler: {error}\n\nStack: {stack}',
    'awin.job.email.success.subject': '[AWIN FEED] Job erfolgreich abgeschlossen',
    'awin.job.email.success.body': 'AWIN Feed Ingestion Job erfolgreich abgeschlossen\n\nZeitstempel: {timestamp}\nVerarbeitete Zeilen: {processedRows}\nÜbersprungene Zeilen: {skippedRows}\nGesamtzeilen: {totalRows}\nAusführungsdauer: {duration}ms',
    'awin.job.email.sendError': 'Fehler beim Senden der {type} E-Mail',
    'awin.job.log.downloading': 'Feed wird heruntergeladen von: {url}',
    'awin.job.log.downloaded': 'Feed heruntergeladen, Dekomprimierung und Parsing wird gestartet...',
    'awin.job.log.startingAttempt': 'Versuch {attempt}/{maxAttempts} wird gestartet',
    'awin.job.log.completed': 'Job erfolgreich abgeschlossen',
    'awin.job.log.attemptFailed': 'Versuch {attempt}/{maxAttempts} fehlgeschlagen: {error}',
    'awin.job.log.retrying': 'Sofortiger Wiederholungsversuch (Versuch {nextAttempt}/{maxAttempts})...',
    'awin.job.log.allAttemptsFailed': 'Alle Versuche fehlgeschlagen. Dieser Lauf wird übersprungen.',
    'awin.job.log.skippingRow': 'Zeile wird übersprungen - erforderliche Felder fehlen',
    'awin.job.log.errorProcessingRow': 'Fehler beim Verarbeiten der Zeile',
    'awin.job.log.csvParsingCompleted': 'CSV-Parsing abgeschlossen',
    'awin.job.log.csvParsingError': 'CSV-Parsing-Fehler',
    'awin.job.log.gzipError': 'Gzip-Dekomprimierungsfehler',
    'awin.job.log.previousRunInProgress': 'Vorheriger Lauf noch in Bearbeitung. Wird übersprungen.',
    'awin.job.log.jobStarted': 'Job gestartet um {timestamp}',
    'awin.job.log.jobFinished': 'Job beendet um {timestamp}',
    'awin.job.log.jobScheduled': 'Cron-Job geplant mit Zeitplan: {schedule}',
    'awin.job.log.runningOnStartup': 'Feed-Ingestion wird sofort beim Start ausgeführt',
    'awin.job.log.immediateRunFailed': 'Sofortiger Lauf fehlgeschlagen',
    'awin.job.log.jobFailedAfterRetries': 'Job nach allen Wiederholungsversuchen fehlgeschlagen',
    'awin.job.error.missingFeedUrl': 'Umgebungsvariable AWIN_PRODUCT_FEED_URL fehlt',
    'awin.job.error.missingCronSchedule': 'Umgebungsvariable AWIN_FEED_CRON_SCHEDULE fehlt. Job wird nicht gestartet.',
    'awin.job.error.invalidCronSchedule': 'Ungültiger Cron-Zeitplan: {schedule}. Job wird nicht gestartet.',
    // Click API messages
    'click.create.success': 'Klick erfolgreich erstellt.',
    'click.create.error.invalidProductId': 'Ungültige productId. Muss eine gültige MongoDB ObjectId sein.',
    'click.create.error.sourceRequired': 'source ist erforderlich.',
    'click.create.error.productNotFound': 'Produkt nicht gefunden.',
    'click.create.error.productInactive': 'Produkt nicht gefunden oder inaktiv.',
    'click.create.error.failed': 'Klick konnte nicht erstellt werden.',
    'click.redirect.error.clickIdRequired': 'clickId ist erforderlich.',
    'click.redirect.error.clickNotFound': 'Klick nicht gefunden.',
    'click.redirect.error.productNotFound': 'Produkt nicht gefunden.',
    'click.redirect.error.missingPublisherId': 'Serverkonfigurationsfehler.',
    'click.redirect.error.missingDeeplinkUrl': 'Produkt-Deeplink-URL fehlt.',
    'click.redirect.error.failed': 'Weiterleitung fehlgeschlagen.',
    // Product API messages
    'product.list.success': 'Produkte erfolgreich abgerufen.',
    'product.paginated.success': 'Seitenweise Produkte erfolgreich abgerufen.',
    'product.error.invalidPage': 'Ungültiger page-Parameter. Muss eine positive Ganzzahl ab 1 sein.',
    'product.error.invalidPageSize': 'Ungültiger pageSize-Parameter. Muss eine positive Ganzzahl sein.',
    'product.error.failed': 'Produkte konnten nicht abgerufen werden.',
    // User messages
    'user.profile.success': 'Benutzerdetails erfolgreich abgerufen.',
    'user.profile.error.notFound': 'Benutzer nicht gefunden.',
    'user.profile.error.unauthorized': 'Authentifizierung erforderlich.',
    // Auth / OTP / User messages
    'auth.requestOtp.success': 'OTP erfolgreich gesendet. Prüfen Sie Ihre E-Mail.',
    'auth.requestOtp.error.invalidEmail': 'Ungültiges E-Mail-Format.',
    'auth.requestOtp.error.userExists': 'Ein Konto mit dieser E-Mail existiert bereits.',
    'auth.requestOtp.error.failed': 'OTP konnte nicht gesendet werden.',
    'auth.verifyOtp.success': 'OTP erfolgreich verifiziert.',
    'auth.verifyOtp.error.required': 'E-Mail und OTP sind erforderlich.',
    'auth.verifyOtp.error.invalidOrExpired': 'Ungültiges oder abgelaufenes OTP.',
    'auth.verifyOtp.error.maxAttempts': 'Maximale Versuche überschritten. Bitte fordern Sie ein neues OTP an.',
    'auth.verifyOtp.error.failed': 'OTP-Verifizierung fehlgeschlagen.',
    'auth.register.success': 'Registrierung erfolgreich.',
    'auth.register.error.unauthorized': 'Gültiges temporäres Token erforderlich.',
    'auth.register.error.invalidToken': 'Ungültiges oder abgelaufenes Token. Bitte OTP-Verifizierung erneut durchführen.',
    'auth.register.error.fieldsRequired': 'E-Mail, Name, Passwort und Bestätigung sind erforderlich.',
    'auth.register.error.passwordMismatch': 'Passwörter stimmen nicht überein.',
    'auth.register.error.passwordTooShort': 'Passwort muss mindestens 6 Zeichen haben.',
    'auth.register.error.failed': 'Registrierung fehlgeschlagen.',
    'auth.otp.email.subject': 'Ihr Bestätigungscode',
    'auth.otp.email.body': 'Ihr Bestätigungscode lautet: {otp}. Er läuft in 2 Minuten ab.',
    'auth.email.error.nodemailerNotConfigured': 'Nodemailer ist nicht konfiguriert. EMAIL_HOST, EMAIL_USER und EMAIL_PASS sind erforderlich.',
    'auth.email.error.sendGridNotConfigured': 'SendGrid ist nicht konfiguriert. SENDGRID_API_KEY und SENDGRID_FROM_EMAIL sind erforderlich.',
    // Login messages
    'auth.login.success': 'Anmeldung erfolgreich.',
    'auth.login.error.emailRequired': 'E-Mail ist erforderlich.',
    'auth.login.error.invalidEmail': 'Ungültiges E-Mail-Format.',
    'auth.login.error.passwordRequired': 'Passwort ist erforderlich.',
    'auth.login.error.emailNotFound': 'Mit dieser E-Mail existiert kein Konto.',
    'auth.login.error.incorrectPassword': 'Passwort ist falsch.',
    'auth.login.error.failed': 'Anmeldung fehlgeschlagen.',
    // Forgot password / reset flow
    'auth.forgotPassword.success': 'Falls ein Konto mit dieser E-Mail existiert, erhalten Sie einen OTP.',
    'auth.forgotPassword.error.invalidEmail': 'Ungültiges E-Mail-Format.',
    'auth.forgotPassword.error.failed': 'Anfrage konnte nicht verarbeitet werden.',
    'auth.resetPassword.otp.email.subject': 'Ihr Code zum Zurücksetzen des Passworts',
    'auth.resetPassword.otp.email.body': 'Ihr Code zum Zurücksetzen des Passworts lautet: {otp}. Er läuft in 2 Minuten ab.',
    'auth.verifyResetOtp.success': 'OTP erfolgreich verifiziert. Sie können jetzt Ihr Passwort zurücksetzen.',
    'auth.verifyResetOtp.error.required': 'E-Mail und OTP sind erforderlich.',
    'auth.verifyResetOtp.error.invalidOrExpired': 'Ungültiges oder abgelaufenes OTP.',
    'auth.verifyResetOtp.error.maxAttempts': 'Maximale Versuche überschritten. Bitte fordern Sie ein neues OTP an.',
    'auth.verifyResetOtp.error.failed': 'OTP-Verifizierung fehlgeschlagen.',
    'auth.resetPassword.success': 'Passwort erfolgreich zurückgesetzt.',
    'auth.resetPassword.error.unauthorized': 'Gültiges temporäres Token erforderlich.',
    'auth.resetPassword.error.invalidToken': 'Ungültiges oder abgelaufenes Token. Bitte OTP-Verifizierung erneut durchführen.',
    'auth.resetPassword.error.fieldsRequired': 'Neues Passwort und Bestätigung sind erforderlich.',
    'auth.resetPassword.error.passwordMismatch': 'Passwörter stimmen nicht überein.',
    'auth.resetPassword.error.passwordTooShort': 'Passwort muss mindestens 6 Zeichen haben.',
    'auth.resetPassword.error.failed': 'Passwort-Zurücksetzung fehlgeschlagen.',
    // Add more German messages here
  },
  fi: {
    'test.hello.success': 'Hei. Tämä projekti on käynnissä.',
    'test.hello.message': 'Hei. Tämä projekti on käynnissä.',
    // Awin job messages
    'awin.job.email.notSet': 'JOB_EMAIL ei ole asetettu. Sähköposti ohitetaan.',
    'awin.job.email.failure.subject': '[AWIN FEED] Tehtävä epäonnistui (yritys {attempt}/{maxAttempts})',
    'awin.job.email.failure.body': 'AWIN Feed Ingestion -tehtävä epäonnistui\n\nAikaleima: {timestamp}\nYritys: {attempt}/{maxAttempts}\nVirhe: {error}\n\nStack: {stack}',
    'awin.job.email.success.subject': '[AWIN FEED] Tehtävä valmistui onnistuneesti',
    'awin.job.email.success.body': 'AWIN Feed Ingestion -tehtävä valmistui onnistuneesti\n\nAikaleima: {timestamp}\nKäsiteltyjä rivejä: {processedRows}\nOhitettuja rivejä: {skippedRows}\nYhteensä rivejä: {totalRows}\nSuoritusaika: {duration}ms',
    'awin.job.email.sendError': 'Virhe lähettäessä {type} sähköpostia',
    'awin.job.log.downloading': 'Ladataan feediä osoitteesta: {url}',
    'awin.job.log.downloaded': 'Feedi ladattu, aloitetaan purkaminen ja jäsentäminen...',
    'awin.job.log.startingAttempt': 'Aloitetaan yritys {attempt}/{maxAttempts}',
    'awin.job.log.completed': 'Tehtävä valmistui onnistuneesti',
    'awin.job.log.attemptFailed': 'Yritys {attempt}/{maxAttempts} epäonnistui: {error}',
    'awin.job.log.retrying': 'Yritetään heti uudelleen (yritys {nextAttempt}/{maxAttempts})...',
    'awin.job.log.allAttemptsFailed': 'Kaikki yritykset epäonnistuivat. Tämä ajo ohitetaan.',
    'awin.job.log.skippingRow': 'Rivi ohitetaan - vaaditut kentät puuttuvat',
    'awin.job.log.errorProcessingRow': 'Virhe käsiteltäessä riviä',
    'awin.job.log.csvParsingCompleted': 'CSV-jäsentäminen valmistui',
    'awin.job.log.csvParsingError': 'CSV-jäsentämisvirhe',
    'awin.job.log.gzipError': 'Gzip-purkamisvirhe',
    'awin.job.log.previousRunInProgress': 'Edellinen ajo vielä käynnissä. Ohitetaan.',
    'awin.job.log.jobStarted': 'Tehtävä aloitettu kello {timestamp}',
    'awin.job.log.jobFinished': 'Tehtävä päättyi kello {timestamp}',
    'awin.job.log.jobScheduled': 'Cron-tehtävä ajastettu aikataululla: {schedule}',
    'awin.job.log.runningOnStartup': 'Feedi-ingestio ajetaan heti käynnistyksessä',
    'awin.job.log.immediateRunFailed': 'Hätäajo epäonnistui',
    'awin.job.log.jobFailedAfterRetries': 'Tehtävä epäonnistui kaikkien uudelleenyritysten jälkeen',
    'awin.job.error.missingFeedUrl': 'Ympäristömuuttuja AWIN_PRODUCT_FEED_URL puuttuu',
    'awin.job.error.missingCronSchedule': 'Ympäristömuuttuja AWIN_FEED_CRON_SCHEDULE puuttuu. Tehtävää ei käynnistetä.',
    'awin.job.error.invalidCronSchedule': 'Virheellinen cron-aikataulu: {schedule}. Tehtävää ei käynnistetä.',
    // Click API messages
    'click.create.success': 'Klikkaus luotu onnistuneesti.',
    'click.create.error.invalidProductId': 'Virheellinen productId. Täytyy olla validi MongoDB ObjectId.',
    'click.create.error.sourceRequired': 'source vaaditaan.',
    'click.create.error.productNotFound': 'Tuotetta ei löytynyt.',
    'click.create.error.productInactive': 'Tuotetta ei löytynyt tai se on pois käytöstä.',
    'click.create.error.failed': 'Klikkauksen luonti epäonnistui.',
    'click.redirect.error.clickIdRequired': 'clickId vaaditaan.',
    'click.redirect.error.clickNotFound': 'Klikkausta ei löytynyt.',
    'click.redirect.error.productNotFound': 'Tuotetta ei löytynyt.',
    'click.redirect.error.missingPublisherId': 'Palvelimen määritysvirhe.',
    'click.redirect.error.missingDeeplinkUrl': 'Tuotteen deeplink-URL puuttuu.',
    'click.redirect.error.failed': 'Uudelleenohjaus epäonnistui.',
    // Product API messages
    'product.list.success': 'Tuotteet haettu onnistuneesti.',
    'product.paginated.success': 'Sivutut tuotteet haettu onnistuneesti.',
    'product.error.invalidPage': 'Virheellinen page-parametri. Täytyy olla positiivinen kokonaisluku yhdestä alkaen.',
    'product.error.invalidPageSize': 'Virheellinen pageSize-parametri. Täytyy olla positiivinen kokonaisluku.',
    'product.error.failed': 'Tuotteiden haku epäonnistui.',
    // User messages
    'user.profile.success': 'Käyttäjätiedot haettu onnistuneesti.',
    'user.profile.error.notFound': 'Käyttäjää ei löytynyt.',
    'user.profile.error.unauthorized': 'Todentaminen vaaditaan.',
    // Auth / OTP / User messages
    'auth.requestOtp.success': 'OTP lähetetty onnistuneesti. Tarkista sähköpostisi.',
    'auth.requestOtp.error.invalidEmail': 'Virheellinen sähköpostimuoto.',
    'auth.requestOtp.error.userExists': 'Tällä sähköpostilla on jo tili.',
    'auth.requestOtp.error.failed': 'OTP:n lähetys epäonnistui.',
    'auth.verifyOtp.success': 'OTP vahvistettu onnistuneesti.',
    'auth.verifyOtp.error.required': 'Sähköposti ja OTP vaaditaan.',
    'auth.verifyOtp.error.invalidOrExpired': 'Virheellinen tai vanhentunut OTP.',
    'auth.verifyOtp.error.maxAttempts': 'Enimmäisyritykset ylitetty. Pyydä uusi OTP.',
    'auth.verifyOtp.error.failed': 'OTP-vahvistus epäonnistui.',
    'auth.register.success': 'Rekisteröinti onnistui.',
    'auth.register.error.unauthorized': 'Voimassa oleva väliaikainen tunnus vaaditaan.',
    'auth.register.error.invalidToken': 'Virheellinen tai vanhentunut tunnus. Suorita OTP-vahvistus uudelleen.',
    'auth.register.error.fieldsRequired': 'Sähköposti, nimi, salasana ja vahvistus vaaditaan.',
    'auth.register.error.passwordMismatch': 'Salasanat eivät täsmää.',
    'auth.register.error.passwordTooShort': 'Salasanan tulee olla vähintään 6 merkkiä.',
    'auth.register.error.failed': 'Rekisteröinti epäonnistui.',
    'auth.otp.email.subject': 'Vahvistuskoodisi',
    'auth.otp.email.body': 'Vahvistuskoodisi on: {otp}. Se vanhenee 2 minuutissa.',
    'auth.email.error.nodemailerNotConfigured': 'Nodemailer ei ole määritetty. EMAIL_HOST, EMAIL_USER ja EMAIL_PASS vaaditaan.',
    'auth.email.error.sendGridNotConfigured': 'SendGrid ei ole määritetty. SENDGRID_API_KEY ja SENDGRID_FROM_EMAIL vaaditaan.',
    // Login messages
    'auth.login.success': 'Kirjautuminen onnistui.',
    'auth.login.error.emailRequired': 'Sähköposti vaaditaan.',
    'auth.login.error.invalidEmail': 'Virheellinen sähköpostimuoto.',
    'auth.login.error.passwordRequired': 'Salasana vaaditaan.',
    'auth.login.error.emailNotFound': 'Tällä sähköpostilla ei ole tiliä.',
    'auth.login.error.incorrectPassword': 'Salasana on väärä.',
    'auth.login.error.failed': 'Kirjautuminen epäonnistui.',
    // Forgot password / reset flow
    'auth.forgotPassword.success': 'Jos tällä sähköpostilla on tili, saat OTP-koodin.',
    'auth.forgotPassword.error.invalidEmail': 'Virheellinen sähköpostimuoto.',
    'auth.forgotPassword.error.failed': 'Pyyntöä ei voitu käsitellä.',
    'auth.resetPassword.otp.email.subject': 'Salasanan palautuskoodisi',
    'auth.resetPassword.otp.email.body': 'Salasanan palautuskoodisi on: {otp}. Se vanhenee 2 minuutissa.',
    'auth.verifyResetOtp.success': 'OTP vahvistettu onnistuneesti. Voit nyt vaihtaa salasanasi.',
    'auth.verifyResetOtp.error.required': 'Sähköposti ja OTP vaaditaan.',
    'auth.verifyResetOtp.error.invalidOrExpired': 'Virheellinen tai vanhentunut OTP.',
    'auth.verifyResetOtp.error.maxAttempts': 'Enimmäisyritykset ylitetty. Pyydä uusi OTP.',
    'auth.verifyResetOtp.error.failed': 'OTP-vahvistus epäonnistui.',
    'auth.resetPassword.success': 'Salasana vaihdettu onnistuneesti.',
    'auth.resetPassword.error.unauthorized': 'Voimassa oleva väliaikainen tunnus vaaditaan.',
    'auth.resetPassword.error.invalidToken': 'Virheellinen tai vanhentunut tunnus. Suorita OTP-vahvistus uudelleen.',
    'auth.resetPassword.error.fieldsRequired': 'Uusi salasana ja vahvistus vaaditaan.',
    'auth.resetPassword.error.passwordMismatch': 'Salasanat eivät täsmää.',
    'auth.resetPassword.error.passwordTooShort': 'Salasanan tulee olla vähintään 6 merkkiä.',
    'auth.resetPassword.error.failed': 'Salasanan vaihto epäonnistui.',
    // Add more Finnish messages here
  }
};

// List of supported language codes
const supportedLanguages = Object.keys(messages);

/**
 * Resolve language from Accept-Language header with fallback logic
 * @param {string} acceptLanguage - Accept-Language header value
 * @returns {string} - Resolved language code (default: 'en')
 */
const resolveLanguage = (acceptLanguage) => {
  // Default to 'en' if header is missing or empty
  if (!acceptLanguage || acceptLanguage.trim() === '') {
    return 'en';
  }

  // Parse Accept-Language header (e.g., "en-US,en;q=0.9,de;q=0.8")
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const parts = lang.trim().split(';');
      const code = parts[0].trim().toLowerCase();
      const quality = parts[1] ? parseFloat(parts[1].split('=')[1]) : 1.0;
      return { code, quality };
    })
    .sort((a, b) => b.quality - a.quality); // Sort by quality (preference)

  // Try to find first supported language
  for (const lang of languages) {
    // Check exact match (e.g., "en")
    if (supportedLanguages.includes(lang.code)) {
      return lang.code;
    }
    // Check primary language code (e.g., "en" from "en-US")
    const primaryCode = lang.code.split('-')[0];
    if (supportedLanguages.includes(primaryCode)) {
      return primaryCode;
    }
  }

  // Fallback to 'en' if no supported language found
  return 'en';
};

/**
 * Get localized message by key
 * @param {string} key - Message key
 * @param {string} language - Language code
 * @returns {string|null} - Localized message or null if not found
 */
const getLocalizedMessage = (key, language = 'en') => {
  // Ensure language is supported, fallback to 'en'
  const resolvedLanguage = supportedLanguages.includes(language) ? language : 'en';
  
  // Try to get message in requested language
  if (messages[resolvedLanguage] && messages[resolvedLanguage][key]) {
    return messages[resolvedLanguage][key];
  }
  
  // Fallback to English if message not found in requested language
  if (messages.en && messages.en[key]) {
    return messages.en[key];
  }
  
  // Return null if message not found at all
  return null;
};

/**
 * Get localized message from request object
 * @param {string} key - Message key
 * @param {object} req - Express request object (must have req.language or req.headers['accept-language'])
 * @returns {string|null} - Localized message or null if not found
 */
const getLocalizedMessageFromRequest = (key, req) => {
  // Use req.language if set by middleware, otherwise resolve from header
  const language = req.language || resolveLanguage(req.headers['accept-language']);
  
  return getLocalizedMessage(key, language);
};

/**
 * Get localized error message
 * @param {string} key - Error message key
 * @param {string} language - Language code
 * @returns {string} - Localized error message (always returns a string, never null)
 */
const getLocalizedErrorMessage = (key, language = 'en') => {
  const message = getLocalizedMessage(key, language);
  // Always return a string, use key as fallback if message not found
  return message || key;
};

module.exports = {
  getLocalizedMessageFromRequest,
  getLocalizedMessage,
  getLocalizedErrorMessage,
  resolveLanguage,
  supportedLanguages,
  messages
};
