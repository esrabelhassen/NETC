import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import useLanguage from '@/lib/useLanguage';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Trash2 } from 'lucide-react';
import moment from 'moment';

export default function Leads() {
  const { t } = useLanguage();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const truncate = (value, length = 80) => {
    if (!value) return '—';
    return value.length > length ? `${value.slice(0, length)}…` : value;
  };

  useEffect(() => {
    base44.entities.Lead.list('-created_date').then(data => {
      setLeads(data);
      setLoading(false);
    });
  }, []);

  const updateStatus = async (id, status) => {
    await base44.entities.Lead.update(id, { status });
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  const filtered = leads.filter(l => {
    const matchSearch = (l.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (l.email || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusColors = {
    new: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    contacted: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    qualified: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    converted: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    lost: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  };

  const openLead = (lead) => {
    setSelectedLead(lead);
    setDialogOpen(true);
  };

  const closeLead = () => {
    setDialogOpen(false);
    setSelectedLead(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    setDeletingId(id);
    try {
      await base44.entities.Lead.delete(id);
      setLeads(prev => prev.filter(l => l.id !== id));
      if (selectedLead?.id === id) closeLead();
    } finally {
      setDeletingId(null);
    }
  };

  const detailFields = selectedLead ? [
    { label: 'Email', value: selectedLead.email },
    { label: 'Phone', value: selectedLead.phone },
    { label: 'Company', value: selectedLead.company },
    { label: 'Interest', value: selectedLead.interest },
    { label: 'Source', value: selectedLead.source },
    { label: 'Status', value: selectedLead.status },
    {
      label: 'Created',
      value: selectedLead.created_date ? moment(selectedLead.created_date).format('MMM D, YYYY • h:mm A') : null,
    },
    {
      label: 'Updated',
      value: selectedLead.updated_date ? moment(selectedLead.updated_date).format('MMM D, YYYY • h:mm A') : null,
    },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-inter font-bold text-foreground">{t('admin.leads')}</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t('admin.search')} value={search} onChange={e => setSearch(e.target.value)} className="pl-9 w-64 rounded-xl" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="glass rounded-2xl border border-border/30 overflow-x-auto">
        <table className="w-full">
          <thead>
              <tr className="border-b border-border/30">
                <th className="text-start px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Name</th>
                <th className="text-start px-6 py-3 text-xs font-medium text-muted-foreground uppercase hidden md:table-cell">Email</th>
                <th className="text-start px-6 py-3 text-xs font-medium text-muted-foreground uppercase hidden lg:table-cell">Phone</th>
                <th className="text-start px-6 py-3 text-xs font-medium text-muted-foreground uppercase hidden lg:table-cell">Interest</th>
                <th className="text-start px-6 py-3 text-xs font-medium text-muted-foreground uppercase hidden lg:table-cell">Source</th>
                <th className="text-start px-6 py-3 text-xs font-medium text-muted-foreground uppercase hidden lg:table-cell">Message</th>
                <th className="text-start px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="text-center px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Actions</th>
                <th className="text-start px-6 py-3 text-xs font-medium text-muted-foreground uppercase hidden md:table-cell">Date</th>
              </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {loading ? (
              <tr><td colSpan={9} className="px-6 py-8 text-center text-sm text-muted-foreground">{t('common.loading')}</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={9} className="px-6 py-8 text-center text-sm text-muted-foreground">{t('admin.noData')}</td></tr>
            ) : filtered.map(lead => (
              <tr key={lead.id} className="hover:bg-secondary/30 transition-colors cursor-pointer" onClick={() => openLead(lead)}>
                <td className="px-6 py-4 text-sm font-medium text-foreground">{lead.name}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground hidden md:table-cell">{lead.email}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground hidden lg:table-cell">{lead.phone || '—'}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground hidden lg:table-cell capitalize">{lead.interest || '—'}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground hidden lg:table-cell capitalize">{lead.source || '—'}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground hidden lg:table-cell" title={lead.message}>
                  {truncate(lead.message)}
                </td>
                <td className="px-6 py-4">
                  <Select value={lead.status} onValueChange={(v) => updateStatus(lead.id, v)}>
                    <SelectTrigger className="h-7 text-xs border-0 px-0 w-28" onClick={(e) => e.stopPropagation()}>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[lead.status] || ''}`}>
                        {lead.status}
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-6 py-4 text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(lead.id);
                    }}
                    className="text-muted-foreground hover:text-destructive"
                    disabled={deletingId === lead.id}
                    title="Delete lead"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
                <td className="px-6 py-4 text-xs text-muted-foreground hidden md:table-cell">
                  {moment(lead.created_date).format('MMM D, YYYY')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) closeLead(); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedLead?.name || 'Lead details'}</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <>
              <div className="space-y-4 mt-4 text-sm text-muted-foreground">
                <div className="grid grid-cols-2 gap-4">
                  {detailFields.map((field) => (
                    <div key={field.label}>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{field.label}</p>
                      <p className="text-sm text-foreground">{field.value || '—'}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-1">Message</p>
                  <p className="min-h-[72px] rounded-2xl border border-border/50 bg-secondary/5 p-3 text-sm text-foreground whitespace-pre-line">
                    {selectedLead.message || '—'}
                  </p>
                </div>
              </div>
              <DialogFooter className="mt-6 justify-end gap-2">
                <Button variant="outline" onClick={closeLead}>Close</Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(selectedLead.id)}
                  disabled={deletingId === selectedLead.id}
                >
                  {deletingId === selectedLead.id ? 'Deleting...' : 'Delete lead'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
