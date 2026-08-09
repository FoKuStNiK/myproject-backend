const db = require('../db');

const getNews = (req, res) => {
    console.log('🔵 Запрос к /api/news');
    
    try {
        // Просто проверяем, что база открыта
        console.log('🔵 База данных открыта:', !!db);
        
        // Проверяем таблицу
        const stmt = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='page_content'");
        const tableCheck = stmt.get();
        console.log('🔵 Таблица page_content:', tableCheck ? 'существует' : 'не найдена');
        
        if (!tableCheck) {
            // Создаём таблицу на лету
            db.exec(`
                CREATE TABLE IF NOT EXISTS page_content (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    page_name TEXT UNIQUE,
                    message TEXT
                )
            `);
            console.log('✅ Таблица создана');
            
            // Добавляем тестовые данные
            const insert = db.prepare('INSERT OR IGNORE INTO page_content (page_name, message) VALUES (?, ?)');
            insert.run('news', JSON.stringify({
                title: 'Новости',
                text: 'Добро пожаловать на сайт!'
            }));
        }
        
        // Получаем новости
        const getStmt = db.prepare('SELECT message FROM page_content WHERE page_name = ?');
        const row = getStmt.get('news');
        console.log('🔵 Найдена строка:', row ? 'да' : 'нет');
        
        if (!row) {
            return res.status(404).json({ error: 'Новости не найдены' });
        }
        
        // Пытаемся распарсить JSON
        let message = row.message;
        try {
            message = JSON.parse(row.message);
        } catch (e) {
            // Если не JSON, оставляем как есть
        }
        
        res.json({ message });
    } catch (err) {
        console.error('❌ Ошибка загрузки новостей:', err);
        console.error('❌ Стек:', err.stack);
        res.status(500).json({ 
            error: 'Ошибка сервера', 
            details: err.message,
            stack: err.stack
        });
    }
};

module.exports = { getNews };