const {DataTypes} = require('sequelize');
const db = require('../../data/DBase');
const User = require('./User');

const Events = db.define('Events', {

    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    allDay: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
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

Events.belongsTo(User, {foreignKey: 'userId'});
module.exports = Events;