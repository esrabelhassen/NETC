import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';

export default function LeadPopup({ t }) {
  const [show, setShow] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', interest: '' });

  useEffect(() => {
    const dismissed = sessionStorage.getItem('netc-popup-dismissed');
    if (dismissed) return;

    const timer = setTimeout(() => setShow(true), 7000);

    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.5) {
        setShow(true);
        window.removeEventListener('scroll', handleScroll);
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClose = () => {
    setShow(false);
    sessionStorage.setItem('netc-popup-dismissed', 'true');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setLoading(true);
    await base44.entities.Lead.create({
      name: form.name,
      email: form.email,
      phone: form.phone,
      interest: form.interest,
      source: 'popup',
    });
    setLoading(false);
    setSubmitted(true);
    setTimeout(handleClose, 2000);
  };

  const interests = [
    { value: 'erp', label: t('popup.interests.erp') },
    { value: 'custom', label: t('popup.interests.custom') },
    { value: 'migration', label: t('popup.interests.migration') },
    { value: 'training', label: t('popup.interests.training') },
    { value: 'support', label: t('popup.interests.support') },
  ];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="glass bg-card border border-border/50 rounded-3xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✓</span>
                </div>
                <p className="text-foreground font-medium">{t('popup.success')}</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                    <span className="text-accent text-xl">⚡</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{t('popup.title')}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{t('popup.subtitle')}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <Input
                    placeholder={t('popup.name')}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="rounded-xl h-11 bg-secondary/50 border-border/50"
                    required
                  />
                  <Input
                    type="email"
                    placeholder={t('popup.email')}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="rounded-xl h-11 bg-secondary/50 border-border/50"
                    required
                  />
                  <Input
                    placeholder={t('popup.phone')}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="rounded-xl h-11 bg-secondary/50 border-border/50"
                  />
                  <Select
                    value={form.interest}
                    onValueChange={(v) => setForm({ ...form, interest: v })}
                  >
                    <SelectTrigger className="rounded-xl h-11 bg-secondary/50 border-border/50">
                      <SelectValue placeholder={t('popup.interest')} />
                    </SelectTrigger>
                    <SelectContent>
                      {interests.map((i) => (
                        <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl h-11 font-medium"
                  >
                    {loading ? '...' : t('popup.submit')}
                  </Button>
                </form>

                <button
                  onClick={handleClose}
                  className="w-full text-center text-xs text-muted-foreground mt-3 hover:text-foreground transition-colors"
                >
                  {t('popup.close')}
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}