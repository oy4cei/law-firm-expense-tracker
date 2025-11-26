import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ClientList() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newClient, setNewClient] = useState({ name: '', email: '', phone: '' });
    const [editingClient, setEditingClient] = useState(null);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await axios.get('/api/clients');
            setClients(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching clients:', error);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewClient(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingClient) {
                await axios.put(`/api/clients/${editingClient.id}`, newClient);
                setEditingClient(null);
            } else {
                await axios.post('/api/clients', newClient);
            }
            setNewClient({ name: '', email: '', phone: '' });
            fetchClients();
        } catch (error) {
            console.error('Error saving client:', error);
            alert('Не вдалося зберегти клієнта');
        }
    };

    const handleEdit = (client) => {
        setEditingClient(client);
        setNewClient({ name: client.name, email: client.email, phone: client.phone });
    };

    const handleDelete = async (id) => {
        try {
            const impactRes = await axios.get(`/api/clients/${id}/impact`);
            const { cases, expenses, incomes } = impactRes.data;

            let message = 'Ви впевнені, що хочете видалити цього клієнта?';
            if (cases > 0 || expenses > 0 || incomes > 0) {
                message += `\n\nУВАГА: Це також видалить:\n- ${cases} справ\n- ${expenses} витрат\n- ${incomes} доходів`;
            }

            if (window.confirm(message)) {
                await axios.delete(`/api/clients/${id}`);
                fetchClients();
            }
        } catch (error) {
            console.error('Error deleting client:', error);
            alert('Не вдалося видалити клієнта');
        }
    };

    if (loading) return <div className="p-4">Завантаження...</div>;

    return (
        <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Додати нового клієнта</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <input
                        type="text"
                        name="name"
                        placeholder="Ім'я"
                        required
                        value={newClient.name}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={newClient.email}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="Телефон"
                        value={newClient.phone}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                    <button
                        type="submit"
                        className="sm:col-span-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {editingClient ? 'Оновити клієнта' : 'Додати клієнта'}
                    </button>
                    {editingClient && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditingClient(null);
                                setNewClient({ name: '', email: '', phone: '' });
                            }}
                            className="sm:col-span-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Скасувати редагування
                        </button>
                    )}
                </form>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Довідник клієнтів</h3>
                </div>
                <div className="border-t border-gray-200 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ім'я</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Телефон</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Дії</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {clients.map((client) => (
                                <tr key={client.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.phone}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(client)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                        >
                                            Редагувати
                                        </button>
                                        <button
                                            onClick={() => handleDelete(client.id)}
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
