const data = require('../data/database');
const fs = require('fs');
const path = require('path');

// GET — получить всю таблицу
const getTableData = (req, res) => {
    const filePath = path.join(__dirname, '../data/database.js');
    const currentContent = fs.readFileSync(filePath, 'utf8');
    const jsonString = currentContent
        .replace(/^const data = /, '')
        .replace(/;\s*module\.exports = data;?\s*$/, '');
    const dataObject = JSON.parse(jsonString);
    res.json(dataObject.table);
};


const clearTable = (req, res) => {
    const filePath = path.join(__dirname, '../data/database.js');
    const currentContent = fs.readFileSync(filePath, 'utf8');
    const jsonString = currentContent
        .replace(/^const data = /, '')
        .replace(/;\s*module\.exports = data;?\s*$/, '');
    const dataObject = JSON.parse(jsonString);

    // Очищаем таблицу
    dataObject.table = [
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', '']
    ];

    const newContent = `const data = ${JSON.stringify(dataObject, null, 4)};\n\nmodule.exports = data;\n`;
    fs.writeFileSync(filePath, newContent, 'utf8');

    // Возвращаем пустую таблицу
    res.json(dataObject.table);
};


// POST — обновить одну ячейку
const updateCell = (req, res) => {
    const { row, col, value } = req.body;

    if (row === undefined || col === undefined || value === undefined) {
        return res.status(400).json({ error: 'Не все данные переданы' });
    }

    const filePath = path.join(__dirname, '../data/database.js');

    try {
        // Читаем файл
        const currentContent = fs.readFileSync(filePath, 'utf8');

        // Убираем `const data = ` и `module.exports = data;`
        let jsonString = currentContent
            .replace(/^const data = /, '')
            .replace(/;\s*module\.exports = data;?\s*$/, '');

        // Проверяем, что осталось
        console.log('Парсим строку:', jsonString);

        const dataObject = JSON.parse(jsonString);

        // Обновляем ячейку
        if (dataObject.table[row] && dataObject.table[row][col] !== undefined) {
            dataObject.table[row][col] = value;
        } else {
            return res.status(400).json({ error: 'Ячейка не найдена' });
        }

        // Записываем обратно
        const newContent = `const data = ${JSON.stringify(dataObject, null, 4)};\n\nmodule.exports = data;\n`;
        fs.writeFileSync(filePath, newContent, 'utf8');

        res.json({ success: true, message: 'Ячейка сохранена' });
    } catch (error) {
        console.error('Ошибка сохранения ячейки:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

module.exports = { getTableData, updateCell, clearTable };