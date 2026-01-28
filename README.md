# Awin Affiliate Backend (Node.js + Express + MongoDB)

**This project exists to demonstrate real-world affiliate backend architecture without relying on merchant-side integrations.**

### 1. Project Overview
This project is a standalone backend that ingests an **Awin product feed**, stores normalized products in MongoDB, and implements an **affiliate click/redirect flow** suitable for real-world affiliate systems.

It exists to demonstrate **production-minded backend architecture** (service layer, cron ingestion, idempotent persistence, environment-driven configuration, localized messaging) without requiring merchant-side setup or “demo-only” shortcuts.

At a high level, the system:
- **Pulls and ingests Awin product feeds** on a schedule (gzip CSV stream → parsing → upsert into MongoDB).
- Exposes **product browsing APIs** (all products + paginated search).
- Provides an **affiliate click flow** that creates a click record and returns a short redirect URL, which then redirects to an Awin tracking URL.
- Implements an **OTP-based auth module** (registration + login + password reset) with JWT token-based authentication.

### 2. Architecture & Design Principles
- **MVC + Service Layer**: routes → controllers (thin) → services (business logic) → models (Mongoose).
- **Separation of concerns**: controllers only read `req`, call services, format responses, and `next(error)`.
- **Stateless REST API**: authentication via JWT tokens.
- **Environment-driven configuration**: behavior and external integrations are controlled via `.env` (cron schedule, Mongo connection, Awin IDs, email providers).
- **Production-ready patterns**:
  - streaming ingestion (memory-safe for large feeds),
  - retries with bounded attempts,
  - idempotent upserts,
  - consistent error responses and localization.

### 3. Tech Stack
- **Node.js**, **Express**
- **MongoDB + Mongoose**
- **node-cron** (scheduled ingestion job)
- **Awin Affiliate Network**
- **Axios** (feed download as stream)
- **csv-parser** + **zlib** (gzip CSV parsing)
- **JWT (jsonwebtoken)** + **bcryptjs**
- **Dual email service support**: The project includes two email service implementations:
  - **Nodemailer** (Node.js native SMTP client) - uses SMTP credentials (EMAIL_HOST, EMAIL_USER, EMAIL_PASS)
  - **SendGrid** (third-party email API) - uses API key authentication (SENDGRID_API_KEY, SENDGRID_FROM_EMAIL)
  - Both services expose identical interfaces (`sendRegistrationOtp`, `sendPasswordResetOtp`), allowing users to switch between them via environment configuration **without changing any application code**. The system automatically uses the configured service based on available environment variables.

### 4. Core Domains / Controllers
#### Product
- **Feed ingestion**: products are sourced from Awin’s feed and stored in a normalized `Product` model.
- **Normalized schema**: designed to preserve Awin identifiers (merchant/product IDs) and key attributes (price, category, deeplink).
- **Pagination + search**: paginated endpoint supports query search across product name and category.
- **Why MongoDB**: flexible schema for evolving feed attributes, efficient document reads for browsing/search, and natural fit for ingestion/upsert workloads.

#### Click
- **Affiliate click handling**:
  - A protected API creates a `Click` record associated with the authenticated user.
  - A public redirect endpoint resolves `clickId` → product → Awin redirect URL.
- **Deeplink generation**: builds Awin tracking URL with merchant ID, publisher ID, original deeplink, and click reference.
- **Redirect flow**: separates “creation” (API) from “redirection” (public route), mirroring real affiliate link behavior.
- **Why this matters**: affiliate systems require robust, auditable click tracking, deterministic redirect construction, and safe public endpoints.

#### Auth & User
- **Authentication architecture**:
  - **JWT-based stateless authentication**: users authenticate via email/password and receive a JWT access token containing `userId` and `email`.
  - **Token lifecycle**: tokens are signed with `JWT_SECRET`, include expiration (default 7 days), and are verified on protected routes via the `protect` middleware.
  - **OTP-based registration flow**: 
    - User requests OTP → receives 6-digit code via email (SendGrid/Nodemailer).
    - User verifies OTP → receives a temporary token (short-lived, ~2 minutes).
    - User completes registration with temp token → receives long-lived JWT access token.
  - **Password reset flow**: same OTP pattern (request → verify → reset with temp token).
  - **Login flow**: email/password → bcrypt verification → JWT access token.
