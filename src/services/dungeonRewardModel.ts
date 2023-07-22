import mongoose, { model, Schema } from 'mongoose';
import { IDungeonReward } from './DungeonReward';

const DungeonRewardSchema = new mongoose.Schema({
  diamond: { type: Number, required: true },
  exp: { type: Number, required: true },
  items: [{
    percent: { type: Number, required: true },
    tick: { type: Number, required: true },
    uid: { type: String, required: true }
  }],
  level: { type: Number, required: true },
  slug: { type: String, required: true }
});

export const DungeonRewardModel = mongoose.model<IDungeonReward>('DungeonReward', DungeonRewardSchema);