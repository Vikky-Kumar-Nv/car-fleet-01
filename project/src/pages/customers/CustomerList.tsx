import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Icon } from '../../components/ui/Icon';
import { Select } from '../../components/ui/Select';
import toast from 'react-hot-toast';

export const CustomerList: React.FC = () => {
  const { customers, customersLoading, deleteCustomer, updateCustomer, companies } = useApp();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all'|'random'|'company'>('all');
  const [sortCompanyAsc, setSortCompanyAsc] = useState(true);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [bulkCompanyId, setBulkCompanyId] = useState('');

  const companyNameMap = useMemo(()=> Object.fromEntries(companies.map(c=>[c.id, c.name])), [companies]);

  const toggleAll = (checked: boolean) => {
    if(!checked){ setSelected({}); return; }
    const map: Record<string, boolean> = {};
    filtered.forEach(c=> map[c.id]=true);
    setSelected(map);
  };

  const filtered = useMemo(()=>{
    let arr = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search));
    if(filterType==='random') arr = arr.filter(c=> !c.companyId);
    if(filterType==='company') arr = arr.filter(c=> !!c.companyId);
    if(sortCompanyAsc){
      arr = [...arr].sort((a,b)=> (companyNameMap[a.companyId||'']||'').localeCompare(companyNameMap[b.companyId||'']||''));
    } else {
      arr = [...arr].sort((a,b)=> (companyNameMap[b.companyId||'']||'').localeCompare(companyNameMap[a.companyId||'']||''));
    }
    return arr;
  },[customers, search, filterType, sortCompanyAsc, companyNameMap]);

  const selectedIds = Object.keys(selected).filter(id=>selected[id]);

  async function handleBulkAssign(){
    if(selectedIds.length===0){ toast.error('Select customers'); return; }
    try {
      await Promise.all(selectedIds.map(id=> updateCustomer(id, { companyId: bulkCompanyId || undefined })));
      toast.success(bulkCompanyId ? 'Assigned company' : 'Cleared company');
      setSelected({});
      setBulkCompanyId('');
    } catch(e){ console.error(e); toast.error('Bulk update failed'); }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <Button onClick={() => window.location.href = '/customers/create'}>
          <Icon name="plus" className="h-4 w-4 mr-2" /> New Customer
        </Button>
      </div>
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex space-x-2">
          {(['all','random','company'] as const).map(t=> {
            const active = filterType===t;
            return (
              <Button key={t} variant={active?undefined:'outline'} size="sm" onClick={()=>setFilterType(t)}>
                {t==='all'?'All': t==='random'?'Random':'Company'}
              </Button>
            );
          })}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">Sort by Company</span>
          <Button size="sm" variant="outline" onClick={()=>setSortCompanyAsc(a=>!a)}>{sortCompanyAsc?'A→Z':'Z→A'}</Button>
        </div>
        {selectedIds.length>0 && (
          <div className="flex items-center space-x-2 bg-amber-50 border border-amber-200 rounded px-3 py-2">
            <span className="text-xs font-medium text-amber-800">Bulk Assign ({selectedIds.length})</span>
            <Select label="" value={bulkCompanyId} onChange={e=> setBulkCompanyId(e.target.value)} options={[{ value:'', label:'-- None (Random)'}, ...companies.map(c=>({ value:c.id, label:c.name }))]} />
            <Button size="sm" onClick={handleBulkAssign}>Apply</Button>
          </div>
        )}
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
                  <th className="px-3 py-2"><input type="checkbox" aria-label="Select all" checked={filtered.length>0 && selectedIds.length===filtered.length} onChange={e=>toggleAll(e.target.checked)} /></th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-3 py-2  text-xs font-medium text-gray-500 uppercase tracking-wider" >Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-sm">
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td className="px-3 py-2"><input type="checkbox" aria-label={`Select ${c.name}`} checked={!!selected[c.id]} onChange={e=> setSelected(prev=> ({ ...prev, [c.id]: e.target.checked }))} /></td>
                    <td className="px-3 py-2 whitespace-nowrap font-medium text-gray-900">{c.name}</td>
                    <td className="px-3 py-2">{c.phone}</td>
                    <td className="px-3 py-2">{c.companyId ? 'Company' : 'Random'}</td>
                    <td className="px-3 py-2">{c.companyId ? (
                      <a href={`/companies/${c.companyId}`} className="text-amber-600 hover:underline" title="View company">{companyNameMap[c.companyId] || c.companyId}</a>
                    ) : '-'}</td>
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
                    <td colSpan={8} className="px-3 py-6 text-center text-gray-500">No customers found</td>
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
