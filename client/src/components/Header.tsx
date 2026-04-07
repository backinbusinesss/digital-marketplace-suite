import { Shield, Sparkles } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';

export function Header() {
  const { t } = useLanguage();

  return (
    <header className="topbar">
      <Link className="brand" to="/">
        <div className="brand__mark">
          <Sparkles size={18} />
        </div>
        <div>
          <strong>{t('brand')}</strong>
          <span>Secure digital storefront</span>
        </div>
      </Link>

      <nav className="topbar__nav">
        <NavLink to="/">{t('navStore')}</NavLink>
        <NavLink to="/admin">
          <Shield size={16} />
          {t('navAdmin')}
        </NavLink>
      </nav>

      <LanguageToggle />
    </header>
  );
}
