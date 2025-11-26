import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatCurrency } from '../utils/format';

export default function Report() {
    const [expenses, setExpenses] = useState([]);
    const [incomes, setIncomes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [expensesRes, incomesRes] = await Promise.all([
                axios.get('/api/expenses'),
                axios.get('/api/incomes')
            ]);
            setExpenses(expensesRes.data);
            setIncomes(incomesRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const filterByDate = (items) => {
        return items.filter(item => {
            const itemDate = new Date(item.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return itemDate >= start && itemDate <= end;
        });
    };

    // ...

    const calculateTotal = (items, currency) => {
        return items
            .filter(item => (item.currency || 'UAH') === currency)
            .reduce((sum, item) => sum + parseFloat(item.amount), 0);
    };

    const calculateAccountBalance = (account, currency) => {
        const accountIncomes = filteredIncomes
            .filter(item => (item.account || 'Cash') === account && (item.currency || 'UAH') === currency)
            .reduce((sum, item) => sum + parseFloat(item.amount), 0);

        const accountExpenses = filteredExpenses
            .filter(item => (item.account || 'Cash') === account && (item.currency || 'UAH') === currency)
            .reduce((sum, item) => sum + parseFloat(item.amount), 0);

        return (accountIncomes - accountExpenses);
    };

    const filteredExpenses = filterByDate(expenses);
    const filteredIncomes = filterByDate(incomes);

    const totalExpensesUAH = calculateTotal(filteredExpenses, 'UAH');
    const totalExpensesUSD = calculateTotal(filteredExpenses, 'USD');
    const totalIncomesUAH = calculateTotal(filteredIncomes, 'UAH');
    const totalIncomesUSD = calculateTotal(filteredIncomes, 'USD');

    const netIncomeUAH = totalIncomesUAH - totalExpensesUAH;
    const netIncomeUSD = totalIncomesUSD - totalExpensesUSD;

    if (loading) return <div className="p-4">Завантаження...</div>;

    return (
        <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Фінансовий звіт</h2>
                <div className="flex space-x-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">З</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">По</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h3 className="text-lg font-medium text-green-900">Доходи</h3>
                        <p className="text-2xl font-bold text-green-700">{formatCurrency(totalIncomesUAH)} UAH</p>
                        <p className="text-xl font-semibold text-green-600">{formatCurrency(totalIncomesUSD)} USD</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <h3 className="text-lg font-medium text-red-900">Витрати</h3>
                        <p className="text-2xl font-bold text-red-700">{formatCurrency(totalExpensesUAH)} UAH</p>
                        <p className="text-xl font-semibold text-red-600">{formatCurrency(totalExpensesUSD)} USD</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h3 className="text-lg font-medium text-blue-900">Прибуток</h3>
                        <p className={`text-2xl font-bold ${netIncomeUAH >= 0 ? 'text-blue-700' : 'text-red-700'}`}>{formatCurrency(netIncomeUAH)} UAH</p>
                        <p className={`text-xl font-semibold ${netIncomeUSD >= 0 ? 'text-blue-600' : 'text-red-600'}`}>{formatCurrency(netIncomeUSD)} USD</p>
                    </div>
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Баланс по рахунках</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {['Cash', 'FOP', 'Wallet'].map(account => (
                            <div key={account} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h4 className="text-md font-medium text-gray-700">
                                    {account === 'Cash' ? 'Каса' : account === 'FOP' ? 'ФОП' : 'Гаманець'}
                                </h4>
                                <p className="text-lg font-bold text-gray-900">{formatCurrency(calculateAccountBalance(account, 'UAH'))} UAH</p>
                                <p className="text-md text-gray-600">{formatCurrency(calculateAccountBalance(account, 'USD'))} USD</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Деталі доходів</h3>
                    </div>
                    <div className="border-t border-gray-200 max-h-96 overflow-y-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Опис</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Клієнт</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Сума</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredIncomes.map((income) => (
                                    <tr key={income.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{income.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{income.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {income.Case && income.Case.Client ? income.Case.Client.name : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatCurrency(income.amount)} {income.currency}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Деталі витрат</h3>
                    </div>
                    <div className="border-t border-gray-200 max-h-96 overflow-y-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Опис</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Клієнт</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Сума</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredExpenses.map((expense) => (
                                    <tr key={expense.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expense.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{expense.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {expense.Case && expense.Case.Client ? expense.Case.Client.name : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatCurrency(expense.amount)} {expense.currency || 'UAH'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
