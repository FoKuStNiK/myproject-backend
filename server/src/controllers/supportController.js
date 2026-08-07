const db = require('../db');

const getSupport = (req, res) => {
    try {
        const row = db.prepare('SELECT message FROM page_content WHERE page_name = ?').get('support');
        if (!row) {
            return res.status(404).json({ error: 'Поддержка не найдена' });
        }
        res.json({ message: row.message });
    } catch (err) {
        console.error('Ошибка загрузки поддержки:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

module.exports = { getSupport };