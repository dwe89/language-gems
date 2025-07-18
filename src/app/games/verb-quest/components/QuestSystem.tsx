'use client';

export interface Quest {
  id: string;
  name: string;
  description: string;
  type: 'battle' | 'exploration' | 'skill' | 'collection';
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  region?: string;
  progress: number;
  goal: number;
  completed: boolean;
  rewards: {
    experience: number;
    skillPoints?: number;
    unlockTense?: string;
    unlockRegion?: string;
    achievement?: string;
  };
  requirements?: {
    level?: number;
    defeatedEnemies?: string[];
    masteredTenses?: string[];
    unlockedRegions?: string[];
  };
}

export const questTemplates: Quest[] = [
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Complete your first battle and defeat any enemy.',
    type: 'battle',
    difficulty: 'easy',
    region: 'forest_of_beginnings',
    progress: 0,
    goal: 1,
    completed: false,
    rewards: {
      experience: 50,
      skillPoints: 1,
      achievement: 'first_victory'
    }
  },
  {
    id: 'novice_explorer',
    name: 'Novice Explorer',
    description: 'Defeat 3 enemies in the Forest of Beginnings to unlock the Cave of Memories.',
    type: 'battle',
    difficulty: 'easy',
    region: 'forest_of_beginnings',
    progress: 0,
    goal: 3,
    completed: false,
    rewards: {
      experience: 150,
      unlockRegion: 'cave_of_memories',
      achievement: 'region_explorer'
    }
  },
  {
    id: 'tense_master',
    name: 'Tense Master',
    description: 'Master the present tense by achieving a 10-answer combo.',
    type: 'skill',
    difficulty: 'medium',
    progress: 0,
    goal: 10,
    completed: false,
    rewards: {
      experience: 200,
      unlockTense: 'present.irregular',
      achievement: 'combo_master'
    }
  },
  {
    id: 'memory_seeker',
    name: 'Memory Seeker',
    description: 'Explore the Cave of Memories and defeat all its guardians.',
    type: 'battle',
    difficulty: 'medium',
    region: 'cave_of_memories',
    progress: 0,
    goal: 4,
    completed: false,
    rewards: {
      experience: 300,
      skillPoints: 2,
      unlockTense: 'preterite.regular'
    },
    requirements: {
      level: 3,
      unlockedRegions: ['cave_of_memories']
    }
  },
  {
    id: 'command_master',
    name: 'Command Master',
    description: 'Conquer the Dungeon of Commands and master imperative forms.',
    type: 'battle',
    difficulty: 'hard',
    region: 'dungeon_of_commands',
    progress: 0,
    goal: 5,
    completed: false,
    rewards: {
      experience: 500,
      unlockTense: 'imperative',
      unlockRegion: 'palace_of_possibilities'
    },
    requirements: {
      level: 5,
      masteredTenses: ['present.regular', 'present.irregular']
    }
  },
  {
    id: 'legend_seeker',
    name: 'Legend Seeker',
    description: 'Reach the Lair of Legends and face the ultimate challenges.',
    type: 'exploration',
    difficulty: 'legendary',
    progress: 0,
    goal: 1,
    completed: false,
    rewards: {
      experience: 1000,
      skillPoints: 5,
      unlockRegion: 'lair_of_legends',
      achievement: 'legend_seeker'
    },
    requirements: {
      level: 10,
      defeatedEnemies: ['chaos_lord', 'subjunctive_lord', 'time_weaver']
    }
  }
];

export class QuestSystem {
  private quests: Quest[] = [];
  
  constructor() {
    this.loadQuests();
  }

  private loadQuests(): void {
    const saved = localStorage.getItem('verbQuestQuests');
    if (saved) {
      try {
        this.quests = JSON.parse(saved);
      } catch (error) {
        console.error('Failed to load quests:', error);
        this.initializeDefaultQuests();
      }
    } else {
      this.initializeDefaultQuests();
    }
  }

