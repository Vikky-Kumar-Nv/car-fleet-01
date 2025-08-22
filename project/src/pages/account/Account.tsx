import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';

import { UserRole } from '../../types';
interface NewUserForm { name: string; email: string; phone: string; role: UserRole | 'customer'; password: string }

export const Account: React.FC = () => {
  const { user, logout, users, addUser, updateUser, deleteUser } = useAuth();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ name: string; phone: string; role: UserRole | 'customer'; password?: string }>({ name: '', phone: '', role: 'dispatcher', password: 'password' });
  const startEdit = (id: string) => {
    const u = users.find(x => x.id === id);
    if (!u) return;
    setEditingId(id);
    setEditValues({ name: u.name, phone: u.phone, role: u.role, password: u.password });
  };

  const saveEdit = (id: string) => {
    updateUser(id, { name: editValues.name, phone: editValues.phone, role: editValues.role as UserRole, password: editValues.password });
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };
  const [form, setForm] = useState<NewUserForm>({ name: '', email: '', phone: '', role: 'dispatcher', password: 'password' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    addUser({
      name: form.name,
      email: form.email,
      phone: form.phone || 'N/A',
      role: form.role as UserRole,
      password: form.password,
    });
    setForm({ name: '', email: '', phone: '', role: 'dispatcher', password: 'password' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Account</h1>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-amber-600 flex items-center justify-center text-white text-2xl font-semibold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-900">{user?.name}</p>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm mt-1 inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-700 capitalize">
                <Icon name="role" className="h-3 w-3 mr-1" /> {user?.role}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium text-gray-900">Security</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">For demo purposes password management is disabled.</p>
          <Button variant="outline" onClick={logout} className="flex items-center">
            <Icon name="role" className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </CardContent>
      </Card>

      {user?.role === 'admin' && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900">User Management</h3>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={submitNewUser} className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-2 py-1 text-sm" placeholder="Full name" required />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full border rounded px-2 py-1 text-sm" placeholder="email@bolt.com" required />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="w-full border rounded px-2 py-1 text-sm" placeholder="+1234567890" />
              </div>
              <div className="md:col-span-1">
                <label htmlFor="new-user-role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select id="new-user-role" name="role" value={form.role} onChange={handleChange} className="w-full border rounded px-2 py-1 text-sm capitalize" aria-label="Select user role">
                  <option value="dispatcher">dispatcher</option>
                  <option value="driver">driver</option>
                  <option value="accountant">accountant</option>
                  <option value="customer">customer</option>
                </select>
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="text" name="password" value={form.password} onChange={handleChange} className="w-full border rounded px-2 py-1 text-sm" placeholder="password" required />
              </div>
              <div className="md:col-span-1 flex items-end">
                <Button type="submit" className="w-full flex items-center justify-center"><Icon name="plus" className="h-4 w-4 mr-1" /> Add</Button>
              </div>
            </form>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Existing Users</h4>
              <div className="overflow-x-auto border rounded">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">Name</th>
                      <th className="px-3 py-2 text-left font-medium">Email</th>
                      <th className="px-3 py-2 text-left font-medium">Role</th>
                      <th className="px-3 py-2 text-left font-medium">Created</th>
                      <th className="px-3 py-2 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className="odd:bg-white even:bg-gray-50 align-top">
                        <td className="px-3 py-2 font-medium text-gray-900">
                          {editingId === u.id ? (
                            <input value={editValues.name} onChange={e => setEditValues(v => ({ ...v, name: e.target.value }))} className="border rounded px-1 py-0.5 text-sm w-full" aria-label="Edit name" title="Edit name" placeholder="Name" />
                          ) : (
                            u.name
                          )}
                        </td>
                        <td className="px-3 py-2 text-gray-700">{u.email}</td>
                        <td className="px-3 py-2 capitalize">
                          {editingId === u.id ? (
                            <select value={editValues.role} onChange={e => setEditValues(v => ({ ...v, role: e.target.value as UserRole }))} className="border rounded px-1 py-0.5 text-sm" aria-label="Edit role" title="Edit role">
                              <option value="dispatcher">dispatcher</option>
                              <option value="driver">driver</option>
                              <option value="accountant">accountant</option>
                              <option value="customer">customer</option>
                            </select>
                          ) : u.role}
                        </td>
                        <td className="px-3 py-2 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="px-3 py-2 space-x-2">
                          {editingId === u.id ? (
                            <>
                              <Button type="button" variant="outline" className="px-2 py-1 text-xs" onClick={() => saveEdit(u.id)}>
                                <Icon name="success" className="h-3 w-3" />
                              </Button>
                              <Button type="button" variant="outline" className="px-2 py-1 text-xs" onClick={cancelEdit}>
                                <Icon name="close" className="h-3 w-3" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button type="button" variant="outline" className="px-2 py-1 text-xs" onClick={() => startEdit(u.id)} aria-label="Edit user">
                                <Icon name="edit" className="h-3 w-3" />
                              </Button>
                              <Button type="button" variant="outline" className="px-2 py-1 text-xs" onClick={() => { if (confirm('Delete user?')) deleteUser(u.id); }} aria-label="Delete user">
                                <Icon name="delete" className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
