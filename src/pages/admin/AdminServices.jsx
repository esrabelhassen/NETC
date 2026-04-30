import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import useLanguage from '@/lib/useLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';

const emptyForm = {
  title_en: '', title_fr: '', title_ar: '',
  description_en: '', description_fr: '', description_ar: '',
  category_id: '', price: '', price_type: 'quote',
  price_currency: 'usd',
  service_type: 'development', status: 'active', order: 0,
};

const currencySymbols = {
  usd: '$',
  eur: '€',
  tnd: 'د.ت',
};

const getCurrencyCode = (currency) => (currency ? currency.toUpperCase() : 'USD');

const getPriceLabel = (svc) => {
  const currency = (svc.price_currency || 'USD').toLowerCase();
  const symbol = currencySymbols[currency] || '';

  if (svc.price_type === 'fixed') {
    const amount = svc.price ?? '';
    if (symbol) return `${symbol}${amount}`;
    return `${amount} ${getCurrencyCode(currency)}`.trim();
  }

  if (svc.price_type === 'free') return 'Free';

  return `Quote (${getCurrencyCode(currency)})`;
};

export default function AdminServices() {
  const { t } = useLanguage();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    const [s, c] = await Promise.all([
      base44.entities.Service.list('-order'),
      base44.entities.Category.list('-order'),
    ]);
    setServices(s);
    setCategories(c);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = services.filter(s =>
    (s.title_en || '').toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };

  const openEdit = (svc) => {
    setEditing(svc);
    setForm({
      title_en: svc.title_en || '', title_fr: svc.title_fr || '', title_ar: svc.title_ar || '',
      description_en: svc.description_en || '', description_fr: svc.description_fr || '', description_ar: svc.description_ar || '',
      category_id: svc.category_id || '', price: svc.price || '',
      price_type: svc.price_type || 'quote', price_currency: svc.price_currency || 'usd', service_type: svc.service_type || 'development',
      status: svc.status || 'active', order: svc.order || 0,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const data = { ...form, price: form.price ? parseFloat(form.price) : null };
    if (editing) {
      await base44.entities.Service.update(editing.id, data);
      toast.success('Service updated');
    } else {
      await base44.entities.Service.create(data);
      toast.success('Service created');
    }
    setDialogOpen(false);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm(t('admin.confirmDelete'))) return;
    await base44.entities.Service.delete(id);
    toast.success('Service deleted');
    load();
  };

  const statusColors = {
    active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    draft: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    archived: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-inter font-bold text-foreground">{t('admin.services')}</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('admin.search')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 w-64 rounded-xl"
            />
          </div>
          <Button onClick={openNew} className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl gap-2">
            <Plus className="h-4 w-4" />
            {t('admin.add')}
          </Button>
        </div>
      </div>

      <div className="glass rounded-2xl border border-border/30 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-start px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Title</th>
              <th className="text-start px-6 py-3 text-xs font-medium text-muted-foreground uppercase hidden md:table-cell">Type</th>
              <th className="text-start px-6 py-3 text-xs font-medium text-muted-foreground uppercase hidden md:table-cell">Price</th>
              <th className="text-start px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Status</th>
              <th className="text-start px-6 py-3 text-xs font-medium text-muted-foreground uppercase w-28">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-sm text-muted-foreground">{t('common.loading')}</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-sm text-muted-foreground">{t('admin.noData')}</td></tr>
            ) : filtered.map(svc => (
              <tr key={svc.id} className="hover:bg-secondary/30 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-foreground">{svc.title_en}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground hidden md:table-cell capitalize">{svc.service_type}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground hidden md:table-cell">
                  {getPriceLabel(svc)}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[svc.status] || ''}`}>
                    {svc.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(svc)} className="h-8 w-8 text-muted-foreground hover:text-accent">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(svc.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? t('admin.edit') : t('admin.add')} Service</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Title (EN)</label>
                <Input value={form.title_en} onChange={e => setForm({...form, title_en: e.target.value})} className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Title (FR)</label>
                <Input value={form.title_fr} onChange={e => setForm({...form, title_fr: e.target.value})} className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Title (AR)</label>
                <Input value={form.title_ar} onChange={e => setForm({...form, title_ar: e.target.value})} className="mt-1" dir="rtl" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Description (EN)</label>
              <Textarea value={form.description_en} onChange={e => setForm({...form, description_en: e.target.value})} className="mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Description (FR)</label>
              <Textarea value={form.description_fr} onChange={e => setForm({...form, description_fr: e.target.value})} className="mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Description (AR)</label>
              <Textarea value={form.description_ar} onChange={e => setForm({...form, description_ar: e.target.value})} className="mt-1" dir="rtl" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Category</label>
                <Select value={form.category_id} onValueChange={v => setForm({...form, category_id: v})}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name_en}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Price Type</label>
                <Select value={form.price_type} onValueChange={v => setForm({...form, price_type: v})}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed</SelectItem>
                    <SelectItem value="quote">Quote</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Price</label>
                <Input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Currency</label>
                <Select value={form.price_currency} onValueChange={v => setForm({...form, price_currency: v})}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD</SelectItem>
                    <SelectItem value="eur">EUR</SelectItem>
                    <SelectItem value="tnd">TND</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Service Type</label>
                <Select value={form.service_type} onValueChange={v => setForm({...form, service_type: v})}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">{t('common.dev')}</SelectItem>
                    <SelectItem value="non-development">{t('common.nonDev')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Status</label>
                <Select value={form.status} onValueChange={v => setForm({...form, status: v})}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{t('common.active')}</SelectItem>
                    <SelectItem value="draft">{t('common.draft')}</SelectItem>
                    <SelectItem value="archived">{t('common.archived')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Order</label>
                <Input type="number" value={form.order} onChange={e => setForm({...form, order: parseInt(e.target.value) || 0})} className="mt-1" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>{t('admin.cancel')}</Button>
              <Button onClick={handleSave} className="bg-accent hover:bg-accent/90 text-accent-foreground">{t('admin.save')}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
