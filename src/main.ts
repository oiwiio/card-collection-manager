import { addCard, getAllCards, updateCard, getCardListItem } from './modules/cardOperations';
import { filterCards, sortCards, getCardStatistics } from './modules/cardFilters';
import { validateCard } from './modules/index';


const card1 = addCard({
  name: 'Black Lotus',
  status: 'in_collection',
  rarity: 'mythic',
  price: 15000,
  condition: 'mint'
});

const card2 = addCard({
  name: 'Lightning Bolt',
  status: 'for_sale',
  rarity: 'common',
  price: 5,
  condition: 'near_mint'
});

const card3 = addCard({
  name: 'Dark Ritual',
  status: 'for_trade',
  rarity: 'uncommon',
  price: 2
});

const newCard = {
  name: 'Black Lotus',
  status: 'for_sale' as const,
  rarity: 'mythic' as const,
  price: 15000
};

const errors = validateCard(newCard);
if (errors.length > 0) {
  console.log('Ошибки валидации:', errors);
} else {
  const card = addCard(newCard);
  console.log('Карточка добавлена:', card);
};

console.log('Добавленные карточки:');
console.log(getCardListItem(card1));
console.log(getCardListItem(card2));
console.log(getCardListItem(card3));

console.log(' Все карточки ');
getAllCards().forEach(card => {
  console.log(getCardListItem(card));
});

console.log('Фильтр (только редкие)');
const rareCards = filterCards(getAllCards(), { rarity: 'mythic' });
rareCards.forEach(card => {
  console.log(card.name);
});

console.log('Сортировка по цене ');
const sortedByPrice = sortCards(getAllCards(), { field: 'price', order: 'desc' });
sortedByPrice.forEach(card => {
  console.log(`${card.name}: $${card.price}`);
});

console.log(' Статистика ');
console.log(getCardStatistics(getAllCards()));

console.log('\n=== Обновление карточки ===');
updateCard(card1.id, { status: 'for_sale', price: 16000 });
const updated = getCardListItem(getAllCards().find(c => c.id === card1.id)!);
console.log('Обновлённая карточка:', updated);