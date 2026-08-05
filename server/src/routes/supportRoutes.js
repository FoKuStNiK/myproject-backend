const express = require('express');
const router = express.Router();
const { getSupport } = require('../controllers/supportController');

router.get('/support', getSupport);

module.exports = router;