import useLanguage from '@/lib/useLanguage';
import SectionReveal from '@/components/SectionReveal';
import { Target, Eye, Lightbulb, Shield, Trophy } from 'lucide-react';

const stats = [
  { key: 'about.stats.clients', value: '200+' },
  { key: 'about.stats.projects', value: '500+' },
  { key: 'about.stats.countries', value: '30+' },
  { key: 'about.stats.uptime', value: '99.9%' },
];

export default function About() {
  const { t } = useLanguage();

  const values = [
    { icon: Lightbulb, title: t('about.value1'), desc: t('about.value1Desc') },
    { icon: Shield, title: t('about.value2'), desc: t('about.value2Desc') },
    { icon: Trophy, title: t('about.value3'), desc: t('about.value3Desc') },
  ];

  return (
    <div className="pt-24 pb-20">
      {/* Hero */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionReveal>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-inter font-bold text-foreground mb-6">
              {t('about.title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('about.subtitle')}
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="glass rounded-3xl p-8 text-center border border-border/30">
                  <div className="text-4xl font-inter font-bold text-accent mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{t(stat.key)}</div>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SectionReveal>
              <div className="bg-navy dark:bg-card rounded-3xl p-10">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                  <Target className="h-6 w-6 text-orange" />
                </div>
                <h3 className="text-2xl font-bold text-white dark:text-foreground mb-4">{t('about.mission')}</h3>
                <p className="text-white/70 dark:text-muted-foreground leading-relaxed">
                  {t('about.missionText')}
                </p>
              </div>
            </SectionReveal>
            <SectionReveal delay={0.1}>
              <div className="glass rounded-3xl p-10 border border-border/30">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                  <Eye className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">{t('about.vision')}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('about.visionText')}
                </p>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <h2 className="text-4xl font-inter font-bold text-foreground text-center mb-16">{t('about.values')}</h2>
          </SectionReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((val, i) => (
              <SectionReveal key={i} delay={i * 0.1}>
                <div className="glass rounded-3xl p-8 text-center border border-border/30 hover:border-accent/30 transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-5">
                    <val.icon className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{val.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{val.desc}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}