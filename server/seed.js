const sequelize = require('./database');
const { Client, Case, Expense, Income, User } = require('./models');
const bcrypt = require('bcryptjs');

const seed = async () => {
    try {
        const args = process.argv.slice(2);
        const force = args.includes('--force');

        if (force) {
            console.log('Force flag detected. Wiping database...');
            await sequelize.sync({ force: true }); // WARNING: This clears the DB
            console.log('Database cleared and synced.');
        } else {
            console.log('No --force flag. syncing without wipe...');
            await sequelize.sync(); // Safe sync

            // Check if admin exists to avoid duplicate seeding or errors
            const admin = await User.findOne({ where: { username: 'admin' } });
            if (admin) {
                console.log('Admin user already exists. Seeding skipped to prevent data loss.');
                console.log('To wipe and re-seed, run: node server/seed.js --force');
                process.exit(0);
            }
        }

        // Create admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({
            username: 'admin',
            password: hashedPassword,
            role: 'admin'
        });
        console.log('Admin user created (username: admin, password: admin123)');

        // --- Clients ---
        const empire = await Client.create({
            name: 'Galactic Empire',
            email: 'vader@empire.gov',
            phone: '1-800-DARK-SIDE'
        });

        const rebels = await Client.create({
            name: 'Rebel Alliance',
            email: 'leia@rebellion.org',
            phone: '1-800-HOPE'
        });

        const jabba = await Client.create({
            name: 'Jabba the Hutt',
            email: 'jabba@tatooine.net',
            phone: '1-800-BOUNTY'
        });

        const jedi = await Client.create({
            name: 'Jedi Order',
            email: 'yoda@jedi.temple',
            phone: '1-800-FORCE'
        });

        const tradeFed = await Client.create({
            name: 'Trade Federation',
            email: 'nute@tradefed.com',
            phone: '1-800-DROID'
        });

        const firstOrder = await Client.create({
            name: 'First Order',
            email: 'hux@firstorder.mil',
            phone: '1-800-STARKILLER'
        });

        console.log('Clients created.');

        // --- Cases ---
        const deathStar = await Case.create({
            title: 'Project Stardust (Death Star I)',
            description: 'Construction of a moon-sized space station. Top Secret.',
            status: 'Open',
            clientId: empire.id
        });

        const deathStar2 = await Case.create({
            title: 'Death Star II Construction',
            description: 'Second iteration with improved defenses.',
            status: 'Open',
            clientId: empire.id
        });

        const hothBase = await Case.create({
            title: 'Echo Base Establishment',
            description: 'Setting up a secret base on the ice planet Hoth.',
            status: 'Closed',
            clientId: rebels.id
        });

        const soloBounty = await Case.create({
            title: 'Han Solo Recovery',
            description: 'Retrieval of Captain Solo frozen in carbonite.',
            status: 'Closed',
            clientId: jabba.id
        });

        const order66 = await Case.create({
            title: 'Order 66 Aftermath',
            description: 'Legal defense for surviving Jedi.',
            status: 'Closed',
            clientId: jedi.id
        });

        const nabooBlockade = await Case.create({
            title: 'Naboo Blockade Operation',
            description: 'Trade dispute and blockade of Naboo.',
            status: 'Closed',
            clientId: tradeFed.id
        });

        const starkiller = await Case.create({
            title: 'Starkiller Base Development',
            description: 'Planet-destroying superweapon construction.',
            status: 'Open',
            clientId: firstOrder.id
        });

        const yavinBattle = await Case.create({
            title: 'Battle of Yavin Legal Claims',
            description: 'Insurance claims from Death Star destruction.',
            status: 'Pending',
            clientId: empire.id
        });

        console.log('Cases created.');

        // --- Expenses (50+ records) ---
        await Expense.bulkCreate([
            // Death Star I
            { description: 'Kyber Crystals Shipment', amount: 5000000.00, currency: 'USD', date: '2025-01-15', category: 'Materials', status: 'Paid', account: 'FOP', caseId: deathStar.id },
            { description: 'Stormtrooper Salaries (501st Legion)', amount: 250000.00, currency: 'USD', date: '2025-02-01', category: 'Salary', status: 'Paid', account: 'Cash', caseId: deathStar.id },
            { description: 'Turbolaser Batteries (x1000)', amount: 3500000.00, currency: 'USD', date: '2025-01-20', category: 'Equipment', status: 'Approved', account: 'FOP', caseId: deathStar.id },
            { description: 'Tractor Beam Generators', amount: 1200000.00, currency: 'USD', date: '2025-02-10', category: 'Equipment', status: 'Paid', account: 'FOP', caseId: deathStar.id },
            { description: 'Grand Moff Tarkin Travel Expenses', amount: 15000.00, currency: 'USD', date: '2025-01-25', category: 'Travel', status: 'Paid', account: 'Wallet', caseId: deathStar.id },

            // Death Star II
            { description: 'Durasteel Hull Plating', amount: 8000000.00, currency: 'USD', date: '2025-03-01', category: 'Materials', status: 'Approved', account: 'FOP', caseId: deathStar2.id },
            { description: 'Shield Generator Components', amount: 2500000.00, currency: 'USD', date: '2025-03-15', category: 'Equipment', status: 'Pending', account: 'FOP', caseId: deathStar2.id },
            { description: 'Construction Droid Army', amount: 450000.00, currency: 'USD', date: '2025-02-20', category: 'Services', status: 'Paid', account: 'Cash', caseId: deathStar2.id },
            { description: 'Emperor Palpatine Security Detail', amount: 75000.00, currency: 'USD', date: '2025-03-10', category: 'Security', status: 'Paid', account: 'Wallet', caseId: deathStar2.id },

            // Hoth Base
            { description: 'Thermal Heaters for Hoth', amount: 15000.00, currency: 'UAH', date: '2025-01-20', category: 'Equipment', status: 'Paid', account: 'Wallet', caseId: hothBase.id },
            { description: 'Snowspeeder Maintenance', amount: 35000.00, currency: 'UAH', date: '2025-02-05', category: 'Maintenance', status: 'Paid', account: 'Cash', caseId: hothBase.id },
            { description: 'Ion Cannon Installation', amount: 125000.00, currency: 'USD', date: '2025-01-10', category: 'Equipment', status: 'Paid', account: 'FOP', caseId: hothBase.id },
            { description: 'Tauntaun Feed and Care', amount: 2500.00, currency: 'UAH', date: '2025-02-15', category: 'Supplies', status: 'Paid', account: 'Cash', caseId: hothBase.id },

            // Solo Bounty
            { description: 'Boba Fett Retainer Fee', amount: 50000.00, currency: 'USD', date: '2025-03-10', category: 'Services', status: 'Paid', account: 'Cash', caseId: soloBounty.id },
            { description: 'Carbonite Freezing Equipment', amount: 18000.00, currency: 'USD', date: '2025-03-05', category: 'Equipment', status: 'Paid', account: 'Wallet', caseId: soloBounty.id },
            { description: 'Transport to Tatooine', amount: 8500.00, currency: 'USD', date: '2025-03-12', category: 'Travel', status: 'Paid', account: 'Cash', caseId: soloBounty.id },

            // Jedi Order
            { description: 'Lightsaber Maintenance Kit', amount: 500.00, currency: 'UAH', date: '2024-12-01', category: 'Office', status: 'Paid', account: 'Wallet', caseId: order66.id },
            { description: 'Jedi Temple Repairs', amount: 95000.00, currency: 'USD', date: '2024-11-15', category: 'Maintenance', status: 'Paid', account: 'FOP', caseId: order66.id },
            { description: 'Holocron Data Recovery', amount: 12000.00, currency: 'USD', date: '2024-12-10', category: 'Services', status: 'Approved', account: 'Cash', caseId: order66.id },
            { description: 'Obi-Wan Kenobi Legal Defense', amount: 25000.00, currency: 'USD', date: '2024-11-20', category: 'Legal', status: 'Paid', account: 'FOP', caseId: order66.id },

            // Trade Federation
            { description: 'Battle Droid Manufacturing', amount: 750000.00, currency: 'USD', date: '2024-10-01', category: 'Equipment', status: 'Paid', account: 'FOP', caseId: nabooBlockade.id },
            { description: 'Droid Control Ship Fuel', amount: 85000.00, currency: 'USD', date: '2024-10-15', category: 'Fuel', status: 'Paid', account: 'Cash', caseId: nabooBlockade.id },
            { description: 'Nute Gunray Legal Fees', amount: 45000.00, currency: 'USD', date: '2024-11-01', category: 'Legal', status: 'Paid', account: 'FOP', caseId: nabooBlockade.id },
            { description: 'MTT Transport Vehicles', amount: 320000.00, currency: 'USD', date: '2024-10-20', category: 'Equipment', status: 'Paid', account: 'FOP', caseId: nabooBlockade.id },

            // Starkiller Base
            { description: 'Planet Core Drilling Equipment', amount: 15000000.00, currency: 'USD', date: '2025-02-01', category: 'Equipment', status: 'Approved', account: 'FOP', caseId: starkiller.id },
            { description: 'Thermal Oscillator Components', amount: 6500000.00, currency: 'USD', date: '2025-02-15', category: 'Materials', status: 'Pending', account: 'FOP', caseId: starkiller.id },
            { description: 'Stormtrooper Training Program', amount: 180000.00, currency: 'USD', date: '2025-01-25', category: 'Training', status: 'Paid', account: 'Cash', caseId: starkiller.id },
            { description: 'General Hux Office Supplies', amount: 3500.00, currency: 'USD', date: '2025-02-20', category: 'Office', status: 'Paid', account: 'Wallet', caseId: starkiller.id },
            { description: 'TIE Fighter Squadron Maintenance', amount: 425000.00, currency: 'USD', date: '2025-03-01', category: 'Maintenance', status: 'Approved', account: 'FOP', caseId: starkiller.id },

            // Yavin Battle
            { description: 'Death Star Debris Cleanup', amount: 2500000.00, currency: 'USD', date: '2025-01-05', category: 'Services', status: 'Pending', account: 'FOP', caseId: yavinBattle.id },
            { description: 'Insurance Claim Processing', amount: 75000.00, currency: 'USD', date: '2025-01-10', category: 'Legal', status: 'Approved', account: 'Cash', caseId: yavinBattle.id },
            { description: 'Survivor Compensation Fund', amount: 500000.00, currency: 'USD', date: '2025-01-15', category: 'Compensation', status: 'Pending', account: 'FOP', caseId: yavinBattle.id },

            // Additional Mixed Expenses
            { description: 'Darth Vader Life Support Upgrade', amount: 85000.00, currency: 'USD', date: '2025-02-28', category: 'Medical', status: 'Paid', account: 'FOP', caseId: deathStar.id },
            { description: 'Imperial March Sheet Music', amount: 150.00, currency: 'UAH', date: '2025-01-30', category: 'Office', status: 'Paid', account: 'Wallet', caseId: deathStar.id },
            { description: 'AT-AT Walker Repairs', amount: 145000.00, currency: 'USD', date: '2025-02-18', category: 'Maintenance', status: 'Paid', account: 'FOP', caseId: hothBase.id },
            { description: 'Wampa Containment System', amount: 8500.00, currency: 'UAH', date: '2025-02-10', category: 'Security', status: 'Paid', account: 'Cash', caseId: hothBase.id },
            { description: 'Slave I Fuel and Repairs', amount: 22000.00, currency: 'USD', date: '2025-03-08', category: 'Maintenance', status: 'Paid', account: 'Cash', caseId: soloBounty.id },
            { description: 'Rancor Pit Maintenance', amount: 5500.00, currency: 'UAH', date: '2025-03-15', category: 'Maintenance', status: 'Paid', account: 'Wallet', caseId: soloBounty.id },
            { description: 'Jedi Archives Digitization', amount: 35000.00, currency: 'USD', date: '2024-12-05', category: 'Services', status: 'Paid', account: 'FOP', caseId: order66.id },
            { description: 'Meditation Chamber Upgrades', amount: 12500.00, currency: 'UAH', date: '2024-11-25', category: 'Office', status: 'Paid', account: 'Wallet', caseId: order66.id },
            { description: 'AAT Tank Ammunition', amount: 95000.00, currency: 'USD', date: '2024-10-25', category: 'Supplies', status: 'Paid', account: 'FOP', caseId: nabooBlockade.id },
            { description: 'Viceroy Shuttle Maintenance', amount: 18000.00, currency: 'USD', date: '2024-11-05', category: 'Maintenance', status: 'Paid', account: 'Cash', caseId: nabooBlockade.id },
            { description: 'Kylo Ren Lightsaber Repairs', amount: 8500.00, currency: 'USD', date: '2025-02-25', category: 'Equipment', status: 'Paid', account: 'Wallet', caseId: starkiller.id },
            { description: 'Captain Phasma Armor Polish', amount: 250.00, currency: 'UAH', date: '2025-03-05', category: 'Supplies', status: 'Paid', account: 'Wallet', caseId: starkiller.id },
            { description: 'Hosnian System Surveillance', amount: 125000.00, currency: 'USD', date: '2025-02-10', category: 'Services', status: 'Approved', account: 'FOP', caseId: starkiller.id },
            { description: 'X-Wing Wreckage Analysis', amount: 45000.00, currency: 'USD', date: '2025-01-20', category: 'Services', status: 'Approved', account: 'Cash', caseId: yavinBattle.id },
            { description: 'Yavin 4 Evacuation Costs', amount: 85000.00, currency: 'USD', date: '2025-01-12', category: 'Services', status: 'Pending', account: 'FOP', caseId: yavinBattle.id },
            { description: 'TIE Fighter Pilot Training', amount: 95000.00, currency: 'USD', date: '2025-02-05', category: 'Training', status: 'Paid', account: 'FOP', caseId: deathStar2.id },
            { description: 'Superlaser Calibration', amount: 750000.00, currency: 'USD', date: '2025-03-20', category: 'Services', status: 'Pending', account: 'FOP', caseId: deathStar2.id },
            { description: 'Endor Shield Generator Transport', amount: 125000.00, currency: 'USD', date: '2025-03-12', category: 'Travel', status: 'Approved', account: 'Cash', caseId: deathStar2.id }
        ]);

        console.log('Expenses created (50+ records).');

        // --- Incomes (20+ records) ---
        await Income.bulkCreate([
            { description: 'Tax Collection: Alderaan System', amount: 10000000.00, currency: 'USD', date: '2025-01-01', source: 'Taxes', account: 'FOP', caseId: deathStar.id },
            { description: 'Tax Collection: Coruscant', amount: 25000000.00, currency: 'USD', date: '2025-01-15', source: 'Taxes', account: 'FOP', caseId: deathStar.id },
            { description: 'Mining Rights: Kessel', amount: 3500000.00, currency: 'USD', date: '2025-02-01', source: 'Business', account: 'FOP', caseId: deathStar.id },
            { description: 'Weapon Sales to Outer Rim', amount: 1200000.00, currency: 'USD', date: '2025-02-15', source: 'Sales', account: 'Cash', caseId: deathStar2.id },
            { description: 'Imperial Propaganda Revenue', amount: 450000.00, currency: 'USD', date: '2025-03-01', source: 'Media', account: 'Wallet', caseId: deathStar2.id },

            { description: 'Donation from House of Organa', amount: 200000.00, currency: 'USD', date: '2025-01-10', source: 'Donation', account: 'Cash', caseId: hothBase.id },
            { description: 'Mon Mothma Fundraiser', amount: 350000.00, currency: 'USD', date: '2025-01-25', source: 'Donation', account: 'FOP', caseId: hothBase.id },
            { description: 'Bothan Spy Network Payment', amount: 125000.00, currency: 'USD', date: '2025-02-10', source: 'Services', account: 'Cash', caseId: hothBase.id },

            { description: 'Smuggling Run: Kessel Run', amount: 75000.00, currency: 'USD', date: '2025-02-15', source: 'Business', account: 'Wallet', caseId: soloBounty.id },
            { description: 'Spice Trading Profits', amount: 185000.00, currency: 'USD', date: '2025-03-01', source: 'Business', account: 'Cash', caseId: soloBounty.id },
            { description: 'Bounty Hunter Referral Fee', amount: 25000.00, currency: 'USD', date: '2025-03-10', source: 'Services', account: 'Wallet', caseId: soloBounty.id },

            { description: 'Jedi Temple Donations', amount: 150000.00, currency: 'USD', date: '2024-11-01', source: 'Donation', account: 'FOP', caseId: order66.id },
            { description: 'Force Meditation Classes', amount: 45000.00, currency: 'UAH', date: '2024-12-01', source: 'Services', account: 'Cash', caseId: order66.id },
            { description: 'Holocron Sales', amount: 85000.00, currency: 'USD', date: '2024-12-15', source: 'Sales', account: 'Wallet', caseId: order66.id },

            { description: 'Trade Route Licensing', amount: 2500000.00, currency: 'USD', date: '2024-10-01', source: 'Licensing', account: 'FOP', caseId: nabooBlockade.id },
            { description: 'Droid Sales Revenue', amount: 850000.00, currency: 'USD', date: '2024-10-20', source: 'Sales', account: 'FOP', caseId: nabooBlockade.id },
            { description: 'Naboo Plasma Export', amount: 1200000.00, currency: 'USD', date: '2024-11-05', source: 'Business', account: 'Cash', caseId: nabooBlockade.id },

            { description: 'First Order Recruitment Fees', amount: 450000.00, currency: 'USD', date: '2025-02-01', source: 'Services', account: 'FOP', caseId: starkiller.id },
            { description: 'Weapon Manufacturing Contracts', amount: 3500000.00, currency: 'USD', date: '2025-02-20', source: 'Sales', account: 'FOP', caseId: starkiller.id },
            { description: 'Conquered Planet Resources', amount: 5000000.00, currency: 'USD', date: '2025-03-10', source: 'Business', account: 'FOP', caseId: starkiller.id },

            { description: 'Insurance Payout: Death Star I', amount: 15000000.00, currency: 'USD', date: '2025-01-20', source: 'Insurance', account: 'FOP', caseId: yavinBattle.id },
            { description: 'Salvage Rights: Yavin Debris', amount: 750000.00, currency: 'USD', date: '2025-01-25', source: 'Business', account: 'Cash', caseId: yavinBattle.id }
        ]);

        console.log('Incomes created (20+ records).');
        console.log('Seeding complete! May the Force be with you.');
        console.log('Total: 6 Clients, 8 Cases, 50+ Expenses, 20+ Incomes');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
};

seed();
