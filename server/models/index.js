const Client = require('./Client');
const Case = require('./Case');
const Expense = require('./Expense');
const Income = require('./Income');
const User = require('./User');

// Associations
Client.hasMany(Case, { foreignKey: 'clientId', onDelete: 'CASCADE' });
Case.belongsTo(Client, { foreignKey: 'clientId' });

Case.hasMany(Expense, { foreignKey: 'caseId', onDelete: 'CASCADE' });
Expense.belongsTo(Case, { foreignKey: 'caseId' });

Case.hasMany(Income, { foreignKey: 'caseId', onDelete: 'CASCADE' });
Income.belongsTo(Case, { foreignKey: 'caseId' });

module.exports = {
    Client,
    Case,
    Expense,
    Income,
    User
};
