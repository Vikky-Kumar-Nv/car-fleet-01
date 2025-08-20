import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Icon } from '../../components/ui/Icon';
import { format, parseISO } from 'date-fns';
import { UploadedFile, Expense, Booking } from '../../types';
import { bookingAPI } from '../../services/api';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export const BookingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { bookings, updateBooking, updateBookingStatus, toggleBookingBilled, drivers, vehicles } = useApp();
  const { hasRole } = useAuth();
  
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  const booking = bookings.find(b => b.id === id);

  // If booking exists but has driverId/vehicleId and we haven't loaded those entities yet, try a one-time direct fetch to ensure latest state
  useEffect(() => {
    (async () => {
      if (!id) return;
      if (!booking) return;
      try {
        const fresh = await bookingAPI.get(id);
        updateBooking(id, fresh as unknown as Partial<Booking>);
      } catch { /* ignore */ }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  interface ExpenseForm { type: Expense['type']; amount: string; description: string }
  const {
    register: registerExpense,
    handleSubmit: handleExpenseSubmit,
    reset: resetExpense,
    formState: { errors: expenseErrors }
  } = useForm<ExpenseForm>();

  interface StatusForm { status: Booking['status'] }
  const {
    register: registerStatus,
    handleSubmit: handleStatusSubmit,
    formState: { errors: statusErrors }
  } = useForm<StatusForm>();

  if (!booking) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Booking not found</h2>
        <Button onClick={() => navigate('/bookings')} className="mt-4">
          Back to Bookings
        </Button>
      </div>
    );
  }

  const driver = booking.driverId ? drivers.find(d => d.id === booking.driverId) : null;
  const vehicle = booking.vehicleId ? vehicles.find(v => v.id === booking.vehicleId) : null;

  const onAddExpense = (data: ExpenseForm) => {
    const newExpense = {
      id: Date.now().toString(),
      type: data.type,
      amount: parseFloat(data.amount),
      description: data.description,
    };

    updateBooking(booking.id, {
      expenses: [...booking.expenses, newExpense]
    });

    toast.success('Expense added successfully');
    setShowExpenseModal(false);
    resetExpense();
  };

  const onUpdateStatus = async (data: StatusForm) => {
    await updateBookingStatus(booking.id, data.status, 'Current User');
    toast.success('Status updated successfully');
    setShowStatusModal(false);
  };

  const toggleBilled = async () => {
    try {
      await toggleBookingBilled(booking.id, !booking.billed);
      toast.success(`Booking marked as ${!booking.billed ? 'billed' : 'not billed'}`);
    } catch {
      toast.error('Failed to update billing status');
    }
  };

  const onDutySlipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const existing = booking.dutySlips || [];
  const converted: UploadedFile[] = await Promise.all(Array.from(files).map(file => new Promise<UploadedFile>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({
          id: Date.now().toString() + Math.random().toString(36).slice(2),
          name: file.name,
            type: file.type,
            size: file.size,
            data: reader.result as string,
            uploadedAt: new Date().toISOString(),
          });
        reader.onerror = reject;
        reader.readAsDataURL(file);
      })));
      updateBooking(booking.id, { dutySlips: [...existing, ...converted] });
      toast.success('Duty slip(s) uploaded');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeDutySlip = (id: string) => {
    updateBooking(booking.id, { dutySlips: (booking.dutySlips || []).filter(f => f.id !== id) });
  };

  const totalExpenses = booking.expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/bookings')}>
            <Icon name="back" className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Booking #{booking.id.slice(-6)}
            </h1>
            <p className="text-gray-500">Created {format(parseISO(booking.createdAt), 'PPP')}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Badge variant={booking.status} className="text-sm px-3 py-1">
            {booking.status}
          </Badge>
          {hasRole(['admin', 'dispatcher']) && (
            <Button
              variant="outline"
              onClick={() => navigate(`/bookings/${booking.id}/edit`)}
            >
              <Icon name="edit" className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & Journey Info */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">Journey Details</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Icon name="user" className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{booking.customerName}</p>
                    <p className="text-sm text-gray-500">{booking.customerPhone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Icon name="file" className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium capitalize">{booking.bookingSource.replace('-', ' ')}</p>
                    <p className="text-sm text-gray-500 capitalize">{booking.journeyType}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Icon name="location" className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <p className="font-medium">Pickup</p>
                    <p className="text-sm text-gray-600">{booking.pickupLocation}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Icon name="location" className="h-5 w-5 text-red-600 mt-1" />
                  <div>
                    <p className="font-medium">Drop</p>
                    <p className="text-sm text-gray-600">{booking.dropLocation}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Icon name="calendar" className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Start</p>
                    <p className="text-sm text-gray-600">
                      {format(parseISO(booking.startDate), 'PPP p')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Icon name="calendar" className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">End</p>
                    <p className="text-sm text-gray-600">
                      {format(parseISO(booking.endDate), 'PPP p')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assignment Info */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">Assignment</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Icon name="user" className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Driver</p>
                    <p className="text-sm text-gray-600">
                      {driver ? driver.name : 'Not assigned'}
                    </p>
                    {driver && (
                      <p className="text-xs text-gray-500">{driver.phone}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Icon name="car" className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Vehicle</p>
                    <p className="text-sm text-gray-600">
                      {vehicle ? vehicle.registrationNumber : 'Not assigned'}
                    </p>
                    {vehicle && (
                      <p className="text-xs text-gray-500 capitalize">{vehicle.category}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expenses */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Expenses</h3>
                {hasRole(['admin', 'dispatcher', 'driver']) && booking.status !== 'booked' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowExpenseModal(true)}
                  >
                    <Icon name="plus" className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {booking.expenses.length === 0 ? (
                <p className="text-gray-500">No expenses recorded</p>
              ) : (
                <div className="space-y-3">
                  {booking.expenses.map((expense) => (
                    <div key={expense.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium capitalize">{expense.type}</p>
                        <p className="text-sm text-gray-600">{expense.description}</p>
                      </div>
                      <p className="font-medium">₹{expense.amount.toLocaleString()}</p>
                    </div>
                  ))}
                  <div className="border-t pt-3 flex justify-between items-center font-medium">
                    <span>Total Expenses</span>
                    <span>₹{totalExpenses.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status History */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">Status History</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {booking.statusHistory.map((history) => (
                  <div key={history.id} className="flex items-center space-x-3">
                    <Icon name="clock" className="h-4 w-4 text-gray-400" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Badge variant={history.status} className="text-xs">
                          {history.status}
                        </Badge>
                        <span className="text-sm text-gray-500">by {history.changedBy}</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {format(parseISO(history.timestamp), 'PPP p')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Financial Summary */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">Financial Summary</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount</span>
                <span className="font-medium">₹{booking.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Advance</span>
                <span className="font-medium">₹{booking.advanceReceived.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expenses</span>
                <span className="font-medium">₹{totalExpenses.toLocaleString()}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Balance</span>
                <span>₹{booking.balance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Billing Status</span>
                <Badge variant={booking.billed ? 'completed' : 'pending'}>
                  {booking.billed ? 'Billed' : 'Not Billed'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">Actions</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {hasRole(['admin', 'dispatcher', 'driver']) && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowStatusModal(true)}
                >
                  Update Status
                </Button>
              )}

              {hasRole(['admin', 'accountant']) && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={toggleBilled}
                >
                  Mark as {booking.billed ? 'Not Billed' : 'Billed'}
                </Button>
              )}

              {booking.status === 'completed' && (
                <div className="space-y-2">
                  <label className="w-full flex items-center justify-center px-3 py-2 border border-dashed border-amber-400 rounded-md text-sm cursor-pointer hover:bg-amber-50 transition">
                    <Icon name="upload" className="h-4 w-4 mr-2 text-amber-600" />
                    {uploading ? 'Uploading...' : 'Upload Duty Slip(s)'}
                    <input type="file" multiple accept="image/*,application/pdf" onChange={onDutySlipUpload} className="hidden" />
                  </label>
                  {(booking.dutySlips && booking.dutySlips.length > 0) && (
                    <div className="space-y-2 max-h-48 overflow-auto">
                      {booking.dutySlips.map(file => (
                        <div key={file.id} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded text-xs">
                          <div className="truncate">
                            <span className="font-medium text-gray-700">{file.name}</span>
                            <span className="ml-2 text-gray-500">{(file.size/1024).toFixed(1)} KB</span>
                          </div>
                          <button onClick={() => removeDutySlip(file.id)} aria-label="Remove file" className="text-red-600 hover:text-red-800 p-1">
                            <Icon name="close" className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Expense Modal */}
      <Modal
        isOpen={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        title="Add Expense"
      >
        <form onSubmit={handleExpenseSubmit(onAddExpense)} className="space-y-4">
          <Select
            {...registerExpense('type', { required: 'Expense type is required' })}
            label="Expense Type"
            error={expenseErrors.type?.message as string}
            options={[
              { value: 'fuel', label: 'Fuel' },
              { value: 'toll', label: 'Toll' },
              { value: 'parking', label: 'Parking' },
              { value: 'other', label: 'Other' }
            ]}
          />

          <Input
            {...registerExpense('amount', { required: 'Amount is required' })}
            type="number"
            step="0.01"
            label="Amount"
            error={expenseErrors.amount?.message as string}
            placeholder="0.00"
          />

          <Input
            {...registerExpense('description', { required: 'Description is required' })}
            label="Description"
            error={expenseErrors.description?.message as string}
            placeholder="Enter expense description"
          />

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowExpenseModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Expense</Button>
          </div>
        </form>
      </Modal>

      {/* Status Update Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Update Status"
      >
        <form onSubmit={handleStatusSubmit(onUpdateStatus)} className="space-y-4">
          <Select
            {...registerStatus('status', { required: 'Status is required' })}
            label="New Status"
            error={statusErrors.status?.message as string}
            options={[
              { value: 'booked', label: 'Booked' },
              { value: 'ongoing', label: 'Ongoing' },
              { value: 'completed', label: 'Completed' }
            ]}
          />

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowStatusModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Update Status</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};