"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setStamina = exports.userSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.userSchema = new mongoose_1.default.Schema({
    eth: String,
    diamond: Number,
    coupon: Number,
    profilepic: Number,
    profilename: String,
    coupon2: Number,
    stamina: Number
    // other fields as required
});
async function setStamina(eth) {
    try {
        let User;
        try {
            User = mongoose_1.default.model('User');
        }
        catch (error) {
            User = mongoose_1.default.model('User', exports.userSchema);
        }
        // Find the user based on the Ethereum address
        const user = await User.findOne({ eth: eth });
        if (user) {
            // Decrement stamina if greater than 0
            if (user.stamina > 0) {
                user.stamina -= 1;
                await user.save();
                return { success: true, message: 'Stamina decremented successfully.' };
            }
            else {
                return { success: false, message: 'Insufficient stamina.' };
            }
        }
        else {
            return { success: false, message: 'User not found.' };
        }
    }
    catch (error) {
        console.error('Error updating stamina:', error);
        return { success: false, message: 'An error occurred while updating stamina.' };
    }
}
exports.setStamina = setStamina;
