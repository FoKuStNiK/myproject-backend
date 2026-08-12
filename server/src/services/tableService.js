const db = require('../db'); // better-sqlite3

const getTableData = () => {
    const rows = db.prepare('SELECT row_number, col_number, cell_value FROM table_data ORDER BY row_number, col_number').all();

    const table = [];
    for (let i = 0; i < 6; i++) {
        const row = rows.slice(i * 4, i * 4 + 4).map(r => r.cell_value);
        table.push(row);
    }
    return table;
};

const updateCell = (row, col, value) => {
    if (row === undefined || col === undefined || value === undefined) {
        const error = new Error('Не все данные переданы');
        error.code = 400;
        throw error;
    }

    if (row < 0 || row > 5 || col < 0 || col > 3) {
        const error = new Error('Индекс ячейки вне диапазона');
        error.code = 400;
        throw error;
    }

    const result = db.prepare('UPDATE table_data SET cell_value = ? WHERE row_number = ? AND col_number = ?').run(value, row, col);

    if (result.changes === 0) {
        const error = new Error('Ячейка не найдена');
        error.code = 404;
        throw error;
    }

    return { success: true, message: 'Ячейка сохранена' };
};

const clearTable = () => {
    db.prepare('UPDATE table_data SET cell_value = ""').run();

    return [
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', '']
    ];
};

module.exports = { getTableData, updateCell, clearTable };
