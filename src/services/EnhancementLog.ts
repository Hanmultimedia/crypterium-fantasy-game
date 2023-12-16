import mongoose, { Schema, Document } from 'mongoose';

export interface EnhancementLog extends Document {
    character1_id: string;
    character2_id: string;
    eth: string;
    enhancementDate: Date;
}

const EnhancementLogSchema: Schema = new Schema({
    character1_id: { type: String, required: true },
    character2_id: { type: String, required: true },
    eth: { type: String, required: true },
    enhancementDate: { type: Date, default: Date.now }
});

export const EnhancementLog = mongoose.model<EnhancementLog>('EnhancementLog', EnhancementLogSchema);
