import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';

export default function HeroSection({ t }) {
  const titleWords = [t('hero.title1'), t('hero.title2'), t('hero.title3')];

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-border/50 text-sm text-muted-foreground mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          Odoo ERP Integration Experts
        </motion.div>

        {/* Title */}
        <div className="mb-6">
          {titleWords.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={`block text-5xl sm:text-6xl lg:text-8xl font-inter font-bold tracking-tight leading-[1.05] ${
                i === 1 ? 'text-accent' : 'text-foreground'
              }`}
            >
              {word}
            </motion.span>
          ))}
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/contact">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-2xl px-8 h-14 text-base font-medium gap-2 shadow-lg shadow-accent/20"
            >
              {t('hero.cta1')}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/contact">
            <Button
              size="lg"
              variant="outline"
              className="rounded-2xl px-8 h-14 text-base font-medium gap-2 border-border/50 hover:bg-secondary"
            >
              <Play className="h-4 w-4" />
              {t('hero.cta2')}
            </Button>
          </Link>
        </motion.div>

        {/* Floating Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 relative"
        >
          <div className="glass rounded-3xl p-1.5 shadow-2xl shadow-navy/10 dark:shadow-black/30 max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-secondary rounded-lg px-4 py-1.5 text-xs text-muted-foreground text-center">
                    erp.netc.com/dashboard
                  </div>
                </div>
              </div>
              {/* Dashboard content */}
              <div className="p-6 grid grid-cols-3 gap-4 h-64">
                <div className="col-span-2 space-y-3">
                  <div className="h-6 bg-secondary/60 rounded-lg w-1/3" />
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="bg-secondary/40 rounded-xl p-3 space-y-2">
                        <div className="h-3 bg-secondary rounded w-2/3" />
                        <div className="h-6 bg-accent/20 rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                  <div className="bg-secondary/30 rounded-xl flex-1 h-28" />
                </div>
                <div className="space-y-3">
                  <div className="bg-secondary/40 rounded-xl p-3 h-full space-y-2">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-accent/10" />
                        <div className="h-3 bg-secondary rounded flex-1" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Glow */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-2/3 h-20 bg-accent/20 blur-[60px] rounded-full" />
        </motion.div>
      </div>
    </section>
  );
}