const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'data', 'database.sqlite');

// Создаём папку data, если её нет
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Ошибка подключения к SQLite:', err.message);
        process.exit(1);
    }
    console.log('✅ Подключено к SQLite');

    // Создаём таблицу для истории миграций
    db.run(`CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE,
        executed_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('❌ Ошибка создания таблицы migrations:', err.message);
            return;
        }
        // Запускаем миграции
        runMigrations(db);
    });
});

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

    let pending = files.length;
    let completed = 0;

    files.forEach((file) => {
        const name = path.basename(file, '.sql');

        db.get('SELECT * FROM migrations WHERE name = ?', [name], (err, row) => {
            if (err) {
                console.error('❌ Ошибка проверки миграции:', err.message);
                pending--;
                return;
            }

            if (row) {
                console.log(`⏭️ Миграция ${file} уже выполнена, пропускаем`);
                pending--;
                return;
            }

            console.log(`🔄 Выполняется миграция: ${file}`);
            const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

            db.exec(sql, (err) => {
                if (err) {
                    console.error(`❌ Ошибка миграции ${file}:`, err.message);
                } else {
                    db.run('INSERT INTO migrations (name) VALUES (?)', [name], (err) => {
                        if (err) {
                            console.error(`❌ Ошибка записи истории: ${file}`, err.message);
                        } else {
                            console.log(`✅ Миграция ${file} выполнена`);
                        }
                    });
                }
                pending--;
            });
        });
    });
}

module.exports = db;