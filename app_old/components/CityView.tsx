import React from 'react';
import styles from '../styles/CityView.module.css';

interface CityViewProps {
  level: number;
  coins: number;
  timeLeft: string;
}

const CityView: React.FC<CityViewProps> = ({ level, coins, timeLeft }) => {
  return (
    <div className={styles.gameContainer}>
      {/* Stats Bar */}
      <div className={styles.statsBar}>
        <div className={styles.stat}>
          <span>💰 {coins}</span>
        </div>
        <div className={styles.stat}>
          <span>⭐ Level {level}</span>
        </div>
        <div className={styles.stat}>
          <span>⏱️ {timeLeft}</span>
        </div>
      </div>

      {/* Main Game Area */}
      <div className={styles.cityArea}>
        <div className={styles.buildingsRow}>
          {/* Buildings will be rendered here */}
        </div>
        <div className={styles.roadSection}>
          {/* Level indicators on road */}
        </div>
      </div>

      {/* Progress Panel */}
      <div className={styles.progressPanel}>
        <div className={styles.milestone}>
          <span>Sunset City unlocks at Level 10</span>
          <div className={styles.progressBar}></div>
        </div>
        <div className={styles.milestone}>
          <span>Night City unlocks at Level 20</span>
          <div className={styles.progressBar}></div>
        </div>
      </div>
    </div>
  );
};

export default CityView; 