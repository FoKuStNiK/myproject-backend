const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'data', 'database.sqlite');

// Создаём папку data, если её нет
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Проверяем, существует ли файл базы данных
const dbExists = fs.existsSync(dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Ошибка подключения к SQLite:', err.message);
        process.exit(1);
    }
    console.log('✅ Подключено к SQLite');

    if (!dbExists) {
        console.log('🔄 Файл базы не найден, создаём...');
        runInitSql();
    } else {
        console.log('✅ База данных уже существует, пропускаем инициализацию');
    }
});

function runInitSql() {
    const initSqlPath = path.join(__dirname, 'data', 'init.sql');
    if (fs.existsSync(initSqlPath)) {
        const initSql = fs.readFileSync(initSqlPath, 'utf8');
        db.exec(initSql, (err) => {
            if (err) {
                console.error('❌ Ошибка инициализации:', err.message);
            } else {
                console.log('✅ База данных инициализирована');
            }
        });
    } else {
        console.warn('⚠️ Файл init.sql не найден, база пустая');
    }
}

module.exports = db;