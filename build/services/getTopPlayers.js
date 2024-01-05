"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopPlayers = void 0;
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
const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
async function getTopPlayers() {
    try {
        let User;
        try {
            User = mongoose_1.default.model('User');
        }
        catch (error) {
            User = mongoose_1.default.model('User', userSchema);
        }
        const topPlayers = await User.find({}, 'eth battlepoint') // Retrieve only eth and battlepoint fields
            .sort({ battlepoint: -1 }) // Sort by battlepoint in descending order
            .limit(5); // Limit to 5 results
        return topPlayers.map((player) => ({
            eth: player.eth,
            battlepoint: player.battlepoint || 0, // Get a random number if battlepoint is not set
        }));
    }
    catch (error) {
        console.log(error);
        return []; // Or handle the error case as needed
    }
}
exports.getTopPlayers = getTopPlayers;
