-- Таблица для данных таблицы (6 строк × 4 столбца)
CREATE TABLE IF NOT EXISTS table_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    row_number INTEGER,
    col_number INTEGER,
    cell_value TEXT
);

-- Заполняем пустыми данными (6×4)
INSERT OR IGNORE INTO table_data (row_number, col_number, cell_value) VALUES
(0, 0, ''), (0, 1, ''), (0, 2, ''), (0, 3, ''),
(1, 0, ''), (1, 1, ''), (1, 2, ''), (1, 3, ''),
(2, 0, ''), (2, 1, ''), (2, 2, ''), (2, 3, ''),
(3, 0, ''), (3, 1, ''), (3, 2, ''), (3, 3, ''),
(4, 0, ''), (4, 1, ''), (4, 2, ''), (4, 3, ''),
(5, 0, ''), (5, 1, ''), (5, 2, ''), (5, 3, '');

-- Таблица для страниц (новости, достижения, поддержка)
CREATE TABLE IF NOT EXISTS page_content (
    page_name TEXT PRIMARY KEY,
    message TEXT
);

-- Начальные данные
INSERT OR IGNORE INTO page_content (page_name, message) VALUES
('news', '📰 Новости проекта!'),
('achievements', '🏆 Наши достижения: первое место на хакатоне!'),
('support', '💬 Напишите нам: support@mysite.ru');