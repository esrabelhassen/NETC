import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import useLanguage from '@/lib/useLanguage';
import SectionReveal from '@/components/SectionReveal';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code, Settings } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const currencySymbols = {
  usd: '$',
  eur: '€',
  tnd: 'د.ت',
};

const getCurrencyCode = (currency) => (currency ? currency.toUpperCase() : 'USD');

const getServicePriceLabel = (service) => {
  const currency = (service.price_currency || 'USD').toLowerCase();
  const symbol = currencySymbols[currency] || '';

  if (service.price_type === 'fixed') {
    const amount = service.price ?? '';
    if (symbol) return `${symbol}${amount}`;
    return `${amount} ${getCurrencyCode(currency)}`.trim();
  }

  if (service.price_type === 'free') return 'Free';

  return `Quote (${getCurrencyCode(currency)})`;
};

export default function Services() {
  const { t, tField, lang } = useLanguage();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    Promise.all([
      base44.entities.Service.filter({ status: 'active' }, '-order'),
      base44.entities.Category.list('-order'),
    ]).then(([s, c]) => {
      setServices(s);
      setCategories(c);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'all'
    ? services
    : services.filter(s => s.category_id === activeCategory);

  return (
    <div className="pt-24 pb-20">
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="text-center mb-16">
              <h1 className="text-5xl sm:text-6xl font-inter font-bold text-foreground mb-6">
                {t('services.title')}
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('services.subtitle')}
              </p>
            </div>
          </SectionReveal>

          {/* Category Filters */}
          {categories.length > 0 && (
            <SectionReveal>
              <div className="flex flex-wrap justify-center gap-2 mb-12">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-5 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                    activeCategory === 'all'
                      ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/20'
                      : 'glass text-muted-foreground hover:text-foreground border border-border/30'
                  }`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-5 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                      activeCategory === cat.id
                        ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/20'
                        : 'glass text-muted-foreground hover:text-foreground border border-border/30'
                    }`}
                  >
                    {tField(cat, 'name')}
                  </button>
                ))}
              </div>
            </SectionReveal>
          )}

          {/* Loading */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="glass rounded-3xl p-8 border border-border/30">
                  <Skeleton className="h-12 w-12 rounded-2xl mb-5" />
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          )}

          {/* Services Grid */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((service, i) => (
                <SectionReveal key={service.id} delay={i * 0.05}>
                  <GlassCard className="p-8 h-full group hover:border-accent/30">
                    <div className="flex items-start justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                        {service.service_type === 'development'
                          ? <Code className="h-6 w-6 text-accent" />
                          : <Settings className="h-6 w-6 text-accent" />
                        }
                      </div>
                      {service.price_type === 'fixed' && service.price && (
                        <span className="text-sm font-semibold text-accent">
                          {getServicePriceLabel(service)}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                      {tField(service, 'title')}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                      {tField(service, 'description')}
                    </p>
                    <Link to={`/contact?service=${encodeURIComponent(service.title_en || '')}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl gap-2 border-border/50 hover:border-accent/50 hover:text-accent"
                      >
                        {service.price_type === 'fixed' ? t('services.buyNow') : t('services.requestQuote')}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </GlassCard>
                </SectionReveal>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">{t('admin.noData')}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
