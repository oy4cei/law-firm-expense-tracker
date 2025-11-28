import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/format';

export default function ExpenseList() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterClient, setFilterClient] = useState('');
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const response = await axios.get('/api/expenses');
            setExpenses(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching expenses:', error);
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.put(`/api/expenses/${id}`, { status: newStatus });
            setExpenses(prev => prev.map(exp =>
                exp.id === id ? { ...exp, status: newStatus } : exp
            ));
        } catch (error) {
            console.error('Error updating status:', error);
            if (error.response) {
                alert(`Помилка сервера: ${error.response.data.error || 'Невідома помилка'}`);
            } else {
                alert('Не вдалося оновити статус');
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Ви впевнені, що хочете видалити цю витрату?')) {
            try {
                await axios.delete(`/api/expenses/${id}`);
                fetchExpenses();
            } catch (error) {
                console.error('Error deleting expense:', error);
                if (error.response) {
                    alert(`Помилка сервера: ${error.response.data.error || 'Невідома помилка'}`);
                } else {
                    alert('Не вдалося видалити витрату');
                }
            }
        }
    };

    if (loading) return <div className="p-4">Завантаження...</div>;

    const statusMap = {
        'Pending': 'Очікує',
        'Approved': 'Затверджено',
        'Paid': 'Оплачено'
    };

    const filteredExpenses = expenses.filter(expense => {
        const matchesClient = filterClient === '' ||
            (expense.Case && expense.Case.Client && expense.Case.Client.name.toLowerCase().includes(filterClient.toLowerCase()));
        const matchesStartDate = filterStartDate === '' || new Date(expense.date) >= new Date(filterStartDate);
        const matchesEndDate = filterEndDate === '' || new Date(expense.date) <= new Date(filterEndDate);
        return matchesClient && matchesStartDate && matchesEndDate;
    });

    if (loading) return <div className="p-4">Завантаження...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Витрати</h2>
                <Link to="/expenses/new" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Додати витрату
                </Link>
            </div>

            <div className="bg-white p-4 rounded-lg shadow space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Клієнт</label>
                    <input
                        type="text"
                        value={filterClient}
                        onChange={(e) => setFilterClient(e.target.value)}
                        placeholder="Пошук по клієнту"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">З дати</label>
                    <input
                        type="date"
                        value={filterStartDate}
                        onChange={(e) => setFilterStartDate(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">По дату</label>
                    <input
                        type="date"
                        value={filterEndDate}
                        onChange={(e) => setFilterEndDate(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Опис</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Категорія</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Справа</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Клієнт</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Сума</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Дії</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredExpenses.map((expense) => (
                            <tr key={expense.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expense.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{expense.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expense.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {expense.Case ? expense.Case.title : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {expense.Case && expense.Case.Client ? expense.Case.Client.name : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatCurrency(expense.amount)} {expense.currency || 'UAH'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select
                                        value={expense.status}
                                        onChange={(e) => handleStatusChange(expense.id, e.target.value)}
                                        className={`text-xs font-semibold rounded-full px-2 py-1 border-0 cursor-pointer
                                            ${expense.status === 'Paid' ? 'bg-green-100 text-green-800' :
                                                expense.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-yellow-100 text-yellow-800'}`}
                                    >
                                        <option value="Pending">Очікує</option>
                                        <option value="Approved">Затверджено</option>
                                        <option value="Paid">Оплачено</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link
                                        to={`/expenses/${expense.id}/edit`}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                        Редагувати
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(expense.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Видалити
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
