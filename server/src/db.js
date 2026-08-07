const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'data', 'database.sqlite');

// Создаём папку data, если её нет
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Подключаемся к SQLite через better-sqlite3
const db = new Database(dbPath);

console.log('✅ Подключено к SQLite (better-sqlite3)');

// Создаём таблицу для истории миграций (синхронно)
db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE,
        executed_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
`);

// Запускаем миграции
runMigrations(db);

function runMigrations(db) {
    const migrationsDir = path.join(__dirname, 'migrations');
    if (!fs.existsSync(migrationsDir)) {
        console.log('⚠️ Папка migrations не найдена, пропускаем');
        return;
    }

    const files = fs.readdirSync(migrationsDir)
        .filter(f => f.endsWith('.sql'))
        .sort();

    if (files.length === 0) {
        console.log('ℹ️ Нет новых миграций');
        return;
    }

    for (const file of files) {
        const name = path.basename(file, '.sql');

        // Проверяем, выполнялась ли миграция
        const row = db.prepare('SELECT * FROM migrations WHERE name = ?').get(name);

        if (row) {
            console.log(`⏭️ Миграция ${file} уже выполнена, пропускаем`);
            continue;
        }

        console.log(`🔄 Выполняется миграция: ${file}`);
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

        try {
            db.exec(sql);
            db.prepare('INSERT INTO migrations (name) VALUES (?)').run(name);
            console.log(`✅ Миграция ${file} выполнена`);
        } catch (err) {
            console.error(`❌ Ошибка миграции ${file}:`, err.message);
        }
    }
}

module.exports = db;