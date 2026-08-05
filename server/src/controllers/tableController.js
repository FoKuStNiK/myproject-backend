console.log('__dirname:', __dirname);
console.log('Проверяем путь:', require.resolve('../db'));
const db = require('../db');

// ========== GET /api/table-data ==========
const getTableData = (req, res) => {
    db.all(
        'SELECT row_number, col_number, cell_value FROM table_data ORDER BY row_number, col_number',
        (err, rows) => {
            if (err) {
                console.error('Ошибка чтения таблицы:', err);
                return res.status(500).json({ error: 'Ошибка сервера' });
            }

            console.log('Данные из БД (первые 5):', rows.slice(0, 5)); // ← добавь

            // Превращаем плоский список (24 записи) в матрицу 6×4
            const table = [];
            for (let i = 0; i < 6; i++) {
                const row = rows.slice(i * 4, i * 4 + 4).map(r => r.cell_value);
                table.push(row);
            }
            res.json(table);
            console.log('Данные с координатами:', rows.slice(0, 5));
        }
    );
};

// ========== PATCH /api/table-data/cell ==========
const updateCell = (req, res) => {
    console.log('Получены данные:', req.body);
    const { row, col, value } = req.body;

    // Проверка обязательных полей
    if (row === undefined || col === undefined || value === undefined) {
        return res.status(400).json({ error: 'Не все данные переданы' });
    }

    // Проверка, что индексы в пределах таблицы (0–5 и 0–3)
    if (row < 0 || row > 5 || col < 0 || col > 3) {
        return res.status(400).json({ error: 'Индекс ячейки вне диапазона' });
    }

    // Обновляем только одну ячейку
    db.run(
        'UPDATE table_data SET cell_value = ? WHERE row_number = ? AND col_number = ?',
        [value, row, col],
        function (err) {
            if (err) {
                console.error('Ошибка обновления ячейки:', err);
                return res.status(500).json({ error: 'Ошибка сервера' });
            }

            // Проверяем, была ли обновлена хотя бы одна строка
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Ячейка не найдена' });
            }

            res.json({ success: true, message: 'Ячейка сохранена' });
        }
    );
};

// ========== DELETE /api/table-data ==========
const clearTable = (req, res) => {
    // Очищаем все ячейки (заменяем на пустые строки)
    db.run(
        'UPDATE table_data SET cell_value = ""',
        function (err) {
            if (err) {
                console.error('Ошибка очистки таблицы:', err);
                return res.status(500).json({ error: 'Ошибка сервера' });
            }

            // После очистки возвращаем пустую таблицу 6×4
            const emptyTable = [
                ['', '', '', ''],
                ['', '', '', ''],
                ['', '', '', ''],
                ['', '', '', ''],
                ['', '', '', ''],
                ['', '', '', '']
            ];
            res.json(emptyTable);
        }
    );
};

module.exports = { getTableData, updateCell, clearTable };