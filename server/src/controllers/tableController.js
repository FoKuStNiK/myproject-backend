const { getTableData, updateCell } = require('../services/tableService');
const { broadcast } = require('../websocket/tableSocket');

const getTable = (req, res) => {
    try {
        res.json(getTableData());
    } catch (error) {
        console.error('Ошибка чтения таблицы:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

const updateTableCell = (req, res) => {
    const { row, col, value } = req.body;

    try {
        const result = updateCell(row, col, value);

        broadcast({
            type: 'CELL_UPDATED',
            row,
            col,
            value
        });

        res.json(result);
    } catch (error) {
        console.error('Ошибка обновления ячейки:', error);
        res.status(error.code || 500).json({
            error: error.code ? error.message : 'Ошибка сервера'
        });
    }
};

module.exports = { getTable, updateTableCell };
