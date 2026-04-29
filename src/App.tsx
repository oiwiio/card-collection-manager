import { useState, useEffect } from 'react';
import { addCard, getAllCards, updateCard, clearCards } from './modules/cardOperations';
import { filterCards, getCardStatistics } from './modules/cardFilters';
import type { Card, NewCard, CardStatus, Rarity } from './types';
import './App.css';

function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [stats, setStats] = useState({ totalCards: 0, rareCards: 0, forSaleCards: 0, totalValue: 0 });
  const [filterRarity, setFilterRarity] = useState<Rarity | ''>('');
  const [newCardName, setNewCardName] = useState('');
  const [newCardRarity, setNewCardRarity] = useState<Rarity>('common');
  const [newCardStatus, setNewCardStatus] = useState<CardStatus>('in_collection');
  const [newCardPrice, setNewCardPrice] = useState('');

  const loadData = () => {
    const allCards = getAllCards();
    setCards(filterRarity ? filterCards(allCards, { rarity: filterRarity }) : allCards);
    setStats(getCardStatistics(allCards));
  };

  useEffect(() => {
    loadData();
  }, [filterRarity]);

  const handleAddCard = () => {
    if (!newCardName.trim()) {
      alert('Введите название карточки');
      return;
    }

    const newCard: NewCard = {
      name: newCardName,
      rarity: newCardRarity,
      status: newCardStatus,
      price: newCardPrice ? Number(newCardPrice) : undefined,
    };

    addCard(newCard);
    setNewCardName('');
    setNewCardPrice('');
    loadData();
  };

  const handleToggleStatus = (id: string, currentStatus: CardStatus) => {
    const newStatus = currentStatus === 'in_collection' ? 'for_sale' : 'in_collection';
    updateCard(id, { status: newStatus });
    loadData();
  };

  const handleClearAll = () => {
    if (confirm('Очистить всю коллекцию?')) {
      clearCards();
      loadData();
    }
  };

  // для получения названия редкости на русском
  const getRarityName = (rarity: Rarity) => {
    switch (rarity) {
      case 'common': return 'Обычная';
      case 'uncommon': return 'Необычная';
      case 'rare': return 'Редкая';
      case 'mythic': return 'Мифическая';
    }
  };

  // для получения названия статуса на русском
  const getStatusName = (status: CardStatus) => {
    switch (status) {
      case 'in_collection': return 'В коллекции';
      case 'for_sale': return 'На продажу';
      case 'for_trade': return 'В трейде';
    }
  };

  return (
    <div className="container">
      <h1> Card Collection Manager</h1>
      
      <div className="stats">
        <div className="stat-card">
          <div className="value">{stats.totalCards}</div>
          <div className="label"> Всего карточек</div>
        </div>
        <div className="stat-card">
          <div className="value">{stats.rareCards}</div>
          <div className="label"> Редких</div>
        </div>
        <div className="stat-card">
          <div className="value">{stats.forSaleCards}</div>
          <div className="label"> На продажу</div>
        </div>
        <div className="stat-card">
          <div className="value">${stats.totalValue}</div>
          <div className="label"> Общая стоимость</div>
        </div>
      </div>

      <div className="add-card">
        <h2> + Добавить карточку</h2>
        <div className="form-group">
          <div className="form-field">
            <label>Название</label>
            <input
              type="text"
              placeholder="Введите название"
              value={newCardName}
              onChange={(e) => setNewCardName(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Редкость</label>
            <select value={newCardRarity} onChange={(e) => setNewCardRarity(e.target.value as Rarity)}>
              <option value="common">⚪ Обычная</option>
              <option value="uncommon">🟢 Необычная</option>
              <option value="rare">🔵 Редкая</option>
              <option value="mythic">🟠 Мифическая</option>
            </select>
          </div>
          <div className="form-field">
            <label>Статус</label>
            <select value={newCardStatus} onChange={(e) => setNewCardStatus(e.target.value as CardStatus)}>
              <option value="in_collection">В коллекции</option>
              <option value="for_sale">На продажу</option>
              <option value="for_trade">В трейде</option>
            </select>
          </div>
          <div className="form-field">
            <label>Цена ($)</label>
            <input
              type="number"
              placeholder="Цена"
              value={newCardPrice}
              onChange={(e) => setNewCardPrice(e.target.value)}
            />
          </div>
          <button className="add-btn" onClick={handleAddCard}> + Добавить</button>
        </div>
      </div>

      <div className="filters">
        <div className="filter-control">
          <label>🔍 Фильтр по редкости</label>
          <select value={filterRarity} onChange={(e) => setFilterRarity(e.target.value as Rarity || '')}>
            <option value="">Все карточки</option>
            <option value="common">⚪ Обычные</option>
            <option value="uncommon">🟢 Необычные</option>
            <option value="rare">🔵 Редкие</option>
            <option value="mythic">🟠 Мифические</option>
          </select>
        </div>
        <button className="clear-btn" onClick={handleClearAll}> Очистить всё</button>
      </div>

      <div className="cards-list">
        <h2>Моя коллекция ({cards.length})</h2>
        {cards.length === 0 ? (
          <div className="empty-state">
            <div className="emoji"> </div>
            <p>Нет карточек. Добавьте первую!</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Название</th>
                <th>Редкость</th>
                <th>Статус</th>
                <th>Цена</th>
                <th>Действие</th>
              </tr>
            </thead>
            <tbody>
              {cards.map(card => (
                <tr key={card.id}>
                  <td>{card.name}</td>
                  <td>
                    <span className={`rarity-badge rarity-${card.rarity}`}>
                      {getRarityName(card.rarity)}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-${card.status === 'in_collection' ? 'collection' : card.status === 'for_sale' ? 'sale' : 'trade'}`}>
                      {getStatusName(card.status)}
                    </span>
                  </td>
                  <td className={card.price ? 'price' : ''}>
                    {card.price ? `$${card.price}` : '-'}
                  </td>
                  <td>
                    <button 
                      className="action-btn"
                      onClick={() => handleToggleStatus(card.id, card.status)}
                    >
                      {card.status === 'in_collection' ? 'Продать' : 'В коллекцию'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;