const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Case = sequelize.define('Case', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Open' // Open, Closed, Archived
    }
});

module.exports = Case;
