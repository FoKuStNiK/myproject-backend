const express = require('express');
const router = express.Router();

const newsRoutes = require('./newsRoutes');
const achievementsRoutes = require('./achievementsRoutes');
const supportRoutes = require('./supportRoutes');
const tableRoutes = require('./tableRoutes');

router.use('/api', newsRoutes);
router.use('/api', achievementsRoutes);
router.use('/api', supportRoutes);
router.use('/api', tableRoutes);

module.exports = router;
