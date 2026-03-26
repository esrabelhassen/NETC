import { Award, Puzzle, Clock, Scaling } from 'lucide-react';
import SectionReveal from '../SectionReveal';

export default function WhySection({ t }) {
  const reasons = [
    { icon: Award, title: t('why.expertise'), desc: t('why.expertiseDesc'), accent: true },
    { icon: Puzzle, title: t('why.custom'), desc: t('why.customDesc') },
    { icon: Clock, title: t('why.support'), desc: t('why.supportDesc') },
    { icon: Scaling, title: t('why.scale'), desc: t('why.scaleDesc'), accent: true },
  ];

  return (
    <section className="py-32 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-inter font-bold text-foreground mb-4">
              {t('why.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('why.subtitle')}
            </p>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reasons.map((reason, i) => (
            <SectionReveal key={i} delay={i * 0.1}>
              <div
                className={`rounded-3xl p-8 transition-all duration-300 group ${
                  reason.accent
                    ? 'bg-navy text-white dark:bg-accent/10 dark:text-foreground'
                    : 'glass border border-border/30'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${
                  reason.accent
                    ? 'bg-white/10'
                    : 'bg-accent/10'
                }`}>
                  <reason.icon className={`h-6 w-6 ${
                    reason.accent ? 'text-orange' : 'text-accent'
                  }`} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{reason.title}</h3>
                <p className={`text-sm leading-relaxed ${
                  reason.accent ? 'text-white/70 dark:text-muted-foreground' : 'text-muted-foreground'
                }`}>
                  {reason.desc}
                </p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}