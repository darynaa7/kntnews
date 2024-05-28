const express = require('express');
const {Sequelize} = require('sequelize');
const authRouter = require('../domain/authentification/authRouter/authRouter')


const sequelize = new Sequelize('postgres://postgres:antonyuk93@localhost:5432/kntdata', {
    dialect: 'postgres',
    dialectOptions: {
        ssl: false,
    },
    logging: false
});

sequelize.authenticate().then(() => {
}).catch((err) => {
    console.error('Unable to connect to the database:', err);
});

module.exports = sequelize;
