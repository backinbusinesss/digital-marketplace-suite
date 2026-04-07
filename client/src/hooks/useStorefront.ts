import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { Product } from '../types';

export function useStorefront() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('featured');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRarity, setSelectedRarity] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  useEffect(() => {
    api
      .getStoreProducts()
      .then((payload) => {
        setProducts(payload.products);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const platforms = useMemo(() => [...new Set(products.map((product) => product.platform))], [products]);
  const categories = useMemo(() => [...new Set(products.map((product) => product.category))], [products]);
  const rarityLevels = useMemo(() => [...new Set(products.map((product) => product.rarity))], [products]);
  const languages = useMemo(
    () => [...new Set(products.map((product) => product.meaningLanguage))],
    [products]
  );

  const toggle = (value: string, values: string[], setValues: (next: string[]) => void) => {
    setValues(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  };

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const next = products.filter((product) => {
      const matchesSearch =
        !query ||
        [
          product.title,
          product.platform,
          product.category,
          product.rarity,
          product.meaningLanguage,
          ...product.tags,
          ...product.previewDetails
        ]
          .join(' ')
          .toLowerCase()
          .includes(query);

      const matchesPlatform =
        selectedPlatforms.length === 0 || selectedPlatforms.includes(product.platform);
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const matchesRarity = selectedRarity.length === 0 || selectedRarity.includes(product.rarity);
      const matchesLanguage =
        selectedLanguages.length === 0 || selectedLanguages.includes(product.meaningLanguage);

      return matchesSearch && matchesPlatform && matchesCategory && matchesRarity && matchesLanguage;
    });

    return next.sort((a, b) => {
      if (sort === 'low') return a.priceUsd - b.priceUsd;
      if (sort === 'high') return b.priceUsd - a.priceUsd;
      if (sort === 'newest') return Date.parse(b.createdAt) - Date.parse(a.createdAt);
      if (sort === 'featured') return Number(b.featured) - Number(a.featured) || b.priceUsd - a.priceUsd;
      return 0;
    });
  }, [products, search, selectedPlatforms, selectedCategories, selectedRarity, selectedLanguages, sort]);

  const clearFilters = () => {
    setSearch('');
    setSort('featured');
    setSelectedPlatforms([]);
    setSelectedCategories([]);
    setSelectedRarity([]);
    setSelectedLanguages([]);
  };

  return {
    products,
    filteredProducts,
    loading,
    error,
    search,
    setSearch,
    sort,
    setSort,
    platforms,
    categories,
    rarityLevels,
    languages,
    selectedPlatforms,
    selectedCategories,
    selectedRarity,
    selectedLanguages,
    togglePlatform: (value: string) => toggle(value, selectedPlatforms, setSelectedPlatforms),
    toggleCategory: (value: string) => toggle(value, selectedCategories, setSelectedCategories),
    toggleRarity: (value: string) => toggle(value, selectedRarity, setSelectedRarity),
    toggleLanguage: (value: string) => toggle(value, selectedLanguages, setSelectedLanguages),
    clearFilters
  };
}
