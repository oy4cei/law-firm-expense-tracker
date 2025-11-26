import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditExpense() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        currency: 'UAH',
        date: '',
        category: '',
        caseId: '',
        status: 'Pending',
        account: 'Cash'
    });
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [expenseRes, casesRes] = await Promise.all([
                    axios.get(`/api/expenses`), // We'll filter locally for now as we don't have GET /api/expenses/:id yet, or we can add it.
                    // Actually, let's check if we can get by ID. The server might not have it.
                    // Let's assume we need to find it from the list or add a GET endpoint.
                    // Given the current server setup, let's fetch all and find.
                    axios.get('/api/cases')
                ]);

                const expense = expenseRes.data.find(e => e.id === parseInt(id));
                if (expense) {
                    setFormData({
                        description: expense.description,
                        amount: expense.amount,
                        currency: expense.currency,
                        date: expense.date,
                        category: expense.category,
                        caseId: expense.CaseId || '',
                        status: expense.status,
                        account: expense.account || 'Cash'
                    });
                } else {
                    alert('Витрату не знайдено');
                    navigate('/expenses');
                }
                setCases(casesRes.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/expenses/${id}`, formData);
            navigate('/expenses');
        } catch (error) {
            console.error('Error updating expense:', error);
            alert('Не вдалося оновити витрату');
        }
    };

    if (loading) return <div className="p-4">Завантаження...</div>;

    return (
        <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Редагувати витрату</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Опис</label>
                    <input
                        type="text"
                        name="description"
                        required
                        value={formData.description}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Сума</label>
                        <input
                            type="number"
                            name="amount"
                            step="0.01"
                            required
                            value={formData.amount}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Валюта</label>
                        <select
                            name="currency"
                            value={formData.currency}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        >
                            <option value="UAH">UAH</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Дата</label>
                    <input
                        type="date"
                        name="date"
                        required
                        value={formData.date}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Категорія</label>
                    <select
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    >
                        <option value="">Оберіть категорію</option>
                        <option value="Office">Офісні витрати</option>
                        <option value="Travel">Відрядження</option>
                        <option value="Court Fees">Судові збори</option>
                        <option value="Salary">Зарплата</option>
                        <option value="Marketing">Маркетинг</option>
                        <option value="Other">Інше</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Справа</label>
                    <select
                        name="caseId"
                        value={formData.caseId}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    >
                        <option value="">Оберіть справу (необов'язково)</option>
                        {cases.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.title}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Статус</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    >
                        <option value="Pending">Очікує</option>
                        <option value="Approved">Затверджено</option>
                        <option value="Paid">Оплачено</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Рахунок</label>
                    <select
                        name="account"
                        value={formData.account}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    >
                        <option value="Cash">Каса</option>
                        <option value="FOP">ФОП</option>
                        <option value="Wallet">Гаманець</option>
                    </select>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        type="button"
                        onClick={() => navigate('/expenses')}
                        className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Скасувати
                    </button>
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Зберегти зміни
                    </button>
                </div>
            </form>
        </div>
    );
}
