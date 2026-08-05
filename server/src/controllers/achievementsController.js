const db = require('../db');

const getAchievements = (req, res) => {
    db.get(
        'SELECT message FROM page_content WHERE page_name = ?',
        ['achievements'],
        (err, row) => {
            if (err) {
                console.error('Ошибка загрузки достижений:', err);
                return res.status(500).json({ error: 'Ошибка сервера' });
            }
            if (!row) {
                return res.status(404).json({ error: 'Достижения не найдены' });
            }
            res.json({ message: row.message });
        }
    );
};

module.exports = { getAchievements };