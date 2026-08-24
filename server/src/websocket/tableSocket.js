const { WebSocket } = require('ws');
const { updateCell, clearTable } = require('../services/tableService');

let wssInstance = null;
let nextClientId = 1;

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
        socket.clientId = nextClientId++;
        socket.isAlive = true;

        console.log(`🔌 WebSocket клиент ${socket.clientId} подключён`);

        send(socket, {
            type: 'CLIENT_ASSIGNED',
            clientId: socket.clientId
        });

        socket.on('message', rawMessage => {
            let message;

            try {
                message = JSON.parse(rawMessage.toString());
            } catch (error) {
                send(socket, { type: 'ERROR', message: 'Некорректный формат сообщения' });
                return;
            }

            try {
                switch (message.type) {
                    case 'PONG': {
                        socket.isAlive = true;
                        console.log(`🏓 Клиент ${socket.clientId} ответил PONG`);
                        break;
                    }

                    case 'CELL_UPDATE': {
                        const result = updateCell(
                            message.row,
                            message.col,
                            message.value
                        );

                        broadcast({
                            type: 'CELL_UPDATED',
                            row: message.row,
                            col: message.col,
                            value: message.value,
                            clientId: socket.clientId
                        });

                        send(socket, {
                            type: 'CELL_SAVED',
                            row: message.row,
                            col: message.col,
                            ...result
                        });
                        break;
                    }

                    case 'TABLE_CLEAR': {
                        const data = clearTable();

                        broadcast({
                            type: 'TABLE_CLEARED',
                            data
                        });

                        send(socket, {
                            type: 'TABLE_CLEAR_RESULT',
                            success: true
                        });
                        break;
                    }

                    default:
                        send(socket, { type: 'ERROR', message: 'Неизвестный тип сообщения' });
                }
            } catch (error) {
                console.error('Ошибка WebSocket таблицы:', error);
                send(socket, {
                    type: 'ERROR',
                    message: error.code ? error.message : 'Ошибка сервера'
                });
            }
        });

        socket.on('close', () => {
            console.log(`🔌 WebSocket клиент ${socket.clientId} отключён`);
        });
    });

    const heartbeatInterval = setInterval(() => {
        wss.clients.forEach(socket => {
            if (socket.isAlive === false) {
                console.log(`❌ WebSocket клиент ${socket.clientId} не отвечает`);
                socket.terminate();
                return;
            }

            socket.isAlive = false;
            console.log(`🏓 Отправляем PING клиенту ${socket.clientId}`);

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
