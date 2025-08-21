import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { customerAPI } from '../../services/api';
import { Customer } from '../../types';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';

export const CustomerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { customers, deleteCustomer } = useApp();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const existing = customers.find(c => c.id === id);
    if (existing) {
      setCustomer(existing);
      return;
    }
    setLoading(true);
    customerAPI.get(id)
      .then(c => setCustomer(c as Customer))
      .catch(err => { console.error(err); setError('Failed to load customer'); })
      .finally(() => setLoading(false));
  }, [id, customers]);

  const handleDelete = async () => {
    if (!customer) return;
    if (!confirm('Delete this customer?')) return;
    await deleteCustomer(customer.id);
    navigate('/customers');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate('/customers')}>
          <Icon name="back" className="h-4 w-4 mr-2" /> Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Customer Details</h1>
        {customer && (
          <div className="ml-auto flex space-x-2">
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Overview</h2>
        </CardHeader>
        <CardContent>
          {loading && <p className="text-gray-500">Loading...</p>}
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {!loading && !error && !customer && <p className="text-gray-500">Customer not found.</p>}
          {customer && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-gray-500">Name</p>
                <p className="font-medium text-gray-900">{customer.name}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{customer.phone}</p>
              </div>
              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{customer.email || '-'}</p>
              </div>
              <div>
                <p className="text-gray-500">Address</p>
                <p className="font-medium text-gray-900">{customer.address || '-'}</p>
              </div>
              <div>
                <p className="text-gray-500">Created</p>
                <p className="font-medium text-gray-900">{new Date(customer.createdAt).toLocaleString()}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
