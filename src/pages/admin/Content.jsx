import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import useLanguage from '@/lib/useLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Content() {
  const { t } = useLanguage();
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ section: '', content_en: '', content_fr: '', content_ar: '', metadata: '' });

  const load = async () => {
    const data = await base44.entities.SiteContent.list();
    setContents(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ section: '', content_en: '', content_fr: '', content_ar: '', metadata: '' });
    setDialogOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      section: item.section || '',
      content_en: item.content_en || '',
      content_fr: item.content_fr || '',
      content_ar: item.content_ar || '',
      metadata: item.metadata || '',
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (editing) {
      await base44.entities.SiteContent.update(editing.id, form);
      toast.success('Content updated');
    } else {
      await base44.entities.SiteContent.create(form);
      toast.success('Content created');
    }
    setDialogOpen(false);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm(t('admin.confirmDelete'))) return;
    await base44.entities.SiteContent.delete(id);
    toast.success('Content deleted');
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-inter font-bold text-foreground">{t('admin.content')}</h1>
        <Button onClick={openNew} className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl gap-2">
          <Plus className="h-4 w-4" />
          {t('admin.add')}
        </Button>
      </div>

      <div className="glass rounded-2xl border border-border/30 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-start px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Section</th>
              <th className="text-start px-6 py-3 text-xs font-medium text-muted-foreground uppercase hidden md:table-cell">Content (EN)</th>
              <th className="text-start px-6 py-3 text-xs font-medium text-muted-foreground uppercase w-28">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {loading ? (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-sm text-muted-foreground">{t('common.loading')}</td></tr>
            ) : contents.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-sm text-muted-foreground">{t('admin.noData')}</td></tr>
            ) : contents.map(item => (
              <tr key={item.id} className="hover:bg-secondary/30 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-foreground">{item.section}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground truncate max-w-md hidden md:table-cell">{item.content_en}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(item)} className="h-8 w-8 text-muted-foreground hover:text-accent">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
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
            <DialogTitle>{editing ? t('admin.edit') : t('admin.add')} Content</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Section Key</label>
              <Input value={form.section} onChange={e => setForm({...form, section: e.target.value})} className="mt-1" placeholder="e.g. hero_title" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Content (EN)</label>
              <Textarea value={form.content_en} onChange={e => setForm({...form, content_en: e.target.value})} className="mt-1" rows={4} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Content (FR)</label>
              <Textarea value={form.content_fr} onChange={e => setForm({...form, content_fr: e.target.value})} className="mt-1" rows={4} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Content (AR)</label>
              <Textarea value={form.content_ar} onChange={e => setForm({...form, content_ar: e.target.value})} className="mt-1" rows={4} dir="rtl" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Metadata (JSON)</label>
              <Textarea value={form.metadata} onChange={e => setForm({...form, metadata: e.target.value})} className="mt-1" rows={2} placeholder='{"key": "value"}' />
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