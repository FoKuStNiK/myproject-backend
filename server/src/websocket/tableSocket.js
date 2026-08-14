const { WebSocket } = require('ws');

let wssInstance = null;

// Вызывается один раз при запуске сервера
const setupTableSocket = (wss) => {
    wssInstance = wss;

    wss.on('connection', (socket) => {
        console.log('🔌 WebSocket клиент подключён');

        socket.on('close', () => {
            console.log('🔌 WebSocket клиент отключён');
        });
    });
};

// Рассылает сообщение всем подключённым клиентам
const broadcast = (message) => {
    if (!wssInstance) {
        return;
    }

    const data = JSON.stringify(message);

    wssInstance.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};

module.exports = {
    setupTableSocket,
    broadcast
};