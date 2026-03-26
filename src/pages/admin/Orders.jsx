import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import useLanguage from '@/lib/useLanguage';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import moment from 'moment';

export default function Orders() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    base44.entities.Order.list('-created_date').then(data => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  const updateStatus = async (id, status) => {
    await base44.entities.Order.update(id, { status });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const filtered = orders.filter(o =>
    (o.customer_email || '').toLowerCase().includes(search.toLowerCase()) ||
    (o.service_title || '').toLowerCase().includes(search.toLowerCase())
  );

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    cancelled: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-inter font-bold text-foreground">{t('admin.orders')}</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder={t('admin.search')} value={search} onChange={e => setSearch(e.target.value)} className="pl-9 w-64 rounded-xl" />
        </div>
      </div>

      <div className="glass rounded-2xl border border-border/30 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-start px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Service</th>
              <th className="text-start px-6 py-3 text-xs font-medium text-muted-foreground uppercase hidden md:table-cell">Customer</th>
              <th className="text-start px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Amount</th>
              <th className="text-start px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Status</th>
              <th className="text-start px-6 py-3 text-xs font-medium text-muted-foreground uppercase hidden md:table-cell">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-sm text-muted-foreground">{t('common.loading')}</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-sm text-muted-foreground">{t('admin.noData')}</td></tr>
            ) : filtered.map(order => (
              <tr key={order.id} className="hover:bg-secondary/30 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-foreground">{order.service_title || '—'}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground hidden md:table-cell">{order.customer_email}</td>
                <td className="px-6 py-4 text-sm font-medium text-foreground">${order.amount || 0}</td>
                <td className="px-6 py-4">
                  <Select value={order.status} onValueChange={(v) => updateStatus(order.id, v)}>
                    <SelectTrigger className="h-7 text-xs border-0 px-0 w-28">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[order.status] || ''}`}>
                        {order.status}
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-6 py-4 text-xs text-muted-foreground hidden md:table-cell">
                  {moment(order.created_date).format('MMM D, YYYY')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}