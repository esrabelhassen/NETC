import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import useLanguage from '@/lib/useLanguage';
import HeroSection from '@/components/home/HeroSection';
import ServicesPreview from '@/components/home/ServicesPreview';
import WhySection from '@/components/home/WhySection';
import CTASection from '@/components/home/CTASection';

export default function Home() {
  const { t, tField } = useLanguage();
  const [services, setServices] = useState([]);

  useEffect(() => {
    base44.entities.Service.filter({ status: 'active' }, '-order', 6)
      .then(setServices)
      .catch(() => {});
  }, []);

  return (
    <div>
      <HeroSection t={t} />
      <ServicesPreview t={t} tField={tField} services={services} />
      <WhySection t={t} />
      <CTASection t={t} />
    </div>
  );
}