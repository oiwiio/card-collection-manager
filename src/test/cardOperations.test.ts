import { describe, it, expect, beforeEach } from 'vitest';
import { addCard, getAllCards, clearCards, updateCard } from '../modules/index';
import type { NewCard } from '../types';

describe('cardOperations', () => {
  beforeEach(() => {
    clearCards();
  });

  it('should add a new card', () => {
    const newCard: NewCard = {
      name: 'Test Card',
      status: 'in_collection',
      rarity: 'rare',
      price: 100
    };

    const card = addCard(newCard);
    
    expect(card.id).toBeDefined();
    expect(card.name).toBe('Test Card');
    expect(card.status).toBe('in_collection');
    expect(card.createdAt).toBeInstanceOf(Date);
    
    const allCards = getAllCards();
    expect(allCards.length).toBe(1);
  });

  it('should update an existing card', () => {
    const newCard: NewCard = {
      name: 'Test Card',
      status: 'in_collection',
      rarity: 'common'
    };
    
    const card = addCard(newCard);
    const updated = updateCard(card.id, { status: 'for_sale', price: 50 });
    
    expect(updated).not.toBeNull();
    expect(updated?.status).toBe('for_sale');
    expect(updated?.price).toBe(50);
  });

  it('should clear all cards', () => {
    const card1: NewCard = { name: 'Card 1', status: 'in_collection', rarity: 'common' };
    const card2: NewCard = { name: 'Card 2', status: 'for_sale', rarity: 'rare' };
    
    addCard(card1);
    addCard(card2);
    
    expect(getAllCards().length).toBe(2);
    
    clearCards();
    expect(getAllCards().length).toBe(0);
  });
});