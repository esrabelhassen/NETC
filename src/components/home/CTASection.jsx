import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import SectionReveal from '../SectionReveal';

export default function CTASection({ t }) {
  return (
    <section className="py-32 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-navy dark:bg-card p-12 sm:p-16 lg:p-20">
            {/* Gradient orbs */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-orange/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-orange/10 rounded-full blur-[80px]" />

            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-inter font-bold text-white dark:text-foreground mb-6 leading-tight">
                {t('cta.title')}
              </h2>
              <p className="text-lg text-white/70 dark:text-muted-foreground mb-10">
                {t('cta.subtitle')}
              </p>
              <Link to="/contact">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-2xl px-10 h-14 text-base font-medium gap-2 shadow-lg shadow-accent/30"
                >
                  {t('cta.button')}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}