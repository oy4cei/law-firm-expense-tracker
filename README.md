# Law Firm Expense Tracker

Modern expense tracking application for law firms built with React, Express, and SQLite.

![Modern UI](https://img.shields.io/badge/UI-Modern-blue)
![React](https://img.shields.io/badge/React-19.2-61dafb)
![Express](https://img.shields.io/badge/Express-5.1-green)
![SQLite](https://img.shields.io/badge/SQLite-3-blue)

## Features

- 💼 **Client Management** - Track clients and their information
- 📁 **Case Management** - Organize cases and link to clients
- 💸 **Expense Tracking** - Record and categorize expenses
- 💰 **Income Tracking** - Monitor income sources
- 📊 **Financial Reports** - Generate comprehensive reports
- 📥 **Excel Export** - Export data to Excel format
- 🔐 **Authentication** - Secure JWT-based authentication
- 🎨 **Modern UI** - Beautiful glassmorphism design with smooth animations

## Tech Stack

### Frontend
- **React 19.2** - UI framework
- **Vite 7.2** - Build tool
- **TailwindCSS 4.1** - Styling
- **React Router 7.9** - Routing
- **Axios** - HTTP client

### Backend
- **Express 5.1** - Web framework
- **Sequelize 6.37** - ORM
- **SQLite 3** - Database
- **JWT** - Authentication
- **ExcelJS** - Excel export

## Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/law-firm-expense-tracker.git
   cd law-firm-expense-tracker
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Seed the database**
   ```bash
   cd server
   node seed.js
   cd ..
   ```

4. **Start development servers**
   
   Terminal 1 (Backend):
   ```bash
   npm run dev:server
   ```
   
   Terminal 2 (Frontend):
   ```bash
   npm run dev:client
   ```

5. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

6. **Login**
   - Username: `admin`
   - Password: `admin123`

## Deployment

### Railway (Recommended)

See [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md) for detailed instructions.

**Quick Deploy:**
1. Push to GitHub
2. Connect to Railway
3. Set environment variables:
   - `NODE_ENV=production`
   - `JWT_SECRET=<your-secret>`
4. Deploy!

### Docker

```bash
docker-compose up -d
```

Access at http://localhost

### VPS

See [DEPLOY.md](DEPLOY.md) for VPS deployment instructions.

## Project Structure

```
law-firm-expense-tracker/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # Context providers
│   │   └── utils/         # Utility functions
│   ├── package.json
│   └── vite.config.js
├── server/                # Express backend
│   ├── models/           # Sequelize models
│   ├── index.js          # Main server file
│   ├── database.js       # Database configuration
│   ├── seed.js           # Database seeding
│   └── package.json
├── package.json          # Root package (Railway)
├── railway.json          # Railway configuration
└── .env.example          # Environment variables template
```

## Environment Variables

Create a `.env` file in the server directory:

```env
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key
PORT=3001
```

## Scripts

```bash
# Install all dependencies
npm run install:all

# Development
npm run dev:client          # Start frontend dev server
npm run dev:server          # Start backend dev server

# Production
npm run build:client        # Build frontend
npm start                   # Start production server

# Railway
npm run railway:build       # Build for Railway
npm run railway:start       # Start on Railway
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Clients
- `GET /api/clients` - List all clients
- `POST /api/clients` - Create client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Cases
- `GET /api/cases` - List all cases
- `POST /api/cases` - Create case
- `PUT /api/cases/:id` - Update case
- `DELETE /api/cases/:id` - Delete case

### Expenses
- `GET /api/expenses` - List all expenses
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Incomes
- `GET /api/incomes` - List all incomes
- `POST /api/incomes` - Create income
- `PUT /api/incomes/:id` - Update income
- `DELETE /api/incomes/:id` - Delete income

### Export
- `GET /api/export` - Export data to Excel

## Screenshots

### Login Page
Modern glassmorphism design with animated background

### Dashboard
Clean, card-based interface with gradient accents

### Expense Management
Comprehensive expense tracking with filtering

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC

## Support

For issues and questions, please open an issue on GitHub.

## Acknowledgments

- Modern UI design inspired by contemporary web design trends
- Built with love for legal professionals
