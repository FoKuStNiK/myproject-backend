const { WebSocket } = require('ws');
const { getTableData, updateCell, clearTable } = require('../services/tableService');

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
                send(socket, { type: 'error', message: 'Некорректный формат сообщения' });
                return;
            }

            try {
                switch (message.type) {
                    // Ответ клиента на прикладной ping
                    case 'pong': {
                        socket.isAlive = true;
                        console.log('🏓 Клиент ответил pong');
                        break;
                    }

                    case 'table:get': {
                        const data = getTableData();
                        send(socket, { type: 'table:data', data });
                        break;
                    }

                    case 'cell:update': {
                        const result = updateCell(message.row, message.col, message.value);

                        broadcast({
                            type: 'cell:updated',
                            row: message.row,
                            col: message.col,
                            value: message.value
                        });

                        send(socket, {
                            type: 'cell:saved',
                            row: message.row,
                            col: message.col,
                            ...result
                        });
                        break;
                    }

                    case 'table:clear': {
                        const data = clearTable();
                        broadcast({ type: 'table:cleared', data });
                        send(socket, { type: 'table:clear:result', success: true });
                        break;
                    }

                    default:
                        send(socket, { type: 'error', message: 'Неизвестный тип сообщения' });
                }
            } catch (error) {
                console.error('Ошибка WebSocket таблицы:', error);
                send(socket, {
                    type: 'error',
                    message: error.code ? error.message : 'Ошибка сервера'
                });
            }
        });

        socket.on('close', () => {
            console.log('🔌 WebSocket клиент отключён');
        });
    });

    // Каждые 5 секунд отправляем клиентам прикладной ping.
    // Клиент должен ответить сообщением { type: 'pong' }.
    const heartbeatInterval = setInterval(() => {
        wss.clients.forEach(socket => {
            if (socket.isAlive === false) {
                console.log('❌ WebSocket клиент не отвечает');
                socket.terminate();
                return;
            }

            socket.isAlive = false;

            const timestamp = Date.now();
            console.log('🏓 Отправляем ping клиенту');

            send(socket, {
                type: 'ping',
                timestamp
            });
        });
    }, 5000);

    wss.on('close', () => {
        clearInterval(heartbeatInterval);
    });
};

module.exports = { setupTableSocket, broadcast };
