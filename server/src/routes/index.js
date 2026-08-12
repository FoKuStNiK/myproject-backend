const express = require('express');
const router = express.Router();

const newsRoutes = require('./newsRoutes');
const achievementsRoutes = require('./achievementsRoutes');
const supportRoutes = require('./supportRoutes');

router.use('/api', newsRoutes);
router.use('/api', achievementsRoutes);
router.use('/api', supportRoutes);

module.exports = router;
