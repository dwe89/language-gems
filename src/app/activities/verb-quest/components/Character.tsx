'use client';

export interface CharacterClass {
  id: string;
  name: string;
  description: string;
  emoji: string;
  baseHealth: number;
  healthPerLevel: number;
  specialAbility: string;
  damageMultiplier: number;
  timeBonus?: number;
  comboMultiplier?: number;
}

export const characterClasses: Record<string, CharacterClass> = {
  warrior: {
    id: 'warrior',
    name: 'Warrior of Words',
    description: 'Master of verb conjugations with enhanced health and damage',
    emoji: '⚔️',
    baseHealth: 120,
    healthPerLevel: 25,
    specialAbility: 'Battle Fury - Deal 20% more damage',
    damageMultiplier: 1.2,
  },
  mage: {
    id: 'mage',
    name: 'Grammar Mage',
    description: 'Scholar of languages with extended time for complex conjugations',
    emoji: '🧙‍♂️',
    baseHealth: 80,
    healthPerLevel: 15,
    specialAbility: 'Time Mastery - +10 seconds for answers',
    damageMultiplier: 1.0,
    timeBonus: 10,
  },
  rogue: {
    id: 'rogue',
    name: 'Syntax Rogue',
    description: 'Quick learner with combo bonuses and critical hits',
    emoji: '🗡️',
    baseHealth: 100,
    healthPerLevel: 20,
    specialAbility: 'Combo Strike - 50% bonus for consecutive correct answers',
    damageMultiplier: 1.1,
    comboMultiplier: 1.5,
  },
};

export interface CharacterStats {
  name: string;
  characterClass: string;
  level: number;
  experience: number;
  experienceToNext: number;
  health: number;
  maxHealth: number;
  skillPoints: number;
  skills: {
    verbMastery: number;
    criticalThinking: number;
    timeManagement: number;
  };
  unlockedTenses: string[];
  masteredTenses: Set<string>;
  achievements: Set<string>;
  defeatedEnemies: Set<string>;
  unlockedRegions: string[];
  currentRegion: string;
  completedQuests: number;
  combo: number;
  maxCombo: number;
}

export class Character {
  stats: CharacterStats;

  constructor(name: string, characterClass: string) {
    const classData = characterClasses[characterClass];
    
    this.stats = {
      name,
      characterClass,
      level: 1,
      experience: 0,
      experienceToNext: this.calculateExpToNext(1),
      health: classData.baseHealth,
      maxHealth: classData.baseHealth,
      skillPoints: 3,
      skills: {
        verbMastery: 1,
        criticalThinking: 1,
        timeManagement: 1,
      },
      unlockedTenses: ['present.regular'],
      masteredTenses: new Set(['present.regular']),
      achievements: new Set(),
      defeatedEnemies: new Set(),
      unlockedRegions: ['forest_of_beginnings'],
      currentRegion: 'forest_of_beginnings',
      completedQuests: 0,
      combo: 0,
      maxCombo: 0,
    };

    this.loadProgress();
  }

  private calculateExpToNext(level: number): number {
    return level * 160; // Same as original
  }

  gainExperience(amount: number, region?: string): boolean {
    console.log(`Gaining ${amount} experience. Current: ${this.stats.experience}, Level: ${this.stats.level}, Next level at: ${this.stats.experienceToNext}`);
    
    this.stats.experience += amount;
    let leveledUp = false;

    while (this.stats.experience >= this.stats.experienceToNext) {
      leveledUp = true;
      console.log(`Level up! New level: ${this.stats.level + 1}`);
      this.levelUp();
    }

    if (region) {
      this.checkRegionUnlock();
    }

    console.log(`After experience gain - Level: ${this.stats.level}, Experience: ${this.stats.experience}/${this.stats.experienceToNext}`);
    this.saveProgress();
    return leveledUp;
  }

