
export type EntityType = 'note' | 'beat' | 'evil' | 'gold' | 'heart' | 'ice' | 'bomb' | 'magnet';

export type Difficulty = 'EASY' | 'NORMAL' | 'HARD';

export interface Position {
  x: number;
  y: number;
}

export interface GameEntity {
  id: string;
  type: EntityType;
  x: number; // World X
  y: number; // World Y
  z: number; // World Z (depth)
  rotation: number;
  rotSpeed: number;
  opacity: number;
  createdAt: number;
  trail: {x: number, y: number, z: number}[]; // For visual trails
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  color: string;
  life: number; // 0 to 1
  size: number;
  type: 'spark' | 'ring' | 'text'; // Visual style
  text?: string; // For floating numbers
}

export interface GameStateRef {
  entities: GameEntity[];
  particles: Particle[];
  lastTime: number;
  startTime: number; // When the game session started
  lastTimeInteger: number; // To track integer second changes
  spawnTimer: number;
  shakeIntensity: number;
  hitStopTimer: number; // For impact freeze
  magnetActive: boolean;
  freezeActive: boolean;
  isFeverMode: boolean;
  fever: number;
  score: number;
  combo: number;
  health: number;
  difficulty: Difficulty;
  missCount: number;
}

export enum GameStatus {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
}