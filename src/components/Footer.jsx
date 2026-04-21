import { Link } from 'react-router-dom';

export default function Footer({ t }) {
  return (
    <footer className="relative z-10 border-t border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-navy to-orange flex items-center justify-center">
                <img
                  src="/netclogo.png"
                  alt="NETC logo"
                  className="w-12 h-12 object-contain"
                />
              </div>
              <span className="text-xl font-inter font-bold text-foreground">NETC</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2.5">
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-accent transition-colors">{t('nav.home')}</Link></li>
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-accent transition-colors">{t('nav.about')}</Link></li>
              <li><Link to="/services" className="text-sm text-muted-foreground hover:text-accent transition-colors">{t('nav.services')}</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">{t('footer.services')}</h4>
            <ul className="space-y-2.5">
              <li><span className="text-sm text-muted-foreground">{t('footer.services.erp')}</span></li>
              <li><span className="text-sm text-muted-foreground">{t('footer.services.custom')}</span></li>
              <li><span className="text-sm text-muted-foreground">{t('footer.services.migration')}</span></li>
              <li><span className="text-sm text-muted-foreground">{t('footer.services.training')}</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">{t('footer.connect')}</h4>
            <ul className="space-y-2.5">
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-accent transition-colors">{t('nav.contact')}</Link></li>
              <li><span className="text-sm text-muted-foreground">{t('footer.contact.email')}</span></li>
              <li><span className="text-sm text-muted-foreground">{t('footer.contact.phone')}</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">{t('footer.rights')}</p>
          <div className="flex gap-6">
            <span className="text-xs text-muted-foreground hover:text-accent cursor-pointer transition-colors">{t('footer.privacy')}</span>
            <span className="text-xs text-muted-foreground hover:text-accent cursor-pointer transition-colors">{t('footer.terms')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
