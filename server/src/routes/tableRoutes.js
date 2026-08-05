const express = require('express');
const router = express.Router();
const { getTableData, updateCell, clearTable } = require('../controllers/tableController');

router.get('/table-data', getTableData);
router.patch('/table-data/cell', updateCell);
router.delete('/table-data', clearTable);

module.exports = router;