  private levelUp(): void {
    this.stats.level++;
    this.stats.experience -= this.stats.experienceToNext;
    this.stats.experienceToNext = this.calculateExpToNext(this.stats.level);
    
    const classData = characterClasses[this.stats.characterClass];
    const healthIncrease = classData.healthPerLevel;
    
    this.stats.maxHealth += healthIncrease;
    this.stats.health = this.stats.maxHealth; // Full heal on level up
    this.stats.skillPoints += 2; // 2 skill points per level

    this.addAchievement(`level_${this.stats.level}`);
  }

  increaseCombo(): void {
    this.stats.combo++;
    if (this.stats.combo > this.stats.maxCombo) {
      this.stats.maxCombo = this.stats.combo;
    }
  }

  resetCombo(): void {
    this.stats.combo = 0;
  }

  takeDamage(amount: number): boolean {
    this.stats.health = Math.max(0, this.stats.health - amount);
    this.saveProgress();
    return this.stats.health <= 0;
  }

  heal(amount: number): void {
    this.stats.health = Math.min(this.stats.maxHealth, this.stats.health + amount);
    this.saveProgress();
  }

  addSkillPoint(skill: keyof CharacterStats['skills']): boolean {
    if (this.stats.skillPoints > 0 && this.stats.skills[skill] < 10) {
      this.stats.skillPoints--;
      this.stats.skills[skill]++;
      this.saveProgress();
      return true;
    }
    return false;
  }

  unlockTense(tense: string): void {
    if (!this.stats.unlockedTenses.includes(tense)) {
      this.stats.unlockedTenses.push(tense);
      this.saveProgress();
    }
  }

  masterTense(tense: string): void {
    this.stats.masteredTenses.add(tense);
    this.addAchievement(`master_${tense}`);
    this.saveProgress();
  }

  addAchievement(achievement: string): void {
    this.stats.achievements.add(achievement);
    this.saveProgress();
  }

  defeatEnemy(enemyId: string): void {
    this.stats.defeatedEnemies.add(enemyId);
    this.checkRegionUnlock();
    this.saveProgress();
  }

  unlockRegion(regionId: string): void {
    if (!this.stats.unlockedRegions.includes(regionId)) {
      this.stats.unlockedRegions.push(regionId);
      this.addAchievement(`unlock_${regionId}`);
      this.saveProgress();
    }
  }

