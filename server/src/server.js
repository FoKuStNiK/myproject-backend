const express = require('express');
const http = require('http');
const cors = require('cors');
const { WebSocketServer } = require('ws');
const routes = require('./routes');
const db = require('./db');
const { setupTableSocket } = require('./websocket/tableSocket');
const PORT = 5000;

const app = express();

app.use(cors());
app.use(express.json());
app.use('/', routes);

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

setupTableSocket(wss);

server.listen(PORT, () => {
    console.log(`✅ Сервер на http://localhost:${PORT}`);
});
