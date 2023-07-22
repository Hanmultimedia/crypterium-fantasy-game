import { Document } from 'mongoose';

export interface DungeonRecord extends Document {
  ethAddress: string;
  dungeon_id: string;
  map: string;
  wave: number;
  start: Date;
  levelState: string;
  rewardWave?: number;
  end?: Date;
  rewards?: Record<string, number>;
  lastWaves?: {
    id: string;
    lastWave: number;
  }[];
  waves?: {
    wave: number;
    start: Date;
    heroes: {
      id: string;
      hp: number;
      sp: number;
    }[];
  }[];
}