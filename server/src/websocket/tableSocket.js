const { WebSocket } = require('ws');

let wssInstance = null;


// Вызывается один раз при запуске сервера
const setupTableSocket = (wss) => {
    wssInstance = wss;

    wss.on('connection', (socket) => {
        console.log('🔌 WebSocket клиент подключён');

        // Сразу после подключения считаем клиента живым
        socket.isAlive = true;

        // Если клиент ответил pong — значит соединение живое
        socket.on('pong', () => {
            console.log("клиент ответил pong");
            socket.isAlive = true;
        });

        socket.on('close', () => {
            console.log('🔌 WebSocket клиент отключён');
        });
    });

    // Каждые 30 секунд проверяем все подключения
    const heartbeatInterval = setInterval(() => {
        wss.clients.forEach((socket) => {
            // Если клиент не ответил на предыдущий ping
            if (socket.isAlive === false) {
                console.log('❌ WebSocket клиент не отвечает');
                socket.terminate();
                return;
            }

            // Перед ping считаем, что ответ ещё не получен
            socket.isAlive = false;

            // Проверяем клиента
            console.log("отправляем ping клиенту");
            socket.ping();
        });
    }, 5000);

    // Если сам WebSocket-сервер закроется,
    // останавливаем таймер heartbeat
    wss.on('close', () => {
        clearInterval(heartbeatInterval);
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