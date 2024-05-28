const {DataTypes} = require('sequelize');
const db = require('../../data/DBase');
const User = require('./User');

const MarkedNews = db.define('MarkedNews', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
});

MarkedNews.belongsTo(User, {foreignKey: 'userId'});

// });
//
// MarkedNews.belongsTo(User, {foreignKey: 'username'});
module.exports = MarkedNews;