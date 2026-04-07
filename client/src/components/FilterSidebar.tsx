import { useLanguage } from '../context/LanguageContext';

const PLATFORM_ICON: Record<string, string> = {
  Instagram: '📸',
  TikTok: '🎵',
  Snapchat: '👻',
  Discord: '💬',
  GitHub: '⚡',
  Roblox: '🎮',
};

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

const RARITY_DOT: Record<string, string> = {
  Legendary: '#ffe066',
  Epic: '#c084fc',
  Rare: '#60a5fa',
  Common: '#94a3b8',
};

function CheckboxItem({
  label,
  active,
  onClick,
  dot
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  dot?: string;
}) {
  return (
    <button className={`check-item ${active ? 'active' : ''}`} onClick={onClick} type="button">
      <span
        className="check-item__dot"
        style={dot ? { background: dot, borderColor: dot } : undefined}
      />
      {label}
    </button>
  );
}

export function FilterSidebar(props: SidebarProps) {
  const { t } = useLanguage();
  const hasActiveFilters =
    props.selectedPlatforms.length > 0 ||
    props.selectedCategories.length > 0 ||
    props.selectedRarity.length > 0 ||
    props.selectedLanguages.length > 0 ||
    props.search.trim().length > 0;

  return (
    <aside className="sidebar-card">
      <div className="sidebar-card__title-row">
        <h3>{t('filtersTitle')}</h3>
        {hasActiveFilters && (
          <button onClick={props.clearFilters} type="button">
            {t('clearFilters')}
          </button>
        )}
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
            label={`${PLATFORM_ICON[platform] ?? '🔷'} ${platform}`}
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
            dot={RARITY_DOT[rarity]}
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
