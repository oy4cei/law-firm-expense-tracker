import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/format';

export default function IncomeList() {
    const [incomes, setIncomes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterClient, setFilterClient] = useState('');
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');

    useEffect(() => {
        fetchIncomes();
    }, []);

    const fetchIncomes = async () => {
        try {
            const response = await axios.get('/api/incomes');
            setIncomes(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching incomes:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Ви впевнені, що хочете видалити цей дохід?')) {
            try {
                await axios.delete(`/api/incomes/${id}`);
                fetchIncomes();
            } catch (error) {
                console.error('Error deleting income:', error);
                if (error.response) {
                    alert(`Помилка сервера: ${error.response.data.error || 'Невідома помилка'}`);
                } else {
                    alert('Не вдалося видалити дохід');
                }
            }
        }
    };

    const filteredIncomes = incomes.filter(income => {
        const matchesClient = filterClient === '' ||
            (income.Case && income.Case.Client && income.Case.Client.name.toLowerCase().includes(filterClient.toLowerCase()));
        const matchesStartDate = filterStartDate === '' || new Date(income.date) >= new Date(filterStartDate);
        const matchesEndDate = filterEndDate === '' || new Date(income.date) <= new Date(filterEndDate);
        return matchesClient && matchesStartDate && matchesEndDate;
    });

    if (loading) return <div className="p-4">Завантаження...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Доходи</h2>
                <Link to="/incomes/new" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                    Додати дохід
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Клієнт</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Сума</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Джерело</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Дії</th>
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
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{income.source}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link
                                        to={`/incomes/${income.id}/edit`}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                        Редагувати
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(income.id)}
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
