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
  className?: string;
}

const Shop: React.FC<ShopProps> = ({
  currency,
  buildings,
  powerUps,
  onPurchaseBuilding,
  onPurchasePowerUp,
  className
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

  const containerClassName = `shop-dropdown-content ${className || ''}`.trim();

  return (
    <div className={containerClassName}>
      <div className="shop-tabs">
        <button
          className={`shop-tab ${activeTab === 'buildings' ? 'active' : ''}`}
          onClick={() => setActiveTab('buildings')}
        >
          <Building2 size={16} className="inline mr-1" />
          Buildings
        </button>
        <button
          className={`shop-tab ${activeTab === 'powerups' ? 'active' : ''}`}
          onClick={() => setActiveTab('powerups')}
        >
          <Zap size={16} className="inline mr-1" />
          Power-ups
        </button>
      </div>
      
      <div className="shop-scroll-container">
        {activeTab === 'buildings' ? (
          buildings.map((building) => {
            const upgradePrice = calculateUpgradePrice(building);
            const canAfford = currency >= upgradePrice;
            const isMaxLevel = building.level >= building.maxLevel;

            return (
              <div key={building.id} className="header-shop-item">
                <div className="flex items-center gap-2">
                  <img
                    src={`/games/translation-tycoon/buildings/${building.id}-level-${building.level}.png`}
                    alt={building.name}
                    className="header-shop-img"
                  />
                  <div>
                    <h3 className="header-shop-name">{building.name}</h3>
                    <p className="header-shop-desc">{building.description}</p>
                    <div className="text-xs text-gray-600">
                      Level {building.level}/{building.maxLevel}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="header-shop-price">
                    <DollarSign size={14} className="inline" />
                    {formatCurrency(upgradePrice)}
                  </div>
                  <button
                    className="header-buy-btn"
                    onClick={() => onPurchaseBuilding(building)}
                    disabled={!canAfford || isMaxLevel}
                  >
                    {isMaxLevel ? 'Max' : 'Upgrade'}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          powerUps.map((powerUp) => {
            const canAfford = currency >= powerUp.price;
            const isActive = powerUp.active;
            const isPurchased = powerUp.purchased;

            return (
              <div key={powerUp.id} className="header-shop-item">
                <div className="flex items-center gap-2">
                  <img
                    src={`/games/translation-tycoon/powerups/${powerUp.id}.png`}
                    alt={powerUp.name}
                    className="header-shop-img"
                  />
                  <div>
                    <h3 className="header-shop-name">{powerUp.name}</h3>
                    <p className="header-shop-desc">{powerUp.description}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="header-shop-price">
                    <DollarSign size={14} className="inline" />
                    {formatCurrency(powerUp.price)}
                  </div>
                  <button
                    className="header-buy-btn"
                    onClick={() => onPurchasePowerUp(powerUp)}
                    disabled={!canAfford || isActive || isPurchased}
                  >
                    {isActive ? 'Active' : isPurchased ? 'Owned' : 'Buy'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Shop; 