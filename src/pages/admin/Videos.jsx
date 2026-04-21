import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { ArrowUp, ArrowDown, Plus, Trash2 } from 'lucide-react';

const YOUTUBE_REGEX = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/;

const getYouTubeId = (url = '') => {
  const match = url.match(YOUTUBE_REGEX);
  return match?.[1] ?? '';
};

const initialForm = {
  title: '',
  type: 'youtube',
  url: '',
  description: '',
  order: 0,
};

export default function Videos() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const queryClient = useQueryClient();

  const { data: videos = [] } = useQuery({
    queryKey: ['videos'],
    queryFn: () => base44.entities.videos.list('-order'),
  });

  const sortedVideos = useMemo(() => {
    return [...videos].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [videos]);

  const createMutation = useMutation({
    mutationFn: (payload) => base44.entities.videos.create(payload),
    onSuccess: () => {
      toast.success('Video added');
      setDialogOpen(false);
      setForm(initialForm);
      queryClient.invalidateQueries(['videos']);
    },
    onError: () => toast.error('Failed to add video'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.videos.delete(id),
    onSuccess: () => {
      toast.success('Video deleted');
      queryClient.invalidateQueries(['videos']);
    },
    onError: () => toast.error('Failed to delete video'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => base44.entities.videos.update(id, payload),
    onSuccess: () => {
      toast.success('Video updated');
      queryClient.invalidateQueries(['videos']);
    },
    onError: () => toast.error('Failed to update video'),
  });

  const previewUrl = form.url || '';
  const previewId = getYouTubeId(previewUrl);
  const hasPreview = Boolean(previewUrl);

  const handleSave = () => {
    const payload = {
      title: form.title,
      description: form.description,
      url: form.url,
      type: form.type,
      order: Number(form.order) || 0,
    };
    createMutation.mutate(payload);
  };

  const handleDelete = (id) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    deleteMutation.mutate(id);
  };

  const adjustOrder = (video, delta) => {
    updateMutation.mutate({ id: video.id, payload: { order: (video.order ?? 0) + delta } });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="glass rounded-2xl border border-border/30 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">Total Videos</p>
          <p className="text-3xl font-bold text-foreground">{videos.length}</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl gap-2">
          <Plus className="h-4 w-4" />
          Add Video
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Add Video</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Title</label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Type</label>
              <div className="mt-1 flex gap-3">
                {['youtube', 'direct'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setForm({ ...form, type })}
                    className={`flex-1 rounded-2xl border px-4 py-2 text-sm font-medium transition ${
                      form.type === type
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-border/50 text-muted-foreground'
                    }`}
                  >
                    {type === 'youtube' ? 'YouTube' : 'Direct URL'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">URL</label>
              <Input
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                className="mt-1"
              />
              {hasPreview && (
                <div className="mt-3 rounded-2xl border border-border/50 bg-black/60 p-1">
                  {previewId ? (
                    <iframe
                      className="h-36 w-full rounded-2xl"
                      title="preview"
                      src={`https://www.youtube.com/embed/${previewId}?rel=0&modestbranding=1`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      className="h-36 w-full rounded-2xl"
                      controls
                      src={previewUrl}
                    />
                  )}
                </div>
              )}
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Description</label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="mt-1"
                rows={3}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Order</label>
              <Input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                className="mt-1"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                {createMutation.isLoading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="glass rounded-3xl border border-border/30 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-start px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Title</th>
              <th className="text-start px-6 py-3 text-xs font-medium text-muted-foreground uppercase w-28">Type</th>
              <th className="text-start px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Description</th>
              <th className="text-center px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Order</th>
              <th className="text-center px-6 py-3 text-xs font-medium text-muted-foreground uppercase w-28">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {sortedVideos.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-muted-foreground">No videos found</td>
              </tr>
            ) : (
              sortedVideos.map((video) => {
                const url = video.url || video.video_url || video.link || '';
                const isYouTube = Boolean(getYouTubeId(url));

                return (
                  <tr key={video.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{video.title}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{isYouTube ? 'YouTube' : 'Direct'}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{video.description}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{video.order ?? 0}</span>
                        <button type="button" onClick={() => adjustOrder(video, -1)} className="text-muted-foreground hover:text-accent">
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => adjustOrder(video, 1)} className="text-muted-foreground hover:text-accent">
                          <ArrowDown className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(video.id)} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
