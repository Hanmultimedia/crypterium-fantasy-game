import { Document } from 'mongoose';
import { model, Schema } from 'mongoose';
export interface IDungeonReward extends Document {
  diamond: number;
  exp: number;
  items: {
    percent: number;
    tick: number;
    uid: string;
  }[];
  level: number;
  slug: string;
}