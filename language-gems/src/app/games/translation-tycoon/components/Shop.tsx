'use client';

import React, { useState } from 'react';
import { DollarSign, Building2, Zap } from 'lucide-react';
import { BuildingUpgrade, PowerUp } from '../types';

interface ShopProps {
  currency: number;
  buildings: BuildingUpgrade[];
  powerUps: PowerUp[];
  onPurchaseBuilding: (building: BuildingUpgrade) => void;
  onPurchasePowerUp: (powerUp: PowerUp) => void;
}

const Shop: React.FC<ShopProps> = ({
  currency,
  buildings,
  powerUps,
  onPurchaseBuilding,
  onPurchasePowerUp
}) => {
  const [activeTab, setActiveTab] = useState<'buildings' | 'powerups'>('buildings');

  const calculateUpgradePrice = (building: BuildingUpgrade) => {
    const basePrice = building.price;
    const levelMultiplier = Math.pow(1.5, building.level - 1);
    return Math.round(basePrice * levelMultiplier);
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString();
  };

  return (
    <div className="shop-container">
      <h2 className="text-xl font-bold mb-4">Translation Tycoon Shop</h2>
      
      <div className="shop-tabs">
        <button
          className={`shop-tab ${activeTab === 'buildings' ? 'active' : ''}`}
          onClick={() => setActiveTab('buildings')}
        >
          Buildings
        </button>
        <button
          className={`shop-tab ${activeTab === 'powerups' ? 'active' : ''}`}
          onClick={() => setActiveTab('powerups')}
        >
          Power-ups
        </button>
      </div>
      
      <div className="shop-items">
        {activeTab === 'buildings' ? (
          buildings.map((building) => {
            const upgradePrice = calculateUpgradePrice(building);
            const canAfford = currency >= upgradePrice;
            const isMaxLevel = building.level >= building.maxLevel;

            return (
              <div key={building.id} className="shop-item">
                <img
                  src={`/games/translation-tycoon/buildings/${building.id}-level-${building.level}.png`}
                  alt={building.name}
                  className="shop-item-img"
                />
                <h3 className="shop-item-name">{building.name}</h3>
                <p className="shop-item-desc">{building.description}</p>
                <div className="shop-item-price">
                  <span>Level {building.level}/{building.maxLevel}</span>
                </div>
                <div className="shop-item-price">
                  <span>Upgrade: {formatCurrency(upgradePrice)} coins</span>
                </div>
                <button
                  className="buy-btn"
                  onClick={() => onPurchaseBuilding(building)}
                  disabled={!canAfford || isMaxLevel}
                >
                  {isMaxLevel ? 'Max Level' : 'Upgrade'}
                </button>
              </div>
            );
          })
        ) : (
          powerUps.map((powerUp) => {
            const canAfford = currency >= powerUp.price;
            const isActive = powerUp.active;
            const isPurchased = powerUp.purchased;

            return (
              <div key={powerUp.id} className="shop-item">
                <img
                  src={`/games/translation-tycoon/powerups/${powerUp.id}.png`}
                  alt={powerUp.name}
                  className="shop-item-img"
                />
                <h3 className="shop-item-name">{powerUp.name}</h3>
                <p className="shop-item-desc">{powerUp.description}</p>
                <div className="shop-item-price">
                  <span>{formatCurrency(powerUp.price)} coins</span>
                </div>
                <button
                  className="buy-btn"
                  onClick={() => onPurchasePowerUp(powerUp)}
                  disabled={!canAfford || isActive || isPurchased}
                >
                  {isActive ? 'Active' : isPurchased ? 'Purchased' : 'Buy'}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Shop; 