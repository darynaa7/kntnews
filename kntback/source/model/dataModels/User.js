const { DataTypes } = require('sequelize');
const db = require('../../data/DBase');

const User = db.define('User', {
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    token: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    tokenExpiration: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },
});


module.exports = User;