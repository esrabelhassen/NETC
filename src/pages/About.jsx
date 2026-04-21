import { useEffect, useRef, useState } from 'react';
import useLanguage from '@/lib/useLanguage';
import SectionReveal from '@/components/SectionReveal';
import { Target, Eye, Lightbulb, Shield, Trophy } from 'lucide-react';

const stats = [
  { emoji: '☕', value: 2847, labelKey: 'about.stats.coffees', suffix: '+' },
  { emoji: '🌙', value: 438, labelKey: 'about.stats.brainstorms', suffix: '' },
  { emoji: '💡', value: 12, labelKey: 'about.stats.ideas', suffix: '' },
  { emoji: '🔥', value: 91, labelKey: 'about.stats.problems', suffix: '+' },
];

export default function About() {
  const { t } = useLanguage();
  const statsRef = useRef(null);
  const [displayValues, setDisplayValues] = useState(() => stats.map(() => 0));
  const hasAnimatedRef = useRef(false);
  const timerIdsRef = useRef([]);

  const values = [
    { icon: Lightbulb, title: t('about.value1'), desc: t('about.value1Desc') },
    { icon: Shield, title: t('about.value2'), desc: t('about.value2Desc') },
    { icon: Trophy, title: t('about.value3'), desc: t('about.value3Desc') },
  ];

  useEffect(() => {
    if (!statsRef.current) return undefined;
    const startAnimation = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;
      const duration = 2000;
      const steps = 80;
      stats.forEach((stat, index) => {
        for (let step = 1; step <= steps; step += 1) {
          const timer = setTimeout(() => {
            setDisplayValues((prev) => {
              const next = [...prev];
              const nextValue = Math.min(
                stat.value,
                Math.round((stat.value * step) / steps),
              );
              next[index] = nextValue;
              return next;
            });
          }, (step * duration) / steps);
          timerIdsRef.current.push(timer);
        }
        const finalTimer = setTimeout(() => {
          setDisplayValues((prev) => {
            const next = [...prev];
            next[index] = stat.value;
            return next;
          });
        }, duration + 20);
        timerIdsRef.current.push(finalTimer);
      });
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        startAnimation();
        observer.disconnect();
      }
    }, { threshold: 0.3 });

    const rect = statsRef.current.getBoundingClientRect();
    if (rect.top <= window.innerHeight) {
      startAnimation();
      observer.disconnect();
    } else {
      observer.observe(statsRef.current);
    }

    return () => {
      observer.disconnect();
      timerIdsRef.current.forEach(clearTimeout);
    };
  }, []);

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
            <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="glass rounded-3xl p-8 text-center border border-border/30">
                  <div className="text-4xl mb-2">{stat.emoji}</div>
                  <div className="text-5xl font-bold text-orange-400 flex items-baseline justify-center gap-1">
                    <span>{(displayValues[i] || 0).toLocaleString()}</span>
                    <span className="text-4xl font-bold text-orange-400">{stat.suffix}</span>
                  </div>
                  <div className="text-base text-white/60 mt-2">{t(stat.labelKey)}</div>
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
