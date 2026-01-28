const express = require('express');
const { createClick, redirectClick } = require('../controllers/clickController');
const { protect } = require('../middleware/auth');

const apiRouter = express.Router();
apiRouter.post('/', protect, createClick);

const redirectRouter = express.Router();
redirectRouter.get('/r/:clickId', redirectClick);

module.exports = {
  api: apiRouter,
  redirect: redirectRouter
};
