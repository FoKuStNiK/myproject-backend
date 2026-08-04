const data = require('../data/database');

const getNews = (req, res) => {
    res.json(data.news);
};

module.exports = { getNews };