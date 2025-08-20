import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';

export const VehicleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { vehicles, bookings } = useApp();
  const vehicle = vehicles.find(v => v.id === id);

  if (!vehicle) {
    return (
      <div className="space-y-4">
        <p className="text-gray-600">Vehicle not found.</p>
        <Button onClick={() => navigate('/vehicles')}>Back</Button>
      </div>
    );
  }

  const relatedBookings = bookings.filter(b => b.vehicleId === vehicle.id);
  const totalRevenue = relatedBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalExpenses = relatedBookings.reduce((sum, b) => sum + b.expenses.reduce((eSum, e)=> eSum + e.amount, 0), 0);
  const completedTrips = relatedBookings.filter(b => b.status === 'completed').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate('/vehicles')}>
          <Icon name="back" className="h-4 w-4 mr-2" /> Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">{vehicle.registrationNumber}</h1>
        <Button variant="outline" onClick={() => navigate(`/vehicles/${vehicle.id}/edit`)}>
          <Icon name="edit" className="h-4 w-4 mr-2" /> Edit
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Basic Info</h2>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><span className="font-medium">Category:</span> {vehicle.category}</div>
          <div><span className="font-medium">Ownership:</span> {vehicle.owner}</div>
          <div><span className="font-medium">Status:</span> {vehicle.status}</div>
          {vehicle.mileageTrips !== undefined && <div><span className="font-medium">Trips:</span> {vehicle.mileageTrips}</div>}
          {vehicle.mileageKm !== undefined && <div><span className="font-medium">Mileage (km):</span> {vehicle.mileageKm?.toLocaleString()}</div>}
          <div><span className="font-medium">Created:</span> {vehicle.createdAt?.slice(0,10)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Document Expiry</h2>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><span className="font-medium">Insurance:</span> {vehicle.insuranceExpiry}</div>
          <div><span className="font-medium">Fitness:</span> {vehicle.fitnessExpiry}</div>
          <div><span className="font-medium">Permit:</span> {vehicle.permitExpiry}</div>
          <div><span className="font-medium">Pollution:</span> {vehicle.pollutionExpiry}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Usage & Performance</h2>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-xl font-bold text-amber-600">{relatedBookings.length}</p>
            <p className="text-xs text-gray-500">Trips</p>
          </div>
          <div>
            <p className="text-xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Revenue</p>
          </div>
          <div>
            <p className="text-xl font-bold text-red-600">₹{totalExpenses.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Trip Expenses</p>
          </div>
            <div>
            <p className="text-xl font-bold text-amber-700">{completedTrips}</p>
            <p className="text-xs text-gray-500">Completed</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Recent Trips</h2>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {relatedBookings.slice(-5).reverse().map(b => (
            <div key={b.id} className="flex items-center justify-between p-2 border rounded-md">
              <div>
                <p className="font-medium">{b.pickupLocation} → {b.dropLocation}</p>
                <p className="text-xs text-gray-500">{b.startDate.slice(0,10)} • {b.status}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">₹{b.totalAmount.toLocaleString()}</p>
                <p className="text-xs text-red-600">₹{b.expenses.reduce((s,e)=>s+e.amount,0).toLocaleString()} exp</p>
              </div>
            </div>
          ))}
          {relatedBookings.length === 0 && <p className="text-gray-500">No trips yet for this vehicle.</p>}
        </CardContent>
      </Card>
    </div>
  );
};
