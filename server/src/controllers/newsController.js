const db = require('../db');

const getNews = (req, res) => {
    try {
        const row = db.prepare('SELECT message FROM page_content WHERE page_name = ?').get('news');
        if (!row) {
            return res.status(404).json({ error: 'Новости не найдены' });
        }
        res.json({ message: row.message });
    } catch (error) {
        console.error('Ошибка загрузки новостей:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

module.exports = { getNews };