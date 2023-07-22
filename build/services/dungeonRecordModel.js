"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DungeonRecordModel = void 0;
const mongoose_1 = require("mongoose");
const DungeonRecordSchema = new mongoose_1.Schema({
    ethAddress: { type: String, required: true },
    dungeon_id: { type: String, required: true },
    map: { type: String, required: true },
    wave: { type: Number, required: true },
    start: { type: Date, required: true },
    levelState: { type: String, required: true },
    rewardWave: { type: Number },
    end: { type: Date },
    rewards: { type: Map, of: Number },
    lastWaves: [{ id: String, lastWave: Number }],
    waves: [{
            wave: { type: Number, required: true },
            start: { type: Date, required: true },
            heroes: [{
                    id: { type: String, required: true },
                    hp: { type: Number, required: true },
                    sp: { type: Number, required: true },
                }]
        }],
});
exports.DungeonRecordModel = (0, mongoose_1.model)('DungeonRecord', DungeonRecordSchema);
