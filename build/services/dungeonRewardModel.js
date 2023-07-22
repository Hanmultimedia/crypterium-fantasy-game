"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DungeonRewardModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const DungeonRewardSchema = new mongoose_1.default.Schema({
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
exports.DungeonRewardModel = mongoose_1.default.model('DungeonReward', DungeonRewardSchema);
