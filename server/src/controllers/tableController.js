const { updateCell } = require('../services/tableService');
const { broadcast } = require('../websocket/tableSocket');

const updateTableCell = (req, res) => {
    const { row, col, value } = req.body;

    try {
        const result = updateCell(row, col, value);

        broadcast({
            type: 'cell:updated',
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

module.exports = { updateTableCell };
