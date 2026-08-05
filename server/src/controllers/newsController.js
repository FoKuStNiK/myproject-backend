const db = require('../db');

const getNews = (req, res) => {
    db.get(
        'SELECT message FROM page_content WHERE page_name = ?',
        ['news'],
        (err, row) => {
            if (err) {
                console.error('Ошибка загрузки новостей:', err);
                return res.status(500).json({ error: 'Ошибка сервера' });
            }
            if (!row) {
                return res.status(404).json({ error: 'Новости не найдены' });
            }
            res.json({ message: row.message });
        }
    );
};

module.exports = { getNews };