const express = require('express');
const router = express.Router();
const { getTable, updateTableCell, clearTableData } = require('../controllers/tableController');

router.get('/table-data', getTable);
router.patch('/table-data/cell', updateTableCell);
router.delete('/table-data', clearTableData);

module.exports = router;
