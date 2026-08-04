const data = require('../data/database');

const getSupport = (req, res) => {
    res.json(data.support);
};

module.exports = { getSupport };