const { WebSocket } = require('ws');
const { getTableData, updateCell, clearTable } = require('../services/tableService');

const send = (socket, message) => {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
    }
};

const broadcast = (wss, message) => {
    wss.clients.forEach(client => send(client, message));
};

const setupTableSocket = (wss) => {
    wss.on('connection', socket => {
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
                    case 'table:get': {
                        const data = getTableData();
                        send(socket, { type: 'table:data', data });
                        break;
                    }
                    case 'cell:update': {
                        const result = updateCell(message.row, message.col, message.value);
                        broadcast(wss, {
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
                        broadcast(wss, { type: 'table:cleared', data });
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
    });
};

module.exports = setupTableSocket;
