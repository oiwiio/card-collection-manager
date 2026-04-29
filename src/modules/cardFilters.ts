import type { Card, CardFilters, SortOptions, Rarity } from '../types';

/**
 * фильтр может быть частичным - указываем только те поля, которые нужны
 */
export function filterCards(
  cards: Card[], 
  filters: Partial<CardFilters>
): Card[] {
  let result = [...cards];
  
  // фильтр по статусу
  if (filters.status) {
    result = result.filter(card => card.status === filters.status);
  }
  
  // фильтр по редкости
  if (filters.rarity) {
    result = result.filter(card => card.rarity === filters.rarity);
  }
  
  // поиск по названию
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    result = result.filter(card => 
      card.name.toLowerCase().includes(query)
    );
  }
  
  // фильтр по цене (для карточек на продажу)
  if (filters.minPrice !== undefined) {
    result = result.filter(card => 
      card.price !== undefined && card.price >= filters.minPrice!
    );
  }
  
  if (filters.maxPrice !== undefined) {
    result = result.filter(card => 
      card.price !== undefined && card.price <= filters.maxPrice!
    );
  }
  
  return result;
}

/**
 * функция сортировки с использованием generic и Record
 */
export function sortCards(
  cards: Card[],
  options: SortOptions
): Card[] {
  const { field, order } = options;
  const result = [...cards];
  
  const multiplier = order === 'asc' ? 1 : -1;
  
  result.sort((a, b) => {
    let comparison = 0;
    
    switch (field) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'createdAt':
        comparison = a.createdAt.getTime() - b.createdAt.getTime();
        break;
      case 'price':
        const priceA = a.price ?? 0;
        const priceB = b.price ?? 0;
        comparison = priceA - priceB;
        break;
      case 'rarity':
        const rarityOrder: Record<Rarity, number> = {
          'common': 1,
          'uncommon': 2,
          'rare': 3,
          'mythic': 4
        };
        comparison = (rarityOrder[a.rarity] ?? 0) - (rarityOrder[b.rarity] ?? 0);
        break;
    }
    
    return comparison * multiplier;
  });
  
  return result;
}

/**
 * функция возвращает тип, который можно вывести через ReturnType
 */
export function getCardStatistics(cards: Card[]) {
  const totalCards = cards.length;
  const rareCards = cards.filter(c => c.rarity === 'rare' || c.rarity === 'mythic').length;
  const forSaleCards = cards.filter(c => c.status === 'for_sale').length;
  const totalValue = cards
    .filter(c => c.price !== undefined)
    .reduce((sum, c) => sum + (c.price || 0), 0);
  
  return {
    totalCards,
    rareCards,
    forSaleCards,
    totalValue,
    rarePercentage: totalCards > 0 ? (rareCards / totalCards) * 100 : 0
  };
}

export type CardStatistics = ReturnType<typeof getCardStatistics>;
