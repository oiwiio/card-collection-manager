// Литеральный тип для статуса карточки
export type CardStatus = 'in_collection' | 'for_sale' | 'for_trade';

// Литеральный тип для редкости
export type Rarity = 'common' | 'uncommon' | 'rare' | 'mythic';

// Литеральный тип для состояния карточки
export type Condition = 'mint' | 'near_mint' | 'played' | 'poor';

// главная сущность проекта
export interface Card {
  id: string;                    
  name: string;                  
  status: CardStatus;            
  createdAt: Date;               
  rarity: Rarity;                
  condition?: Condition;         
  price?: number;               
  imageUrl?: string;             
  set?: string;                  
}

export type NewCard = Omit<Card, 'id' | 'createdAt'>;

// тип для фильтрации карточек
export interface CardFilters {
  status?: CardStatus;           
  rarity?: Rarity;               
  searchQuery?: string;          
  minPrice?: number;             
  maxPrice?: number;             
}

// тип для сортировки
export type SortField = 'name' | 'createdAt' | 'price' | 'rarity';
export type SortOrder = 'asc' | 'desc';

// интерфейс для настроек сортировки
export interface SortOptions {
  field: SortField;
  order: SortOrder;
}

// тип для статистики по коллекции
export interface CollectionStats {
  totalCards: number;            
  byStatus: Record<CardStatus, number>;  
  byRarity: Record<Rarity, number>;      
  totalValue?: number;           
}