const express = require('express');
const cors = require('cors');
const routes = require('./routes/index.js');
const PORT = 5000;

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', routes);

const startServer = async () => {
    await db.init(); // если у тебя есть такой метод
    app.listen(PORT, () => console.log(`✅ Сервер на http://localhost:${PORT}`));
};
startServer();