"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import necessary packages
const mongoose_1 = __importDefault(require("mongoose"));
// Define schema for cooldowns
const treasureStatSchema = new mongoose_1.default.Schema({
    character_id: { type: String, required: true },
    hp: { type: Number, required: true },
    sp: { type: Number, required: true },
    ethOwner: { type: String, required: true },
});
class getTreasureStat {
    static async get(character_id) {
        try {
            let TreasureStat;
            try {
                TreasureStat = mongoose_1.default.model("TreasureStat");
            }
            catch (error) {
                TreasureStat = mongoose_1.default.model("TreasureStat", treasureStatSchema);
            }
            // Find the cooldown by its character_id
            const treasureStat = await TreasureStat.findOne({ character_id });
            // If the cooldown exists, return its value
            if (treasureStat) {
                return { hp: TreasureStat.hp, sp: TreasureStat.sp };
            }
            else {
                // If the cooldown does not exist, return null
                return null;
            }
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
}
exports.default = getTreasureStat;
