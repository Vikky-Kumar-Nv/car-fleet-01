import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fuelAPI } from '../../services/api';

interface FuelRow { id: string; vehicleId: string; vehicleLabel?: string; bookingId: string; bookingLabel?: string; fuelFillDate: string; fuelQuantity: number; fuelRate: number; totalAmount: number; }

const FuelManagement: React.FC = () => {
  const [rows, setRows] = useState<FuelRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<FuelRow|null>(null);
  const [confirmDelete, setConfirmDelete] = useState<FuelRow|null>(null);
  const [viewing, setViewing] = useState<FuelRow|null>(null);
  const navigate = useNavigate();

  async function loadFuel(){
    setLoading(true);
    try {
      const data = await fuelAPI.list();
      setRows(data.map(d=>({
        id: d.id,
        vehicleId: d.vehicleId,
        vehicleLabel: d.vehicleLabel,
        bookingId: d.bookingId,
        bookingLabel: d.bookingLabel,
        fuelFillDate: d.fuelFillDate,
        fuelQuantity: d.fuelQuantity,
        fuelRate: d.fuelRate,
        totalAmount: d.totalAmount,
      })));
    } catch (e) { console.error('Failed to load fuel entries', e); } finally { setLoading(false); }
  }

  useEffect(()=>{ loadFuel(); },[]);

  const totalQty = rows.reduce((s,r)=>s+r.fuelQuantity,0);
  const totalCost = rows.reduce((s,r)=>s+r.totalAmount,0);

  async function handleDelete(id: string){
    try { await fuelAPI.delete(id); } catch(e){ console.error('Delete failed', e);}  
    setRows(r=>r.filter(x=>x.id!==id));
    setConfirmDelete(null);
  }

  async function handleSave(){
    if(!editing) return;
    try {
      await fuelAPI.update(editing.id, { fuelFillDate: editing.fuelFillDate, fuelQuantity: editing.fuelQuantity, fuelRate: editing.fuelRate });
      setRows(rs=>rs.map(r=> r.id===editing.id ? { ...r, ...editing, totalAmount: editing.fuelQuantity*editing.fuelRate } : r));
    } catch(e){ console.error('Update failed', e);} finally { setEditing(null); }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Fuel Management</h1>
        <Button onClick={()=>navigate('/fuel/add')}>
          <Icon name="plus" className="h-4 w-4 mr-2" />Add Fuel
        </Button>
      </div>
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Fuel Entries</h2>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qty (L)</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {loading && (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
                )}
                {!loading && rows.length===0 && (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No fuel entries yet</td></tr>
                )}
                {rows.map(r=> (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div className="text-gray-900">{r.fuelFillDate ? format(new Date(r.fuelFillDate), 'MMM d, yyyy') : '-'}</div>
                      <div className="text-xs text-gray-500">{r.fuelFillDate ? format(new Date(r.fuelFillDate), 'h:mm a') : ''}</div>
                    </td>
                    <td className="px-6 py-3 text-gray-700">{r.vehicleLabel || r.vehicleId || '-'}</td>
                    <td className="px-6 py-3 text-gray-700">{r.bookingLabel || r.bookingId || '-'}</td>
                    <td className="px-6 py-3 text-right text-gray-700">{r.fuelQuantity.toFixed(2)}</td>
                    <td className="px-6 py-3 text-right text-gray-700">{r.fuelRate.toFixed(2)}</td>
                    <td className="px-6 py-3 text-right text-gray-900 font-medium">₹{r.totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-3 text-right space-x-2 whitespace-nowrap">
                      <Button size="sm" variant="outline" onClick={()=>setViewing(r)}><Icon name="eye" className="h-4 w-4"/></Button>
                      <Button size="sm" variant="outline" onClick={()=>setEditing(r)}><Icon name="edit" className="h-4 w-4"/></Button>
                      <Button size="sm" variant="danger" onClick={()=>setConfirmDelete(r)}><Icon name="delete" className="h-4 w-4"/></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
              {rows.length>0 && (
                <tfoot className="bg-gray-50">
                  <tr>
                    <td className="px-6 py-3 text-xs font-medium text-gray-500" colSpan={3}>Totals</td>
                    <td className="px-6 py-3 text-right text-sm font-semibold text-gray-900">{totalQty.toFixed(2)}</td>
                    <td className="px-6 py-3"></td>
                    <td className="px-6 py-3 text-right text-sm font-semibold text-gray-900">₹{totalCost.toFixed(2)}</td>
                      <td></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </CardContent>
      </Card>
        {/* View modal */}
        <Modal isOpen={!!viewing} onClose={()=>setViewing(null)} title="Fuel Entry Details">
          {viewing && (
            <div className="space-y-2 text-sm text-gray-700">
              <div><span className="font-medium">Date:</span> {format(new Date(viewing.fuelFillDate), 'PPP p')}</div>
              <div><span className="font-medium">Vehicle:</span> {viewing.vehicleLabel || viewing.vehicleId}</div>
              <div><span className="font-medium">Booking:</span> {viewing.bookingLabel || viewing.bookingId}</div>
              <div><span className="font-medium">Quantity:</span> {viewing.fuelQuantity.toFixed(2)} L</div>
              <div><span className="font-medium">Rate:</span> {viewing.fuelRate.toFixed(2)}</div>
              <div><span className="font-medium">Total:</span> ₹{viewing.totalAmount.toFixed(2)}</div>
              <div className="flex justify-end pt-2"><Button size="sm" variant="outline" onClick={()=>setViewing(null)}>Close</Button></div>
            </div>
          )}
        </Modal>
        {/* Edit modal */}
        <Modal isOpen={!!editing} onClose={()=>setEditing(null)} title="Edit Fuel Entry">
          {editing && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Fuel Date</label>
                  <input type="datetime-local" title="Fuel Date" value={editing.fuelFillDate.slice(0,16)} onChange={e=>setEditing(ed=>ed?{...ed, fuelFillDate:e.target.value }:ed)} className="w-full border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Quantity (L)</label>
                  <input type="number" title="Quantity" placeholder="Litres" value={editing.fuelQuantity} onChange={e=>setEditing(ed=>ed?{...ed, fuelQuantity:parseFloat(e.target.value)||0 }:ed)} className="w-full border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Rate</label>
                  <input type="number" title="Rate" placeholder="Rate" value={editing.fuelRate} onChange={e=>setEditing(ed=>ed?{...ed, fuelRate:parseFloat(e.target.value)||0 }:ed)} className="w-full border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500" />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={()=>setEditing(null)}>Cancel</Button>
                <Button size="sm" onClick={handleSave}>Save</Button>
              </div>
            </div>
          )}
        </Modal>
        {/* Delete modal */}
        <Modal isOpen={!!confirmDelete} onClose={()=>setConfirmDelete(null)} title="Delete Fuel Entry">
          {confirmDelete && (
            <div className="space-y-4">
              <p className="text-sm text-gray-700">Are you sure you want to delete this fuel entry? This action cannot be undone.</p>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={()=>setConfirmDelete(null)}>Cancel</Button>
                <Button variant="danger" size="sm" onClick={()=>handleDelete(confirmDelete.id)}>Delete</Button>
              </div>
            </div>
          )}
        </Modal>
    </div>
  );
};

export default FuelManagement;
