const db = require('../db'); // better-sqlite3

// ========== GET /api/table-data ==========
const getTableData = (req, res) => {
    try {
        const rows = db.prepare('SELECT row_number, col_number, cell_value FROM table_data ORDER BY row_number, col_number').all();
        
        const table = [];
        for (let i = 0; i < 6; i++) {
            const row = rows.slice(i * 4, i * 4 + 4).map(r => r.cell_value);
            table.push(row);
        }
        res.json(table);
    } catch (err) {
        console.error('Ошибка чтения таблицы:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// ========== PATCH /api/table-data/cell ==========
const updateCell = (req, res) => {
    const { row, col, value } = req.body;

    if (row === undefined || col === undefined || value === undefined) {
        return res.status(400).json({ error: 'Не все данные переданы' });
    }

    if (row < 0 || row > 5 || col < 0 || col > 3) {
        return res.status(400).json({ error: 'Индекс ячейки вне диапазона' });
    }

    try {
        const result = db.prepare('UPDATE table_data SET cell_value = ? WHERE row_number = ? AND col_number = ?').run(value, row, col);
        
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Ячейка не найдена' });
        }

        res.json({ success: true, message: 'Ячейка сохранена' });
    } catch (err) {
        console.error('Ошибка обновления ячейки:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// ========== DELETE /api/table-data ==========
const clearTable = (req, res) => {
    try {
        db.prepare('UPDATE table_data SET cell_value = ""').run();

        const emptyTable = [
            ['', '', '', ''],
            ['', '', '', ''],
            ['', '', '', ''],
            ['', '', '', ''],
            ['', '', '', ''],
            ['', '', '', '']
        ];
        res.json(emptyTable);
    } catch (err) {
        console.error('Ошибка очистки таблицы:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

module.exports = { getTableData, updateCell, clearTable };