- **Security considerations**:
  - Passwords are hashed with bcrypt (10 rounds).
  - OTPs expire after 2 minutes and are single-use.
  - Temporary tokens are short-lived (2 minutes) and tied to OTP verification.
  - JWT tokens include expiration and are verified on every protected request.
  - User association: authenticated requests attach `req.user = { userId, email }` via the `protect` middleware.
- **How it scales**:
  - Refresh tokens for long-lived sessions without re-authentication.
  - Role-based access control (RBAC) by extending JWT payload with roles/permissions.
  - Device/session tracking via token metadata.
  - Account lifecycle states (deleted/disabled) via `isDeleted` flag.
  - Rate limiting and OTP abuse prevention (per-IP and per-email) as a next step.

### 5. Awin Integration (Very Important Section)
**Awin** is an affiliate network where publishers promote merchant products using tracking links. This backend focuses on the two core building blocks needed for an affiliate browsing + click system:

**Implemented**
- **Feed ingestion**: scheduled download + stream parse + product upsert.
- **Deeplinks**: `Product.deeplinkUrl` is used to build Awin tracking URLs.
- **Click flow**:
  - create click → return short redirect URL,
  - redirect resolves to an Awin URL including `clickref`.

**Intentionally NOT implemented (by design)**
- **Conversion tracking / postbacks**
- **Commission reconciliation**
- **Order attribution and reporting**

**Why this is acceptable for a portfolio project**
- These parts depend on **merchant-side conversion events**, network-side settings, and reconciliation workflows that can’t be demonstrated reliably in a standalone repo.
- The project focuses on what can be validated end-to-end in isolation: **feed ingestion, product browsing, click creation, and deterministic redirect construction**.

### 6. Cron Job: Awin Feed Ingestion
The ingestion job (see `jobs/awinFeedIngestion.job.js`) is designed for correctness and operational safety:

- **Step-by-step**:
  - downloads the feed as a stream,
  - gunzips it,
  - parses CSV rows incrementally,
  - maps fields into the `Product` schema,
  - upserts each product using a compound unique key.
- **Retry strategy**: bounded retries (default 3) for each run; failures are surfaced without crashing the process.
- **Error handling**: parsing and per-row failures are handled without aborting the entire ingestion run.
- **Idempotency**: uses a compound unique index (`awinMerchantId + awinProductId`) and upsert behavior to avoid duplicates.
- **Production-safe design**: streaming + upsert + bounded retries is a reliable baseline for feed ingestion pipelines.

### 7. Error Handling & Localization
- **Centralized error handling**: errors bubble via `next(error)` and are formatted by the global error handler.
- **Localization**: all user-facing messages are resolved via `utils/localization.js`.
- **Language fallback**:
  - request language is resolved from `Accept-Language`,
  - unsupported languages fall back to **English**.

### 8. Environment Configuration
The system is configured via `.env` (see `env.example`):
- **Separation of dev vs prod**: behavior like protocol selection and error verbosity is environment-aware.
- **Email service selection**: Configure either Nodemailer (SMTP) or SendGrid (API) by setting the respective environment variables. The system automatically detects and uses the configured service without requiring code changes:
  - **Nodemailer**: Set `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM`
  - **SendGrid**: Set `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`
- **Safety considerations**:
  - keep secrets out of source control,
  - use app passwords for SMTP providers,
  - treat Awin and email credentials as production secrets.

### 9. What This Project Demonstrates
- Real-world **affiliate backend design** (feed + click + redirect).
- Clean **service-layer architecture** and consistent controller patterns.
- A practical **data ingestion pipeline** with idempotent persistence.
- Production thinking: retries, error boundaries, configuration, and localization.
- Ability to build an interview-ready system without requiring live merchant onboarding.

### 10. How This Project Would Scale Further
- **User personalization**: saved products, preferences, recommended feeds.
- **Conversion tracking**: postback ingestion, attribution, reconciliation (requires merchant/network integration).
- **Analytics**: click funnels, search analytics, product performance dashboards.
- **Performance**:
  - indexes for search fields,
  - caching for hot product queries,
  - background queues for non-critical work (email, analytics writes).

### Folder Structure (quick map)
- **Entry points**: `app.js` (Express config + routes + cron start), `server.js` (env + DB + listen)
- **Cron job**: `jobs/awinFeedIngestion.job.js`
- **Controllers**: `controllers/` (thin)
- **Services**: `services/` (business logic + integrations)
- **Models**: `models/` (Mongoose schemas)
- **Routes**: `routes/` (URL → controller mapping)
- **Middleware**: `middleware/` (auth, language, error handler)
- **Utils**: `utils/` (localization, jwt, validators, errors)
