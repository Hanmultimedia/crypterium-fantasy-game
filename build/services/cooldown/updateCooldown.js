"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import necessary packages
const mongoose_1 = __importDefault(require("mongoose"));
// Define schema for cooldowns
const cooldownSchema = new mongoose_1.default.Schema({
    character_id: { type: String, required: true },
    cooldown: { type: Number, required: true },
    ethOwner: { type: String, required: true },
});
class updateCooldown {
    static async update(character_id, cooldown, ethOwner) {
        try {
            let DeadCooldown;
            try {
                DeadCooldown = mongoose_1.default.model("DeadCooldown");
            }
            catch (error) {
                DeadCooldown = mongoose_1.default.model("DeadCooldown", cooldownSchema);
            }
            // Find the character by its character_id and ethOwner
            let deadCooldown = await DeadCooldown.findOne({ character_id, ethOwner });
            // If the character does not exist, create a new one with the provided character_id and ethOwner
            if (!deadCooldown) {
                deadCooldown = new DeadCooldown({ character_id, cooldown, ethOwner });
            }
            // Update the character's cooldown value
            deadCooldown.cooldown = cooldown;
            // Save the updated character to the database
            await deadCooldown.save();
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
}
exports.default = updateCooldown;
