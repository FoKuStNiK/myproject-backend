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

        socket.on('message', rawMessage => {
            let message;

            try {
                message = JSON.parse(rawMessage.toString());
            } catch (error) {
                send(socket, { type: 'ERROR', message: 'Некорректный формат сообщения' });
                return;
            }

            if (message.type === 'PONG') {
                socket.isAlive = true;
                console.log('🏓 Клиент ответил PONG');
                return;
            }

            send(socket, { type: 'ERROR', message: 'Неизвестный тип сообщения' });
        });

        socket.on('close', () => {
            console.log('🔌 WebSocket клиент отключён');
        });
    });

    // WebSocket используется как подписка на изменения таблицы.
    // PING/PONG нужен только для проверки живого соединения.
    const heartbeatInterval = setInterval(() => {
        wss.clients.forEach(socket => {
            if (socket.isAlive === false) {
                console.log('❌ WebSocket клиент не отвечает');
                socket.terminate();
                return;
            }

            socket.isAlive = false;
            console.log('🏓 Отправляем PING клиенту');

            send(socket, {
                type: 'PING',
                timestamp: Date.now()
            });
        });
    }, 30000);

    wss.on('close', () => {
        clearInterval(heartbeatInterval);
    });
};

module.exports = { setupTableSocket, broadcast };
