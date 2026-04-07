import { Zap } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';

export function Header() {
  const { t } = useLanguage();

  return (
    <header className="topbar">
      <Link className="brand" to="/">
        <div className="brand__mark">
          <Zap size={18} fill="currentColor" />
        </div>
        <div>
          <strong>{t('brand')}</strong>
          <span>Premium handle market</span>
        </div>
      </Link>

      <nav className="topbar__nav">
        <NavLink to="/">{t('navStore')}</NavLink>
        <NavLink to="/admin">
          {t('navAdmin')}
        </NavLink>
      </nav>

      <LanguageToggle />
    </header>
  );
}
