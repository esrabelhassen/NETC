import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AnimatedBackground from './AnimatedBackground';
import LeadPopup from './LeadPopup';

export default function PublicLayout({ t, lang, setLang, isRTL, supportedLanguages }) {
  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <Navbar
        t={t}
        lang={lang}
        setLang={setLang}
        isRTL={isRTL}
        supportedLanguages={supportedLanguages}
      />
      <main className="relative z-10">
        <Outlet />
      </main>
      <Footer t={t} />
      <LeadPopup t={t} />
    </div>
  );
}
