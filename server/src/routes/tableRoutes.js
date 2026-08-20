const express = require('express');
const router = express.Router();
const { updateTableCell } = require('../controllers/tableController');

router.post('/table-data/cell', updateTableCell);

module.exports = router;
