import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ExpenseList from './components/ExpenseList';
import AddExpense from './components/AddExpense';
import EditExpense from './components/EditExpense';
import Dashboard from './components/Dashboard';
import ClientList from './components/ClientList';
import CaseList from './components/CaseList';
import AddIncome from './components/AddIncome';
import IncomeList from './components/IncomeList';
import EditIncome from './components/EditIncome';
import Report from './components/Report';
import LoginPage from './components/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/expenses" element={<ProtectedRoute><ExpenseList /></ProtectedRoute>} />
            <Route path="/expenses/new" element={<ProtectedRoute><AddExpense /></ProtectedRoute>} />
            <Route path="/expenses/:id/edit" element={<ProtectedRoute><EditExpense /></ProtectedRoute>} />
            <Route path="/clients" element={<ProtectedRoute><ClientList /></ProtectedRoute>} />
            <Route path="/cases" element={<ProtectedRoute><CaseList /></ProtectedRoute>} />
            <Route path="/incomes" element={<ProtectedRoute><IncomeList /></ProtectedRoute>} />
            <Route path="/incomes/new" element={<ProtectedRoute><AddIncome /></ProtectedRoute>} />
            <Route path="/incomes/:id/edit" element={<ProtectedRoute><EditIncome /></ProtectedRoute>} />
            <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
