import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Icon } from '../../components/ui/Icon';
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { Booking, Expense } from '../../types';

// Minimal shape for Recharts Pie label props we rely on
interface PieLabelPayload { type?: string; name?: string; }
interface SimplePieLabelProps { percent?: number; payload?: PieLabelPayload }

// Report related types
type ReportType = 'monthly-earnings' | 'driver-performance' | 'vehicle-usage' | 'expense-breakdown';

interface MonthlyEarnings { month: string; earnings: number; }
interface DriverPerformance { driver: string; trips: number; earnings: number; }
interface VehicleUsage { vehicle: string; trips: number; category: string; }
interface ExpenseBreakdown { type: string; amount: number; }

type ReportRow = MonthlyEarnings | DriverPerformance | VehicleUsage | ExpenseBreakdown;

export const Reports: React.FC = () => {
  const { bookings, drivers, vehicles } = useApp();
  const [reportType, setReportType] = useState<ReportType>('monthly-earnings');
  const [dateRange, setDateRange] = useState({
    start: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    end: format(endOfMonth(new Date()), 'yyyy-MM-dd')
  });

  const filterBookingsByDateRange = (bookingList: Booking[]): Booking[] => {
    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);
    return bookingList.filter(b => {
      const bookingDate = parseISO(b.startDate);
      return isWithinInterval(bookingDate, { start, end });
    });
  };

  const generateMonthlyEarningsData = (): MonthlyEarnings[] => {
    const filteredBookings = filterBookingsByDateRange(bookings);
    const monthlyData: Record<string, number> = {};
    filteredBookings.forEach(b => {
      const month = format(parseISO(b.startDate), 'MMM yyyy');
      monthlyData[month] = (monthlyData[month] || 0) + b.totalAmount;
    });
    return Object.entries(monthlyData).map(([month, earnings]) => ({ month, earnings }));
  };

  const generateDriverPerformanceData = (): DriverPerformance[] => {
    const filteredBookings = filterBookingsByDateRange(bookings);
    const driverData: Record<string, { trips: number; earnings: number }> = {};
    filteredBookings.forEach(b => {
      if (b.driverId) {
        const driverId = b.driverId;
        if (!driverData[driverId]) driverData[driverId] = { trips: 0, earnings: 0 };
        driverData[driverId].trips += 1;
        driverData[driverId].earnings += b.totalAmount;
      }
    });
    return Object.entries(driverData).map(([driverId, stats]) => {
      const driver = drivers.find(d => d.id === driverId);
      return { driver: driver?.name || 'Unknown Driver', trips: stats.trips, earnings: stats.earnings };
    });
  };

  const generateVehicleUsageData = (): VehicleUsage[] => {
    const filteredBookings = filterBookingsByDateRange(bookings);
    const vehicleData: Record<string, number> = {};
    filteredBookings.forEach(b => {
      if (b.vehicleId) vehicleData[b.vehicleId] = (vehicleData[b.vehicleId] || 0) + 1;
    });
    return Object.entries(vehicleData).map(([vehicleId, trips]) => {
      const vehicle = vehicles.find(v => v.id === vehicleId);
      return { vehicle: vehicle?.registrationNumber || 'Unknown Vehicle', trips, category: vehicle?.category || 'unknown' };
    });
  };

  const generateExpenseBreakdownData = (): ExpenseBreakdown[] => {
    const filteredBookings = filterBookingsByDateRange(bookings);
    const expenseData: Record<string, number> = {};
    filteredBookings.forEach(b => {
      b.expenses.forEach((exp: Expense) => {
        expenseData[exp.type] = (expenseData[exp.type] || 0) + exp.amount;
      });
    });
    return Object.entries(expenseData).map(([type, amount]) => ({ type: type.charAt(0).toUpperCase() + type.slice(1), amount }));
  };

  const getReportData = (): ReportRow[] => {
    switch (reportType) {
      case 'monthly-earnings': return generateMonthlyEarningsData();
      case 'driver-performance': return generateDriverPerformanceData();
      case 'vehicle-usage': return generateVehicleUsageData();
      case 'expense-breakdown': return generateExpenseBreakdownData();
      default: return [];
    }
  };

  const getChartComponent = () => {
    const data = getReportData();
    const colors = ['#D97706', '#F59E0B', '#FCD34D', '#FEF3C7', '#15803D'];

    switch (reportType) {
      case 'monthly-earnings':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Earnings']} />
              <Bar dataKey="earnings" fill="#D97706" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'driver-performance':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="driver" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="trips" fill="#F59E0B" name="Trips" />
              <Bar yAxisId="right" dataKey="earnings" fill="#D97706" name="Earnings (₹)" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'vehicle-usage':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="vehicle" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="trips" fill="#D97706" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'expense-breakdown':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props: SimplePieLabelProps) => {
                  const percent = props.percent ?? 0;
                  const lbl = props.payload?.type || props.payload?.name || '';
                  return `${lbl} (${(percent * 100).toFixed(0)}%)`;
                }}
                outerRadius={120}
                fill="#8884d8"
                dataKey="amount"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Amount']} />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const exportReport = () => {
    const data = getReportData();
    const csv = [
      Object.keys(data[0] || {}).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${reportType}-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <Button onClick={exportReport}>
          <Icon name="download" className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium text-gray-900">Report Filters</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as ReportType)}
              label="Report Type"
              options={[
                { value: 'monthly-earnings', label: 'Monthly Earnings' },
                { value: 'driver-performance', label: 'Driver Performance' },
                { value: 'vehicle-usage', label: 'Vehicle Usage' },
                { value: 'expense-breakdown', label: 'Expense Breakdown' }
              ]}
            />

            <Input
              type="date"
              label="Start Date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />

            <Input
              type="date"
              label="End Date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              {reportType.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </h3>
            <div className="flex items-center text-sm text-gray-500">
              <Icon name="calendar" className="h-4 w-4 mr-1" />
              {format(new Date(dateRange.start), 'MMM d')} - {format(new Date(dateRange.end), 'MMM d, yyyy')}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {getReportData().length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No data available for the selected period</p>
            </div>
          ) : (
            getChartComponent()
          )}
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">
                {filterBookingsByDateRange(bookings).length}
              </p>
              <p className="text-sm text-gray-500">Total Trips</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                ₹{filterBookingsByDateRange(bookings)
                  .reduce((sum, booking) => sum + booking.totalAmount, 0)
                  .toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Total Revenue</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                ₹{filterBookingsByDateRange(bookings)
                  .reduce((sum, booking) => 
                    sum + booking.expenses.reduce((expSum, exp) => expSum + exp.amount, 0), 0
                  ).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Total Expenses</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};