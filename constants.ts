
export const SPAWN_RATE_BASE = 500; 
export const SPAWN_RATE_MIN = 150;
export const MAX_HEALTH = 3;
export const MAX_FEVER = 100;
export const MISS_LIMIT = 10;
export const MISS_PENALTY_SCORE = 50;
export const GAME_DURATION = 30; // seconds

// 3D & Camera
export const FOCAL_LENGTH = 800;
export const SPAWN_Z = 3000; // Start far away
export const CAMERA_Z = 0;
export const DESPAWN_Z = -200; // Behind camera

export const DIFFICULTY_CONFIG = {
  EASY: { label: 'CHILL', speedMod: 0.8, spawnMod: 1.2, damageOnMiss: false },
  NORMAL: { label: 'POP', speedMod: 1.0, spawnMod: 1.0, damageOnMiss: true },
  HARD: { label: 'METAL', speedMod: 1.4, spawnMod: 0.8, damageOnMiss: true },
};

export const ENTITY_CONFIG = {
  note: { 
    score: 100, 
    icon: '🎵',
    color: '#3b82f6', // blue
    probability: 0.45 
  },
  beat: { 
    score: 150, 
    icon: '🎶',
    color: '#a855f7', // purple
    probability: 0.2
  },
  gold: { 
    score: 500, 
    icon: '⭐',
    color: '#eab308', // yellow
    probability: 0.08
  },
  evil: { 
    score: -50, 
    damage: 1, 
    icon: '👾',
    color: '#ef4444', // red
    probability: 0.15
  },
  heart: { 
    score: 0, 
    heal: 1, 
    icon: '❤️',
    color: '#ec4899', // pink
    probability: 0.03 
  },
  ice: { 
    score: 50, 
    effect: 'freeze', 
    icon: '❄️',
    color: '#06b6d4', // cyan
    probability: 0.03
  },
  bomb: { 
    score: 50, 
    effect: 'clear', 
    icon: '💣',
    color: '#f97316', // orange
    probability: 0.03
  },
  magnet: { 
    score: 50, 
    effect: 'attract', 
    icon: '🧲',
    color: '#10b981', // emerald
    probability: 0.03
  },
};

export const FEVER_THRESHOLD = 100;