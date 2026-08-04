const data = require('../data/database');

const getAchievements = (req, res) => {
    res.json(data.achievements);
};

module.exports = { getAchievements };