const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./database');
const { Client, Case, Expense, Income, User } = require('./models');

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

// CORS configuration
if (isProduction) {
    app.use(cors({
        origin: process.env.FRONTEND_URL || '*',
        credentials: true
    }));
} else {
    app.use(cors());
}

app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'public')));

// Basic route
app.get('/', (req, res) => {
    res.send('Law Firm Expense Tracker API');
});

// --- API Routes ---

// Auth
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';

app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword });
        res.status(201).json({ message: 'User created' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });
        if (!user) return res.status(400).json({ error: 'User not found' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Clients
app.get('/api/clients', authenticateToken, async (req, res) => {
    try {
        const clients = await Client.findAll();
        res.json(clients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/clients', authenticateToken, async (req, res) => {
    try {
        const client = await Client.create(req.body);
        res.status(201).json(client);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put('/api/clients/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Client.update(req.body, { where: { id } });
        if (updated) {
            const updatedClient = await Client.findByPk(id);
            res.status(200).json(updatedClient);
        } else {
            res.status(404).json({ error: 'Client not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/clients/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Client.destroy({ where: { id } });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Client not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/clients/:id/impact', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const cases = await Case.count({ where: { clientId: id } });
        // To get total expenses/incomes, we'd need to find all cases first.
        // This is a bit complex with just count, let's do a find.
        const clientCases = await Case.findAll({ where: { clientId: id }, attributes: ['id'] });
        const caseIds = clientCases.map(c => c.id);

        const expenses = await Expense.count({ where: { caseId: caseIds } });
        const incomes = await Income.count({ where: { caseId: caseIds } });

        res.json({ cases, expenses, incomes });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Cases
app.get('/api/cases', authenticateToken, async (req, res) => {
    try {
        const cases = await Case.findAll({ include: Client });
        res.json(cases);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/cases', authenticateToken, async (req, res) => {
    try {
        const kase = await Case.create(req.body);
        res.status(201).json(kase);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put('/api/cases/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Case.update(req.body, { where: { id } });
        if (updated) {
            const updatedCase = await Case.findOne({ where: { id }, include: Client });
            res.status(200).json(updatedCase);
        } else {
            res.status(404).json({ error: 'Case not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/cases/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Case.destroy({ where: { id } });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Case not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/cases/:id/impact', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const expenses = await Expense.count({ where: { caseId: id } });
        const incomes = await Income.count({ where: { caseId: id } });
        res.json({ expenses, incomes });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Expenses
app.get('/api/expenses', authenticateToken, async (req, res) => {
    try {
        const expenses = await Expense.findAll({
            include: {
                model: Case,
                include: [Client]
            }
        });
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/expenses', authenticateToken, async (req, res) => {
    try {
        const expense = await Expense.create(req.body);
        res.status(201).json(expense);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put('/api/expenses/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Expense.update(req.body, { where: { id } });
        if (updated) {
            const updatedExpense = await Expense.findOne({ where: { id }, include: Case });
            res.status(200).json(updatedExpense);
        } else {
            res.status(404).json({ error: 'Expense not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/expenses/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Expense.destroy({ where: { id } });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Expense not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Incomes
app.get('/api/incomes', authenticateToken, async (req, res) => {
    try {
        const incomes = await Income.findAll({
            include: {
                model: Case,
                include: [Client]
            }
        });
        res.json(incomes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/incomes', authenticateToken, async (req, res) => {
    try {
        const income = await Income.create(req.body);
        res.status(201).json(income);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put('/api/incomes/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Income.update(req.body, { where: { id } });
        if (updated) {
            const updatedIncome = await Income.findOne({ where: { id }, include: Case });
            res.status(200).json(updatedIncome);
        } else {
            res.status(404).json({ error: 'Income not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/incomes/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Income.destroy({ where: { id } });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Income not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Export
const ExcelJS = require('exceljs');

app.get('/api/export', authenticateToken, async (req, res) => {
    try {
        const workbook = new ExcelJS.Workbook();

        // Expenses Sheet
        const expensesSheet = workbook.addWorksheet('Витрати');
        expensesSheet.columns = [
            { header: 'Дата', key: 'date', width: 15 },
            { header: 'Опис', key: 'description', width: 30 },
            { header: 'Сума', key: 'amount', width: 15 },
            { header: 'Валюта', key: 'currency', width: 10 },
            { header: 'Категорія', key: 'category', width: 20 },
            { header: 'Справа', key: 'case', width: 20 },
            { header: 'Клієнт', key: 'client', width: 20 },
            { header: 'Статус', key: 'status', width: 15 }
        ];

        const expenses = await Expense.findAll({
            include: {
                model: Case,
                include: [Client]
            }
        });
        expenses.forEach(exp => {
            expensesSheet.addRow({
                date: exp.date,
                description: exp.description,
                amount: exp.amount,
                currency: exp.currency,
                category: exp.category,
                case: exp.Case ? exp.Case.title : '',
                client: exp.Case && exp.Case.Client ? exp.Case.Client.name : '',
                status: exp.status
            });
        });

        // Incomes Sheet
        const incomesSheet = workbook.addWorksheet('Доходи');
        incomesSheet.columns = [
            { header: 'Дата', key: 'date', width: 15 },
            { header: 'Опис', key: 'description', width: 30 },
            { header: 'Сума', key: 'amount', width: 15 },
            { header: 'Валюта', key: 'currency', width: 10 },
            { header: 'Джерело', key: 'source', width: 20 },
            { header: 'Справа', key: 'case', width: 20 },
            { header: 'Клієнт', key: 'client', width: 20 }
        ];

        const incomes = await Income.findAll({
            include: {
                model: Case,
                include: [Client]
            }
        });
        incomes.forEach(inc => {
            incomesSheet.addRow({
                date: inc.date,
                description: inc.description,
                amount: inc.amount,
                currency: inc.currency,
                source: inc.source,
                case: inc.Case ? inc.Case.title : '',
                client: inc.Case && inc.Case.Client ? inc.Case.Client.name : ''
            });
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=report.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Serve React app for all non-API routes (must be after API routes)
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Sync database and start server
sequelize.sync().then(() => {
    console.log('Database connected');
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});
