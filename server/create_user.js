const sequelize = require('./database');
const { User } = require('./models');
const bcrypt = require('bcryptjs');

async function createDefaultUser() {
    try {
        await sequelize.sync();
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({
            username: 'admin',
            password: hashedPassword,
            role: 'admin'
        });
        console.log('User "admin" created with password "admin123"');
    } catch (error) {
        console.error('Error creating user:', error.message);
    } finally {
        await sequelize.close();
    }
}

createDefaultUser();
