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
class getCooldown {
    static async get(character_id) {
        try {
            let DeadCooldown;
            try {
                DeadCooldown = mongoose_1.default.model("DeadCooldown");
            }
            catch (error) {
                DeadCooldown = mongoose_1.default.model("DeadCooldown", cooldownSchema);
            }
            // Find the cooldown by its character_id
            const deadCooldown = await DeadCooldown.findOne({ character_id });
            // If the cooldown exists, return its value
            if (deadCooldown) {
                return deadCooldown.cooldown;
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
exports.default = getCooldown;
