import type { Card, NewCard, Rarity, CardStatus } from '../types';

export interface ValidationError {
  field: keyof NewCard | 'general';
  message: string;
}

/**
 * функция валидации требует все поля (даже опциональные в оригинале)
 */
export function validateCardStrict(
  card: Required<Pick<Card, 'name' | 'rarity' | 'status'>> & Partial<Card>
): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (!card.name || card.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Name is required' });
  }
  
  if (card.name && card.name.length > 100) {
    errors.push({ field: 'name', message: 'Name must be less than 100 characters' });
  }
  
  const validRarities: Rarity[] = ['common', 'uncommon', 'rare', 'mythic'];
  if (!card.rarity || !validRarities.includes(card.rarity)) {
    errors.push({ field: 'rarity', message: 'Valid rarity is required' });
  }
  
  const validStatuses: CardStatus[] = ['in_collection', 'for_sale', 'for_trade'];
  if (!card.status || !validStatuses.includes(card.status)) {
    errors.push({ field: 'status', message: 'Valid status is required' });
  }
  
  if (card.price !== undefined && card.price < 0) {
    errors.push({ field: 'price', message: 'Price cannot be negative' });
  }
  
  if (card.status === 'for_sale' && card.price === undefined) {
    errors.push({ field: 'price', message: 'Price is required when status is "for sale"' });
  }
  
  return errors;
}

/**
 * мягкая валидация - опциональные поля не требуются
 */
export function validateCard(card: Partial<NewCard>): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (card.name !== undefined && card.name.length > 100) {
    errors.push({ field: 'name', message: 'Name must be less than 100 characters' });
  }
  
  if (card.price !== undefined && card.price < 0) {
    errors.push({ field: 'price', message: 'Price cannot be negative' });
  }
  
  if (card.status === 'for_sale' && card.price === undefined) {
    errors.push({ field: 'price', message: 'Price is required when status is "for sale"' });
  }
  
  return errors;
}

/**
 * функция возвращает безопасное представление карточки для экспорта
 */
export function getSafeCardRepresentation(
  card: Card
): Omit<Card, 'createdAt'> & { createdAt: string } {
  return {
    id: card.id,
    name: card.name,
    status: card.status,
    rarity: card.rarity,
    condition: card.condition,
    price: card.price,
    imageUrl: card.imageUrl,
    set: card.set,
    createdAt: card.createdAt.toISOString() // преобразуем Date в строку
  };
}