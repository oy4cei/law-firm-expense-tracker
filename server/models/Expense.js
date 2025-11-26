const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Expense = sequelize.define('Expense', {
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
    category: {
        type: DataTypes.STRING,
        allowNull: false // e.g., Travel, Court Fees, Office Supplies
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Pending' // Pending, Approved, Paid
    },
    account: {
        type: DataTypes.STRING,
        defaultValue: 'Cash' // Cash, FOP, Wallet
    }
});

module.exports = Expense;
