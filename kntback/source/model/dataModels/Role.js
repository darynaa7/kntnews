const { DataTypes } = require('sequelize');
const db = require('../../data/DBase');

const Role = db.define('Role', {
    value: {
        type: DataTypes.STRING,
        unique: true,
        defaultValue: 'USER',
    },
});

module.exports = Role;