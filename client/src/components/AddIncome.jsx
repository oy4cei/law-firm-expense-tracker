import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddIncome() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        currency: 'UAH',
        date: new Date().toISOString().split('T')[0],
        source: '',
        caseId: '',
        account: 'Cash'
    });
    const [cases, setCases] = useState([]);

    useEffect(() => {
        fetchCases();
    }, []);

    const fetchCases = async () => {
        try {
            const response = await axios.get('/api/cases');
            setCases(response.data);
        } catch (error) {
            console.error('Error fetching cases:', error);
        }
    };

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
            await axios.post('/api/incomes', formData);
            navigate('/report');
        } catch (error) {
            console.error('Error creating income:', error);
            alert('Не вдалося додати дохід');
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Додати дохід</h2>
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
                        <div className="mt-1 relative rounded-md shadow-sm flex">
                            <input
                                type="number"
                                name="amount"
                                step="0.01"
                                required
                                value={formData.amount}
                                onChange={handleChange}
                                className="block w-full rounded-none rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            />
                            <select
                                name="currency"
                                value={formData.currency}
                                onChange={handleChange}
                                className="absolute inset-y-0 right-0 flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="UAH">UAH</option>
                                <option value="USD">USD</option>
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
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Джерело</label>
                    <select
                        name="source"
                        required
                        value={formData.source}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    >
                        <option value="">Оберіть джерело</option>
                        <option value="Client Payment">Оплата клієнта</option>
                        <option value="Consultation Fee">Консультація</option>
                        <option value="Court Award">Судове рішення</option>
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
                        onClick={() => navigate('/')}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Скасувати
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Зберегти дохід
                    </button>
                </div>
            </form>
        </div>
    );
}
