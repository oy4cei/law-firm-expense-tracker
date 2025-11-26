const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Income = sequelize.define('Income', {
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    currency: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'UAH'
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    source: {
        type: DataTypes.STRING,
        allowNull: false // e.g., Client Payment, Consultation Fee
    },
    account: {
        type: DataTypes.STRING,
        defaultValue: 'Cash' // Cash, FOP, Wallet
    }
});

module.exports = Income;
