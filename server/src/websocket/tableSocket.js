const { WebSocket } = require('ws');

let wssInstance = null;

const send = (socket, message) => {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
    }
};

const broadcast = (message) => {
    if (!wssInstance) return;
    wssInstance.clients.forEach(client => send(client, message));
};

const setupTableSocket = (wss) => {
    wssInstance = wss;

    wss.on('connection', socket => {
        console.log('🔌 WebSocket клиент подключён');

        socket.isAlive = true;

        socket.on('pong', () => {
            console.log('🏓 Клиент ответил pong');
            socket.isAlive = true;
        });

        socket.on('close', () => {
            console.log('🔌 WebSocket клиент отключён');
        });
    });

    const heartbeatInterval = setInterval(() => {
        wss.clients.forEach(socket => {
            if (socket.isAlive === false) {
                console.log('❌ WebSocket клиент не отвечает');
                socket.terminate();
                return;
            }

            socket.isAlive = false;
            console.log('🏓 Отправляем ping клиенту');
            socket.ping();
        });
    }, 5000);

    wss.on('close', () => {
        clearInterval(heartbeatInterval);
    });
};

module.exports = { setupTableSocket, broadcast };
