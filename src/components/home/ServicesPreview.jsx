import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code, Settings, Database, Headphones, BarChart3, Layers } from 'lucide-react';
import SectionReveal from '../SectionReveal';
import GlassCard from '../GlassCard';

export default function ServicesPreview({ t, tField, services }) {
  const displayServices = services?.length > 0 ? services : null;

  const defaultServices = [
    { icon: Code, color: 'text-blue-500', bg: 'bg-blue-500/10', titleKey: 'services.default.title1', descKey: 'services.default.desc1' },
    { icon: Settings, color: 'text-accent', bg: 'bg-accent/10', titleKey: 'services.default.title2', descKey: 'services.default.desc2' },
    { icon: Database, color: 'text-emerald-500', bg: 'bg-emerald-500/10', titleKey: 'services.default.title3', descKey: 'services.default.desc3' },
    { icon: Headphones, color: 'text-purple-500', bg: 'bg-purple-500/10', titleKey: 'services.default.title4', descKey: 'services.default.desc4' },
    { icon: BarChart3, color: 'text-amber-500', bg: 'bg-amber-500/10', titleKey: 'services.default.title5', descKey: 'services.default.desc5' },
    { icon: Layers, color: 'text-pink-500', bg: 'bg-pink-500/10', titleKey: 'services.default.title6', descKey: 'services.default.desc6' },
  ];

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
          {displayServices
            ? displayServices.map((service, i) => (
                <SectionReveal key={i} delay={i * 0.1}>
                  <GlassCard className="p-8 h-full group hover:border-accent/30 transition-all duration-300">
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-5">
                      <Code className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                      {tField ? tField(service, 'title') : service.title_en}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tField ? tField(service, 'description') : service.description_en}
                    </p>
                  </GlassCard>
                </SectionReveal>
              ))
            : defaultServices.map((service, i) => (
                <SectionReveal key={i} delay={i * 0.1}>
                  <GlassCard className="p-8 h-full group hover:border-accent/30 transition-all duration-300">
                    <div className={`w-12 h-12 rounded-2xl ${service.bg} flex items-center justify-center mb-5`}>
                      <service.icon className={`h-6 w-6 ${service.color}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                      {t(service.titleKey)}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(service.descKey)}
                    </p>
                  </GlassCard>
                </SectionReveal>
              ))}
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