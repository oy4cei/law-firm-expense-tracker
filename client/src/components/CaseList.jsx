import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function CaseList() {
    const [cases, setCases] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCase, setNewCase] = useState({ title: '', description: '', status: 'Open', clientId: '' });
    const [editingCase, setEditingCase] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [casesRes, clientsRes] = await Promise.all([
                axios.get('/api/cases'),
                axios.get('/api/clients')
            ]);
            setCases(casesRes.data);
            setClients(clientsRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.put(`/api/cases/${id}`, { status: newStatus });
            setCases(prev => prev.map(c =>
                c.id === id ? { ...c, status: newStatus } : c
            ));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Не вдалося оновити статус');
        }
    };

    const handleDelete = async (id) => {
        try {
            const impactRes = await axios.get(`/api/cases/${id}/impact`);
            const { expenses, incomes } = impactRes.data;

            let message = 'Ви впевнені, що хочете видалити цю справу?';
            if (expenses > 0 || incomes > 0) {
                message += `\n\nУВАГА: Це також видалить:\n- ${expenses} витрат\n- ${incomes} доходів`;
            }

            if (window.confirm(message)) {
                await axios.delete(`/api/cases/${id}`);
                fetchData();
            }
        } catch (error) {
            console.error('Error deleting case:', error);
            alert('Не вдалося видалити справу');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewCase(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCase) {
                await axios.put(`/api/cases/${editingCase.id}`, newCase);
                setEditingCase(null);
            } else {
                await axios.post('/api/cases', newCase);
            }
            setNewCase({ title: '', description: '', status: 'Open', clientId: '' });
            fetchData();
        } catch (error) {
            console.error('Error saving case:', error);
            alert('Не вдалося зберегти справу');
        }
    };

    const handleEdit = (kase) => {
        setEditingCase(kase);
        setNewCase({
            title: kase.title,
            description: kase.description,
            status: kase.status,
            clientId: kase.clientId || ''
        });
    };

    if (loading) return <div className="p-4">Завантаження...</div>;

    return (
        <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Додати нову справу</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <input
                            type="text"
                            name="title"
                            placeholder="Назва справи"
                            required
                            value={newCase.title}
                            onChange={handleChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <textarea
                            name="description"
                            placeholder="Опис"
                            value={newCase.description}
                            onChange={handleChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        />
                    </div>
                    <select
                        name="clientId"
                        value={newCase.clientId}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    >
                        <option value="">Оберіть клієнта (необов'язково)</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                    </select>
                    <select
                        name="status"
                        value={newCase.status}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    >
                        <option value="Open">Відкрито</option>
                        <option value="Closed">Закрито</option>
                        <option value="Pending">Очікує</option>
                    </select>
                    <button
                        type="submit"
                        className="sm:col-span-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {editingCase ? 'Оновити справу' : 'Додати справу'}
                    </button>
                    {editingCase && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditingCase(null);
                                setNewCase({ title: '', description: '', status: 'Open', clientId: '' });
                            }}
                            className="sm:col-span-2 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Скасувати редагування
                        </button>
                    )}
                </form>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Довідник справ</h3>
                </div>
                <div className="border-t border-gray-200 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Назва</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Опис</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Клієнт</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Дії</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {cases.map((kase) => (
                                <tr key={kase.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{kase.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{kase.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {kase.Client ? kase.Client.name : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={kase.status}
                                            onChange={(e) => handleStatusChange(kase.id, e.target.value)}
                                            className={`text-xs font-semibold rounded-full px-2 py-1 border-0 cursor-pointer
                                                ${kase.status === 'Open' ? 'bg-green-100 text-green-800' :
                                                    kase.status === 'Closed' ? 'bg-gray-100 text-gray-800' :
                                                        'bg-yellow-100 text-yellow-800'}`}
                                        >
                                            <option value="Open">Відкрито</option>
                                            <option value="Closed">Закрито</option>
                                            <option value="Pending">Очікує</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(kase)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                        >
                                            Редагувати
                                        </button>
                                        <button
                                            onClick={() => handleDelete(kase.id)}
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
        </div>
    );
}
