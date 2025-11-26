import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/format';

export default function IncomeList() {
    const [incomes, setIncomes] = useState([]);
    const [loading, setLoading] = useState(true);

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
                alert('Не вдалося видалити дохід');
            }
        }
    };

    if (loading) return <div className="p-4">Завантаження...</div>;

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Звіт про доходи</h3>
                <Link to="/incomes/new" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Додати дохід
                </Link>
            </div>
            <div className="border-t border-gray-200 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Опис</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Джерело</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Справа</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Клієнт</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Сума</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Дії</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {incomes.map((income) => (
                            <tr key={income.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{income.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{income.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{income.source}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {income.Case ? income.Case.title : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {income.Case && income.Case.Client ? income.Case.Client.name : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatCurrency(income.amount)} {income.currency || 'UAH'}
                                </td>
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
