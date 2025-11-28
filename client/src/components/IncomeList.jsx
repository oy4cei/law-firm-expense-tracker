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
                            </tr >
                        ))
}
                    </tbody >
                </table >
            </div >
        </div >
    );
}
