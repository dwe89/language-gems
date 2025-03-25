'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DollarSign, TrendingUp } from 'lucide-react';

interface CurrencyDisplayProps {
  currency: number;
  prevCurrency?: number;
}

interface CoinAnimationProps {
  id: string;
  x: number;
  y: number;
  amount: number;
}

export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({ 
  currency, 
  prevCurrency 
}) => {
  const [animations, setAnimations] = useState<CoinAnimationProps[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Format currency with commas
  const formatCurrency = (amount: number): string => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Create animation when currency increases
  useEffect(() => {
    if (prevCurrency && currency > prevCurrency) {
      const amount = currency - prevCurrency;
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const newAnimation: CoinAnimationProps = {
          id: `coin-${Date.now()}`,
          x: rect.width / 2,
          y: rect.height,
          amount
        };
        
        setAnimations(prev => [...prev, newAnimation]);
        
        // Remove animation after it completes
        setTimeout(() => {
          setAnimations(prev => prev.filter(a => a.id !== newAnimation.id));
        }, 1000);
      }
    }
  }, [currency, prevCurrency]);
  
  return (
    <div ref={containerRef} className="currency-display relative">
      <DollarSign className="text-yellow-400" size={20} />
      <span className="currency-value">{formatCurrency(currency)}</span>
      
      {animations.map(anim => (
        <div 
          key={anim.id}
          className="coin-animation"
          style={{ left: `${anim.x}px`, top: `${anim.y}px` }}
        >
          +{anim.amount}
        </div>
      ))}
    </div>
  );
};

export default CurrencyDisplay; 