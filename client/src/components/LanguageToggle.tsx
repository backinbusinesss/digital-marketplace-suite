import { useLanguage } from '../context/LanguageContext';

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="language-toggle">
      <span>{t('languageToggle')}</span>
      <div className="language-toggle__buttons">
        <button
          className={language === 'en' ? 'active' : ''}
          onClick={() => setLanguage('en')}
          type="button"
        >
          EN
        </button>
        <button
          className={language === 'it' ? 'active' : ''}
          onClick={() => setLanguage('it')}
          type="button"
        >
          IT
        </button>
      </div>
    </div>
  );
}
