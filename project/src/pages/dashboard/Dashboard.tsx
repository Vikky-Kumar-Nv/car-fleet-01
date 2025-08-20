import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../context/AppContext';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Icon } from '../../components/ui/Icon';
import { format, isBefore, addDays, parseISO } from 'date-fns';

export const Dashboard: React.FC = () => {
  const { user, hasRole } = useAuth();
  const { bookings, drivers, vehicles, companies } = useApp();

  // If current user is a driver, resolve driver entity (match by name for demo)
  const currentDriver = user?.role === 'driver' ? drivers.find(d => d.name === user.name) : undefined;

  // Helper to decide if a booking belongs to current user (if driver)
  const bookingBelongsToCurrentDriver = (driverId?: string) => {
    if (!currentDriver) return true; // non-driver sees all
    return driverId === currentDriver.id;
  };

  // Calculate metrics
  const todayBookings = bookings.filter(booking => {
    const bookingDate = parseISO(booking.startDate);
    const today = new Date();
    return format(bookingDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd') && bookingBelongsToCurrentDriver(booking.driverId);
  });

  const ongoingTrips = bookings.filter(booking => booking.status === 'ongoing' && bookingBelongsToCurrentDriver(booking.driverId));
  const completedToday = bookings.filter(booking => 
    booking.status === 'completed' && 
    format(parseISO(booking.startDate), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') &&
    bookingBelongsToCurrentDriver(booking.driverId)
  );

  // Calculate expiry alerts
  const getExpiryAlerts = () => {
    const alerts: Array<{type: string, item: string, expiry: string}> = [];
    const thirtyDaysFromNow = addDays(new Date(), 30);

    // Check driver documents (only current driver if role is driver)
    const driverList = currentDriver ? [currentDriver] : drivers;
    driverList.forEach(driver => {
      const licenseExpiry = parseISO(driver.licenseExpiry);
      const policeExpiry = parseISO(driver.policeVerificationExpiry);

      if (isBefore(licenseExpiry, thirtyDaysFromNow)) {
        alerts.push({
          type: 'License',
          item: driver.name,
          expiry: driver.licenseExpiry
        });
      }

      if (isBefore(policeExpiry, thirtyDaysFromNow)) {
        alerts.push({
          type: 'Police Verification',
          item: driver.name,
          expiry: driver.policeVerificationExpiry
        });
      }
    });

    // Check vehicle documents
  // Vehicles: for driver role we only show vehicles that appear in their trips today / ongoing
  const relevantVehicleIds = currentDriver ? Array.from(new Set(bookings.filter(b => b.driverId === currentDriver.id).map(b => b.vehicleId).filter(Boolean))) : vehicles.map(v => v.id);
  vehicles.filter(v => relevantVehicleIds.includes(v.id)).forEach(vehicle => {
      const insurance = parseISO(vehicle.insuranceExpiry);
      const fitness = parseISO(vehicle.fitnessExpiry);
      const permit = parseISO(vehicle.permitExpiry);
      const pollution = parseISO(vehicle.pollutionExpiry);

      if (isBefore(insurance, thirtyDaysFromNow)) {
        alerts.push({
          type: 'Insurance',
          item: vehicle.registrationNumber,
          expiry: vehicle.insuranceExpiry
        });
      }

      if (isBefore(fitness, thirtyDaysFromNow)) {
        alerts.push({
          type: 'Fitness',
          item: vehicle.registrationNumber,
          expiry: vehicle.fitnessExpiry
        });
      }

      if (isBefore(permit, thirtyDaysFromNow)) {
        alerts.push({
          type: 'Permit',
          item: vehicle.registrationNumber,
          expiry: vehicle.permitExpiry
        });
      }

      if (isBefore(pollution, thirtyDaysFromNow)) {
        alerts.push({
          type: 'Pollution',
          item: vehicle.registrationNumber,
          expiry: vehicle.pollutionExpiry
        });
      }
    });

    return alerts;
  };

  const expiryAlerts = getExpiryAlerts();

  // Calculate financial metrics
  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
  const totalOutstanding = companies.reduce((sum, company) => sum + company.outstandingAmount, 0);
  const unbilledAmount = bookings
    .filter(booking => !booking.billed && booking.status === 'completed')
    .reduce((sum, booking) => sum + booking.balance, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {user?.name}
        </h1>
        <div className="text-sm text-gray-500">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Icon name="calendar" className="h-8 w-8 text-amber-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Today's Trips</p>
                <p className="text-2xl font-bold text-gray-900">{todayBookings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Icon name="clock" className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Ongoing Trips</p>
                <p className="text-2xl font-bold text-gray-900">{ongoingTrips.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Icon name="success" className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed Today</p>
                <p className="text-2xl font-bold text-gray-900">{completedToday.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Icon name="warning" className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Expiry Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{expiryAlerts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Trips */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900">Today's Trips</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
              {todayBookings.length === 0 ? (
                <p className="text-gray-500">No trips scheduled for today</p>
              ) : (
                todayBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{booking.customerName}</p>
                      <p className="text-sm text-gray-500">
                        {booking.pickupLocation} → {booking.dropLocation}
                      </p>
                      <p className="text-xs text-gray-400">
                        {format(parseISO(booking.startDate), 'h:mm a')}
                      </p>
                    </div>
                    <Badge variant={booking.status}>
                      {booking.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Compliance Alerts */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900">Compliance Alerts</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
              {expiryAlerts.length === 0 ? (
                <p className="text-gray-500">All documents are up to date</p>
              ) : (
                expiryAlerts.map((alert, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-orange-900">{alert.type} Expiring</p>
                      <p className="text-sm text-orange-700">{alert.item}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-orange-900">
                        {format(parseISO(alert.expiry), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Overview - Only for Admin and Accountant */}
      {hasRole(['admin', 'accountant']) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Icon name="money" className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Icon name="warning" className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Outstanding Payments</p>
                  <p className="text-2xl font-bold text-gray-900">₹{totalOutstanding.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Icon name="chart" className="h-8 w-8 text-amber-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Unbilled Amount</p>
                  <p className="text-2xl font-bold text-gray-900">₹{unbilledAmount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

  {/* Fleet Overview - For Admin and Dispatcher (not for driver) */}
  {hasRole(['admin', 'dispatcher']) && user?.role !== 'driver' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">Fleet Status</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Icon name="car" className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Active Vehicles</span>
                  </div>
                  <span className="font-medium">{vehicles.filter(v => v.status === 'active').length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Icon name="user" className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Active Drivers</span>
                  </div>
                  <span className="font-medium">{drivers.filter(d => d.status === 'active').length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">Vehicle Categories</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['sedan', 'SUV', 'bus', 'mini-bus'].map(category => {
                  const count = vehicles.filter(v => v.category === category).length;
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 capitalize">{category}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};