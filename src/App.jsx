import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import useLanguage from '@/lib/useLanguage';
import useTheme from '@/lib/useTheme';
import PublicLayout from './components/PublicLayout';
import AdminLayout from './components/admin/AdminLayout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import AdminDashboard from './pages/admin/Dashboard';
import AdminCategories from './pages/admin/Categories';
import AdminServices from './pages/admin/AdminServices';
import AdminLeads from './pages/admin/Leads';
import AdminOrders from './pages/admin/Orders';
import AdminContent from './pages/admin/Content';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const langHook = useLanguage();
  const themeHook = useTheme();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy to-orange flex items-center justify-center">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <div className="w-8 h-8 border-4 border-muted border-t-accent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route element={
        <PublicLayout
          t={langHook.t}
          lang={langHook.lang}
          setLang={langHook.setLang}
          isRTL={langHook.isRTL}
          supportedLanguages={langHook.supportedLanguages}
          theme={themeHook.theme}
          toggleTheme={themeHook.toggleTheme}
        />
      }>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/services" element={<AdminServices />} />
        <Route path="/admin/leads" element={<AdminLeads />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/content" element={<AdminContent />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App