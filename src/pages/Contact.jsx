import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import useLanguage from '@/lib/useLanguage';
import SectionReveal from '@/components/SectionReveal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '', message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const urlParams = new URLSearchParams(window.location.search);
    const serviceInterest = urlParams.get('service') || '';

    await base44.entities.Lead.create({
      name: form.name,
      email: form.email,
      phone: form.phone,
      company: form.company,
      message: form.message,
      interest: serviceInterest || 'general',
      source: 'contact_form',
    });
    setLoading(false);
    setSent(true);
  };

  const contactInfo = [
    { icon: Mail, label: t('contact.emailLabel'), value: 'direction@netc.fr' },
    { icon: Phone, label: t('contact.phoneLabel'), value: '+216 20 784 272' },
    { icon: MapPin, label: t('contact.address'), value: t('Immeuble Yesmine, Rue Ali Bourguiba, 5000 Skanes Monastir') },
  ];

  return (
    <div className="pt-24 pb-20">
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="text-center mb-16">
              <h1 className="text-5xl sm:text-6xl font-inter font-bold text-foreground mb-6">
                {t('contact.title')}
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('contact.subtitle')}
              </p>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Form */}
            <SectionReveal className="lg:col-span-3">
              <div className="glass rounded-3xl p-8 sm:p-10 border border-border/30">
                {sent ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{t('contact.success')}</h3>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">{t('contact.name')}</label>
                        <Input
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="rounded-xl h-12 bg-secondary/50 border-border/50"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">{t('contact.email')}</label>
                        <Input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="rounded-xl h-12 bg-secondary/50 border-border/50"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">{t('contact.phone')}</label>
                        <Input
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="rounded-xl h-12 bg-secondary/50 border-border/50"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">{t('contact.company')}</label>
                        <Input
                          value={form.company}
                          onChange={(e) => setForm({ ...form, company: e.target.value })}
                          className="rounded-xl h-12 bg-secondary/50 border-border/50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">{t('contact.message')}</label>
                      <Textarea
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="rounded-xl bg-secondary/50 border-border/50 min-h-[140px]"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-2xl h-12 text-base font-medium gap-2"
                    >
                      {loading ? t('contact.sending') : t('contact.send')}
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                )}
              </div>
            </SectionReveal>

            {/* Contact Info */}
            <SectionReveal delay={0.2} className="lg:col-span-2">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground mb-6">{t('contact.info')}</h3>
                {contactInfo.map((info, i) => (
                  <div key={i} className="glass rounded-2xl p-5 border border-border/30 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <info.icon className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{info.label}</p>
                      <p className="text-sm text-muted-foreground">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
