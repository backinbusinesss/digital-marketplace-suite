import { useLanguage } from '../context/LanguageContext';

interface SidebarProps {
  search: string;
  setSearch: (value: string) => void;
  sort: string;
  setSort: (value: string) => void;
  platforms: string[];
  categories: string[];
  rarityLevels: string[];
  languages: string[];
  selectedPlatforms: string[];
  selectedCategories: string[];
  selectedRarity: string[];
  selectedLanguages: string[];
  togglePlatform: (value: string) => void;
  toggleCategory: (value: string) => void;
  toggleRarity: (value: string) => void;
  toggleLanguage: (value: string) => void;
  clearFilters: () => void;
}

function CheckboxItem({
  label,
  active,
  onClick
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button className={`check-item ${active ? 'active' : ''}`} onClick={onClick} type="button">
      <span className="check-item__dot" />
      {label}
    </button>
  );
}

export function FilterSidebar(props: SidebarProps) {
  const { t } = useLanguage();

  return (
    <aside className="sidebar-card">
      <div className="sidebar-card__title-row">
        <h3>{t('filtersTitle')}</h3>
        <button onClick={props.clearFilters} type="button">
          {t('clearFilters')}
        </button>
      </div>

      <div className="field-stack">
        <label>{t('searchPlaceholder')}</label>
        <input
          value={props.search}
          onChange={(event) => props.setSearch(event.target.value)}
          placeholder={t('searchPlaceholder')}
        />
      </div>

      <div className="field-stack">
        <label>{t('sortLabel')}</label>
        <select value={props.sort} onChange={(event) => props.setSort(event.target.value)}>
          <option value="featured">{t('featured')}</option>
          <option value="low">{t('lowest')}</option>
          <option value="high">{t('highest')}</option>
          <option value="newest">{t('newest')}</option>
        </select>
      </div>

      <div className="filter-group">
        <h4>{t('platform')}</h4>
        {props.platforms.map((platform) => (
          <CheckboxItem
            key={platform}
            label={platform}
            active={props.selectedPlatforms.includes(platform)}
            onClick={() => props.togglePlatform(platform)}
          />
        ))}
      </div>

      <div className="filter-group">
        <h4>{t('category')}</h4>
        {props.categories.map((category) => (
          <CheckboxItem
            key={category}
            label={category}
            active={props.selectedCategories.includes(category)}
            onClick={() => props.toggleCategory(category)}
          />
        ))}
      </div>

      <div className="filter-group">
        <h4>{t('rarity')}</h4>
        {props.rarityLevels.map((rarity) => (
          <CheckboxItem
            key={rarity}
            label={rarity}
            active={props.selectedRarity.includes(rarity)}
            onClick={() => props.toggleRarity(rarity)}
          />
        ))}
      </div>

      <div className="filter-group">
        <h4>{t('meaningLanguage')}</h4>
        {props.languages.map((language) => (
          <CheckboxItem
            key={language}
            label={language}
            active={props.selectedLanguages.includes(language)}
            onClick={() => props.toggleLanguage(language)}
          />
        ))}
      </div>
    </aside>
  );
}
