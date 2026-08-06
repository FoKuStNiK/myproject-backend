CREATE TABLE IF NOT EXISTS table_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    row_number INTEGER,
    col_number INTEGER,
    cell_value TEXT,
    UNIQUE (row_number, col_number)
);

CREATE TABLE IF NOT EXISTS page_content (
    page_name TEXT PRIMARY KEY,
    message TEXT
);

INSERT OR IGNORE INTO page_content (page_name, message) VALUES
('news', '📰 Новости проекта!'),
('achievements', '🏆 Наши достижения: первое место на хакатоне!'),
('support', '💬 Напишите нам: support@mysite.ru');