import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderOpen, Briefcase, Users, ShoppingCart, FileText, LogOut, Moon, Sun, Globe, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import useLanguage from '@/lib/useLanguage';
import useTheme from '@/lib/useTheme';

const navItems = [
  { path: '/admin', icon: LayoutDashboard, labelKey: 'admin.dashboard', exact: true },
  { path: '/admin/categories', icon: FolderOpen, labelKey: 'admin.categories' },
  { path: '/admin/services', icon: Briefcase, labelKey: 'admin.services' },
  { path: '/admin/leads', icon: Users, labelKey: 'admin.leads' },
  { path: '/admin/orders', icon: ShoppingCart, labelKey: 'admin.orders' },
  { path: '/admin/content', icon: FileText, labelKey: 'admin.content' },
];

export default function AdminLayout() {
  const location = useLocation();
  const { t, lang, setLang, supportedLanguages } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-navy to-orange flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-lg font-inter font-bold text-foreground">NETC</span>
            <span className="text-xs text-muted-foreground font-medium px-2 py-0.5 rounded-full bg-secondary ms-auto">CMS</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive(item)
                  ? 'bg-accent/10 text-accent'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              }`}
            >
              <item.icon className="h-4.5 w-4.5" />
              {t(item.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-border/50 space-y-1">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
            <LogOut className="h-4 w-4" />
            {t('admin.backToSite')}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="h-16 border-b border-border/50 bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 lg:px-8">
          {/* Mobile nav */}
          <div className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  {t('admin.menu')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {navItems.map(item => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link to={item.path} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {t(item.labelKey)}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  <span className="text-xs">{lang.toUpperCase()}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {supportedLanguages.map(l => (
                  <DropdownMenuItem key={l.code} onClick={() => setLang(l.code)}>
                    {l.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9 text-muted-foreground">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}