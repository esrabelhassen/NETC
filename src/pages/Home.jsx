import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import useLanguage from '@/lib/useLanguage';
import HeroSection from '@/components/home/HeroSection';
import ServicesPreview from '@/components/home/ServicesPreview';
import WhySection from '@/components/home/WhySection';
import CTASection from '@/components/home/CTASection';
import { useLang } from '@/lib/LanguageContext';

export default function Home() {
  const { t, tField } = useLang();
  const [services, setServices] = useState([]);
  const { data: videos = [] } = useQuery({
    queryKey: ['videos'],
    queryFn: () => base44.entities.videos.list('-created_date'),
  });

  useEffect(() => {
    base44.entities.Service.filter({ status: 'active' }, '-order', 6)
      .then(setServices)
      .catch(() => {});
  }, []);

  return (
    <div>
      <HeroSection t={t} videos={videos} />
      <ServicesPreview t={t} tField={tField} services={services} />
      <WhySection t={t} />
      <CTASection t={t} />
    </div>
  );
}
