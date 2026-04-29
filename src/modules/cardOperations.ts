import type { Card, NewCard, CardStatus,} from '../types';

// Хранилище карточек (имитация базы данных)
let cards: Card[] = [];

/**
 * функция принимает id карточки и объект с любыми полями для обновления
 */
export function updateCard(
  id: string, 
  updates: Partial<Omit<Card, 'id' | 'createdAt'>>
): Card | null {
  const cardIndex = cards.findIndex(card => card.id === id);
  
  if (cardIndex === -1) {
    return null;
  }
  
  const updatedCard = {
    ...cards[cardIndex],
    ...updates
  };
  
  cards[cardIndex] = updatedCard;
  return updatedCard;
}

/**
 * функция возвращает только нужные поля для отображения в списке
 */
export function getCardListItem(card: Card): Pick<Card, 'id' | 'name' | 'status' | 'rarity'> {
  return {
    id: card.id,
    name: card.name,
    status: card.status,
    rarity: card.rarity
  };
}

/**
 * массовое обновление статуса для нескольких карточек
 */
export function bulkUpdateStatus(
  ids: string[], 
  newStatus: CardStatus
): Partial<Card>[] {
  const updatedCards: Partial<Card>[] = [];
  
  ids.forEach(id => {
    const card = updateCard(id, { status: newStatus });
    if (card) {

      updatedCards.push({  // возвращаем только изменившиеся поля
        id: card.id,
        status: card.status
      });
    }
  });
  
  return updatedCards;
}

// вспомогательные функции для демонстрации
export function addCard(newCard: NewCard): Card {
  const card: Card = {
    ...newCard,
    id: crypto.randomUUID(),
    createdAt: new Date()
  };
  cards.push(card);
  return card;
}

export function getAllCards(): Card[] {
  return [...cards];
}

export function clearCards(): void {
  cards = [];
}