  private checkRegionUnlock(): void {
    // Check each region for unlock requirements
    const level = this.stats.level;
    console.log('Checking region unlocks. Level:', level, 'Defeated enemies:', Array.from(this.stats.defeatedEnemies));

    // Temple of Chaos - Level 2, defeat Forest enemies
    if (level >= 2 && 
        this.stats.defeatedEnemies.has('moss_goblin') && 
        this.stats.defeatedEnemies.has('leaf_sprite') && 
        this.stats.defeatedEnemies.has('forest_guardian') &&
        !this.stats.unlockedRegions.includes('temple_of_chaos')) {
      console.log('Unlocking Temple of Chaos');
      this.unlockRegion('temple_of_chaos');
    }

    // Cave of Memories - Level 3, defeat Temple enemies
    if (level >= 3 && 
        this.stats.defeatedEnemies.has('chaos_acolyte') && 
        this.stats.defeatedEnemies.has('time_weaver') && 
        this.stats.defeatedEnemies.has('chaos_lord') &&
        !this.stats.unlockedRegions.includes('cave_of_memories')) {
      console.log('Unlocking Cave of Memories');
      this.unlockRegion('cave_of_memories');
    }

    // Lair of Legends - Level 4, defeat Cave enemies
    if (level >= 4 && 
        this.stats.defeatedEnemies.has('shadow_wraith') && 
        this.stats.defeatedEnemies.has('memory_specter') && 
        this.stats.defeatedEnemies.has('temporal_guardian') &&
        !this.stats.unlockedRegions.includes('lair_of_legends')) {
      this.unlockRegion('lair_of_legends');
    }

    // Swamp of Habits - Level 5, defeat Lair enemies
    if (level >= 5 && 
        this.stats.defeatedEnemies.has('legendary_beast') && 
        this.stats.defeatedEnemies.has('mythical_guardian') &&
        !this.stats.unlockedRegions.includes('swamp_of_habits')) {
      this.unlockRegion('swamp_of_habits');
    }

    // Skyward Spire - Level 6, defeat Swamp enemies
    if (level >= 6 && 
        this.stats.defeatedEnemies.has('swamp_hag') && 
        this.stats.defeatedEnemies.has('habitual_phantom') &&
        !this.stats.unlockedRegions.includes('skyward_spire')) {
      this.unlockRegion('skyward_spire');
    }

    // Palace of Possibilities - Level 7, defeat Sky Guardian
    if (level >= 7 && 
        this.stats.defeatedEnemies.has('sky_guardian') &&
        !this.stats.unlockedRegions.includes('palace_of_possibilities')) {
      this.unlockRegion('palace_of_possibilities');
    }

    // Dungeon of Commands - Level 8, defeat Palace enemies
    if (level >= 8 && 
        this.stats.defeatedEnemies.has('possibility_wraith') && 
        this.stats.defeatedEnemies.has('conditional_specter') &&
        !this.stats.unlockedRegions.includes('dungeon_of_commands')) {
      this.unlockRegion('dungeon_of_commands');
    }

    // Shrine of Perfection - Level 9, defeat Dungeon enemies
    if (level >= 9 && 
        this.stats.defeatedEnemies.has('commander_specter') && 
        this.stats.defeatedEnemies.has('imperative_phantom') &&
        !this.stats.unlockedRegions.includes('shrine_of_perfection')) {
      this.unlockRegion('shrine_of_perfection');
    }

    // Castle of Conjugations - Level 10, defeat Shrine enemies
    if (level >= 10 && 
        this.stats.defeatedEnemies.has('perfection_guardian') && 
        this.stats.defeatedEnemies.has('compound_wraith') &&
        !this.stats.unlockedRegions.includes('castle_of_conjugations')) {
      this.unlockRegion('castle_of_conjugations');
    }
  }

  getDamageMultiplier(): number {
    const classData = characterClasses[this.stats.characterClass];
    const skillBonus = 1 + (this.stats.skills.verbMastery - 1) * 0.1;
    return classData.damageMultiplier * skillBonus;
  }

  getTimeBonus(): number {
    const classData = characterClasses[this.stats.characterClass];
    const skillBonus = (this.stats.skills.timeManagement - 1) * 2;
    return (classData.timeBonus || 0) + skillBonus;
  }

  getComboMultiplier(): number {
    const classData = characterClasses[this.stats.characterClass];
    if (this.stats.combo >= 3 && classData.comboMultiplier) {
      return classData.comboMultiplier;
    }
    return 1.0;
  }

  saveProgress(): void {
    const saveData = {
      ...this.stats,
      masteredTenses: Array.from(this.stats.masteredTenses),
      achievements: Array.from(this.stats.achievements),
      defeatedEnemies: Array.from(this.stats.defeatedEnemies),
    };
    
    localStorage.setItem('verbQuestCharacter', JSON.stringify(saveData));
  }

  private loadProgress(): void {
    const saved = localStorage.getItem('verbQuestCharacter');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        
        // Only load if the character name and class match
        if (data.name === this.stats.name && data.characterClass === this.stats.characterClass) {
          this.stats = {
            ...this.stats,
            ...data,
            masteredTenses: new Set(data.masteredTenses || []),
            achievements: new Set(data.achievements || []),
            defeatedEnemies: new Set(data.defeatedEnemies || []),
          };
        }
      } catch (error) {
        console.error('Failed to load character progress:', error);
      }
    }
  }

  static clearSave(): void {
    localStorage.removeItem('verbQuestCharacter');
  }
}
