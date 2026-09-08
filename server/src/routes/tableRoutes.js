const express = require('express');
const router = express.Router();
const { getTable, updateTableCell } = require('../controllers/tableController');

router.get('/table-data', getTable);
router.post('/table-data/cell', updateTableCell);

module.exports = router;