  private initializeDefaultQuests(): void {
    this.quests = questTemplates.map(quest => ({ ...quest }));
    this.saveQuests();
  }

  private saveQuests(): void {
    localStorage.setItem('verbQuestQuests', JSON.stringify(this.quests));
  }

  getAvailableQuests(playerStats: any): Quest[] {
    return this.quests.filter(quest => {
      if (quest.completed) return false;
      
      if (quest.requirements) {
        const req = quest.requirements;
        
        if (req.level && playerStats.level < req.level) return false;
        
        if (req.defeatedEnemies) {
          const hasDefeated = req.defeatedEnemies.every(enemy => 
            playerStats.defeatedEnemies.has(enemy)
          );
          if (!hasDefeated) return false;
        }
        
        if (req.masteredTenses) {
          const hasMastered = req.masteredTenses.every(tense => 
            playerStats.masteredTenses.has(tense)
          );
          if (!hasMastered) return false;
        }
        
        if (req.unlockedRegions) {
          const hasUnlocked = req.unlockedRegions.every(region => 
            playerStats.unlockedRegions.includes(region)
          );
          if (!hasUnlocked) return false;
        }
      }
      
      return true;
    });
  }

  getActiveQuests(): Quest[] {
    return this.quests.filter(quest => !quest.completed && quest.progress > 0);
  }

  getCompletedQuests(): Quest[] {
    return this.quests.filter(quest => quest.completed);
  }

  updateProgress(questId: string, increment: number = 1): Quest | null {
    const quest = this.quests.find(q => q.id === questId);
    if (!quest || quest.completed) return null;

    quest.progress = Math.min(quest.goal, quest.progress + increment);
    
    if (quest.progress >= quest.goal) {
      quest.completed = true;
    }
    
    this.saveQuests();
    return quest;
  }

  checkBattleProgress(enemyId: string, region: string, playerStats: any): Quest[] {
    const completedQuests: Quest[] = [];
    
    this.quests.forEach(quest => {
      if (quest.completed || quest.type !== 'battle') return;
      
      // Check if quest is region-specific
      if (quest.region && quest.region !== region) return;
      
      const updated = this.updateProgress(quest.id);
      if (updated && updated.completed) {
        completedQuests.push(updated);
      }
    });
    
    return completedQuests;
  }

  checkComboProgress(combo: number): Quest[] {
    const completedQuests: Quest[] = [];
    
    this.quests.forEach(quest => {
      if (quest.completed || quest.type !== 'skill') return;
      if (quest.id !== 'tense_master') return; // Only for combo quest
      
      if (combo >= quest.goal) {
        quest.progress = quest.goal;
        quest.completed = true;
        completedQuests.push(quest);
      }
    });
    
    this.saveQuests();
    return completedQuests;
  }

  checkExplorationProgress(region: string): Quest[] {
    const completedQuests: Quest[] = [];
    
    this.quests.forEach(quest => {
      if (quest.completed || quest.type !== 'exploration') return;
      
      if (quest.id === 'legend_seeker' && region === 'lair_of_legends') {
        const updated = this.updateProgress(quest.id);
        if (updated && updated.completed) {
          completedQuests.push(updated);
        }
      }
    });
    
    return completedQuests;
  }

  applyQuestRewards(quest: Quest, character: any): void {
    const rewards = quest.rewards;
    
    if (rewards.experience) {
      character.gainExperience(rewards.experience);
    }
    
    if (rewards.skillPoints) {
      character.stats.skillPoints += rewards.skillPoints;
    }
    
    if (rewards.unlockTense) {
      character.unlockTense(rewards.unlockTense);
    }
    
    if (rewards.unlockRegion) {
      character.unlockRegion(rewards.unlockRegion);
    }
    
    if (rewards.achievement) {
      character.addAchievement(rewards.achievement);
    }
    
    character.stats.completedQuests++;
    character.saveProgress();
  }

  resetQuests(): void {
    this.initializeDefaultQuests();
  }

  static clearSave(): void {
    localStorage.removeItem('verbQuestQuests');
  }
}
