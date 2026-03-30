import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import useLanguage from '@/lib/useLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Categories() {
  const { t } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name_en: '', name_fr: '', name_ar: '', description_en: '', description_fr: '', description_ar: '', icon: '', order: 0 });

  const load = async () => {
    try {
      const data = await base44.entities.Category.list('-order');
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
      toast.error(t('admin.categories.toastLoadError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ name_en: '', name_fr: '', name_ar: '', description_en: '', description_fr: '', description_ar: '', icon: '', order: 0 });
    setDialogOpen(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({
      name_en: cat.name_en || '',
      name_fr: cat.name_fr || '',
      name_ar: cat.name_ar || '',
      description_en: cat.description_en || '',
      description_fr: cat.description_fr || '',
      description_ar: cat.description_ar || '',
      icon: cat.icon || '',
      order: cat.order || 0,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await base44.entities.Category.update(editing.id, form);
        toast.success(t('admin.categories.toastUpdated'));
      } else {
        await base44.entities.Category.create(form);
        toast.success(t('admin.categories.toastCreated'));
      }
      setDialogOpen(false);
      await load();
    } catch (error) {
      console.error('Failed to save category:', error);
      toast.error(t('admin.categories.toastSaveError'));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(t('admin.confirmDelete'))) return;
    try {
      await base44.entities.Category.delete(id);
      toast.success(t('admin.categories.toastDeleted'));
      await load();
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast.error(t('admin.categories.toastDeleteError'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-inter font-bold text-foreground">{t('admin.categories')}</h1>
        </div>
        <Button onClick={openNew} className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl gap-2">
          <Plus className="h-4 w-4" />
          {t('admin.add')}
        </Button>
      </div>

      <div className="glass rounded-2xl border border-border/30 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-start px-6 py-3 text-xs font-medium text-muted-foreground uppercase">{t('admin.categories.name')}</th>
              <th className="text-start px-6 py-3 text-xs font-medium text-muted-foreground uppercase hidden md:table-cell">{t('admin.categories.description')}</th>
              <th className="text-start px-6 py-3 text-xs font-medium text-muted-foreground uppercase w-32">{t('admin.categories.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {loading ? (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-sm text-muted-foreground">{t('common.loading')}</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-sm text-muted-foreground">{t('admin.noData')}</td></tr>
            ) : categories.map(cat => (
              <tr key={cat.id} className="hover:bg-secondary/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-sm text-foreground">{cat.name_en}</div>
                  {cat.name_fr && <div className="text-xs text-muted-foreground">{cat.name_fr}</div>}
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <div className="text-sm text-muted-foreground truncate max-w-xs">{cat.description_en}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(cat)} className="h-8 w-8 text-muted-foreground hover:text-accent">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(cat.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? t('admin.edit') : t('admin.add')} {t('admin.categories.singular')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">{t('admin.categories.nameEn')}</label>
                <Input value={form.name_en} onChange={e => setForm({...form, name_en: e.target.value})} className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">{t('admin.categories.nameFr')}</label>
                <Input value={form.name_fr} onChange={e => setForm({...form, name_fr: e.target.value})} className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">{t('admin.categories.nameAr')}</label>
                <Input value={form.name_ar} onChange={e => setForm({...form, name_ar: e.target.value})} className="mt-1" dir="rtl" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">{t('admin.categories.descriptionEn')}</label>
              <Textarea value={form.description_en} onChange={e => setForm({...form, description_en: e.target.value})} className="mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">{t('admin.categories.descriptionFr')}</label>
              <Textarea value={form.description_fr} onChange={e => setForm({...form, description_fr: e.target.value})} className="mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">{t('admin.categories.descriptionAr')}</label>
              <Textarea value={form.description_ar} onChange={e => setForm({...form, description_ar: e.target.value})} className="mt-1" dir="rtl" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">{t('admin.categories.icon')}</label>
                <Input value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} className="mt-1" placeholder="e.g. Code" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">{t('admin.categories.order')}</label>
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