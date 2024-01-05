"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchBattleRank = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    eth: String,
    diamond: Number,
    coupon: Number,
    coupon2: Number,
    profilename: String,
    profilepic: Number,
    stamina: Number,
    battlepoint: { type: Number, default: 0 }
    // other fields as required
});
async function fetchBattleRank(eth) {
    try {
        let User;
        // Check if the model already exists
        if (mongoose_1.default.models.User) {
            User = mongoose_1.default.model('User');
        }
        else {
            // Create a new model if it doesn't exist
            User = mongoose_1.default.model('User', userSchema);
        }
        // Find the user's battlepoint
        const currentUser = await User.findOne({ eth });
        if (!currentUser) {
            throw new Error('User not found');
        }
        const userBattlePoint = currentUser.battlepoint || 0;
        // Count users with higher battlepoints to determine the rank
        const higherRankedUsersCount = await User.countDocuments({ battlepoint: { $gt: userBattlePoint } });
        // The user's rank is the count of higher-ranked users + 1 (to account for zero-based indexing)
        const userRank = higherRankedUsersCount + 1;
        return userRank;
    }
    catch (error) {
        console.error(error);
        return -1; // Return an error code or handle the error case as needed
    }
}
exports.fetchBattleRank = fetchBattleRank;
