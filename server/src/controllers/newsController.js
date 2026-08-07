const db = require('../db');

const getNews = (req, res) => {
    try {
        const stmt = db.prepare('SELECT message FROM page_content WHERE page_name = ?');
        const row = stmt.get('news');
        
        if (!row) {
            return res.status(404).json({ error: 'Новости не найдены' });
        }
        
        res.json({ message: row.message });
    } catch (err) {
        console.error('Ошибка загрузки новостей:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

module.exports = { getNews };