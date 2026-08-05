const db = require('../db');

const getSupport = (req, res) => {
    db.get(
        'SELECT message FROM page_content WHERE page_name = ?',
        ['support'],
        (err, row) => {
            if (err) {
                console.error('Ошибка загрузки поддержки:', err);
                return res.status(500).json({ error: 'Ошибка сервера' });
            }
            if (!row) {
                return res.status(404).json({ error: 'Поддержка не найдена' });
            }
            res.json({ message: row.message });
        }
    );
};

module.exports = { getSupport };