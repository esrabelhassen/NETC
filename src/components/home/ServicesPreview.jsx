import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code, Settings, Database, Headphones, BarChart3, Layers } from 'lucide-react';
import SectionReveal from '../SectionReveal';
import GlassCard from '../GlassCard';

const defaultServices = [
  { icon: Code, color: 'text-blue-500', bg: 'bg-blue-500/10', title: 'Custom Module Development', desc: 'Tailor-made Odoo modules designed for your unique business processes.' },
  { icon: Settings, color: 'text-accent', bg: 'bg-accent/10', title: 'ERP Implementation', desc: 'End-to-end Odoo ERP deployment with seamless migration.' },
  { icon: Database, color: 'text-emerald-500', bg: 'bg-emerald-500/10', title: 'Data Migration', desc: 'Secure and accurate data transfer from legacy systems to Odoo.' },
  { icon: Headphones, color: 'text-purple-500', bg: 'bg-purple-500/10', title: 'Support & Maintenance', desc: '24/7 technical support to keep your ERP running smoothly.' },
  { icon: BarChart3, color: 'text-amber-500', bg: 'bg-amber-500/10', title: 'Business Intelligence', desc: 'Advanced reporting and analytics dashboards for data-driven decisions.' },
  { icon: Layers, color: 'text-pink-500', bg: 'bg-pink-500/10', title: 'Integration Services', desc: 'Connect Odoo with third-party apps and APIs seamlessly.' },
];

export default function ServicesPreview({ t, services }) {
  const displayServices = services?.length > 0 ? services : null;

  return (
    <section className="py-32 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-inter font-bold text-foreground mb-4">
              {t('services.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('services.subtitle')}
            </p>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(displayServices || defaultServices).map((service, i) => {
            const Icon = displayServices ? Code : service.icon;
            const title = displayServices ? service.title_en : service.title;
            const desc = displayServices ? service.description_en : service.desc;

            return (
              <SectionReveal key={i} delay={i * 0.1}>
                <GlassCard className="p-8 h-full group hover:border-accent/30 transition-all duration-300">
                  <div className={`w-12 h-12 rounded-2xl ${displayServices ? 'bg-accent/10' : service.bg} flex items-center justify-center mb-5`}>
                    <Icon className={`h-6 w-6 ${displayServices ? 'text-accent' : service.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {desc}
                  </p>
                </GlassCard>
              </SectionReveal>
            );
          })}
        </div>

        <SectionReveal delay={0.4}>
          <div className="text-center mt-12">
            <Link to="/services">
              <Button variant="outline" className="rounded-2xl px-6 gap-2 border-border/50 hover:border-accent/50 hover:text-accent">
                {t('services.viewAll')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}