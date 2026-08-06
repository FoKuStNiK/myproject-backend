const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const db = require('./db'); // ← импортируем db, а не initDb
const PORT = 5000;

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', routes);

// Просто запускаем сервер, не ждём БД
app.listen(PORT, () => {
    console.log(`✅ Сервер на http://localhost:${PORT}`);
});