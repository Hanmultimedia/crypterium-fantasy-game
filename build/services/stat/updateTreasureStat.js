"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTreasureStat = void 0;
// Import necessary packages
const mongoose_1 = __importDefault(require("mongoose"));
// Define schema for cooldowns
const treasureStatSchema = new mongoose_1.default.Schema({
    character_id: { type: String, required: true },
    hp: { type: String, required: true },
    sp: { type: String, required: true },
    ethOwner: { type: String, required: true },
});
async function updateTreasureStat(character_id, hp, sp, ethOwner) {
    try {
        let TreasureStat;
        try {
            TreasureStat = mongoose_1.default.model("TreasureStat");
        }
        catch (error) {
            TreasureStat = mongoose_1.default.model("TreasureStat", treasureStatSchema);
        }
        // Find the character by its character_id and ethOwner
        let treasureStat = await TreasureStat.findOne({ character_id, ethOwner });
        // If the character does not exist, create a new one with the provided character_id and ethOwner
        if (!treasureStat) {
            treasureStat = new TreasureStat({ character_id: character_id, hp: hp, sp: sp, ethOwner: ethOwner });
        }
        // Update the character's hp/sp value
        treasureStat.hp = hp;
        treasureStat.sp = sp;
        // Save the updated character to the database
        await treasureStat.save();
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}
exports.updateTreasureStat = updateTreasureStat;
