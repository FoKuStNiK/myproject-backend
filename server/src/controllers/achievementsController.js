const db = require('../db');

const getAchievements = (req, res) => {
    try {
        const row = db.prepare('SELECT message FROM page_content WHERE page_name = ?').get('achievements');
        if (!row) {
            return res.status(404).json({ error: 'Достижения не найдены' });
        }
        res.json({ message: row.message });
    } catch (err) {
        console.error('Ошибка загрузки достижений:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

module.exports = { getAchievements };