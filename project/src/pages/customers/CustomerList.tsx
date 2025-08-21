import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Icon } from '../../components/ui/Icon';

export const CustomerList: React.FC = () => {
  const { customers, customersLoading, deleteCustomer } = useApp();
  const [search, setSearch] = useState('');

  const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <Button onClick={() => window.location.href = '/customers/create'}>
          <Icon name="plus" className="h-4 w-4 mr-2" /> New Customer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Input value={search} onChange={e=>setSearch(e.target.value)} label="Search" placeholder="Name or phone" />
            {customersLoading && <span className="text-sm text-gray-500">Loading...</span>}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-3 py-2  text-xs font-medium text-gray-500 uppercase tracking-wider" >Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-sm">
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td className="px-3 py-2 whitespace-nowrap font-medium text-gray-900">{c.name}</td>
                    <td className="px-3 py-2">{c.phone}</td>
                    <td className="px-3 py-2">{c.email || '-'}</td>
                    <td className="px-3 py-2 truncate max-w-xs" title={c.address}>{c.address || '-'}</td>
                    <td className="px-3 py-2 text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={()=>window.location.href=`/customers/${c.id}`}>View</Button>
                      <Button variant="outline" size="sm" onClick={()=>window.location.href=`/customers/${c.id}/edit`}>Edit</Button>
                      <Button variant="danger" size="sm" onClick={()=>deleteCustomer(c.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-3 py-6 text-center text-gray-500">No customers found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
