import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import VideoCard from './VideoCard';

export default function HeroSection({ t, videos = [] }) {
  const titleWords = [t('hero.title1'), t('hero.title2'), t('hero.title3')];

  return (
    <section className="relative min-h-screen py-32 flex items-center justify-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-start text-left space-y-6">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-border/50 text-sm text-muted-foreground mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              {t('hero.badge')}
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
                    i === 1 ? 'text-accent' : 'text-white'
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
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed"
            >
              {t('hero.subtitle')}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="flex flex-col sm:flex-row items-start gap-4"
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
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-lg">
            <VideoCard videos={videos} t={t} />
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
