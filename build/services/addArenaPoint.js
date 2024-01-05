"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addArenaPoint = void 0;
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
async function addArenaPoint(amount, eth) {
    try {
        let User;
        try {
            User = mongoose_1.default.model('User');
        }
        catch (error) {
            User = mongoose_1.default.model('User', userSchema);
        }
        // Use the model to query for a user with a matching eth address
        const user = await User.findOne({ eth });
        // If a user was found, update their battlepoint
        if (user) {
            user.battlepoint = (user.battlepoint || 0) + amount;
            await user.save();
            console.log(`Added ${amount} to user's battlepoint`);
            return true;
        }
        else {
            // User not found, handle accordingly (create new user or return false)
            //console.log("User not found");
            return false;
        }
    }
    catch (error) {
        console.log(error);
        return false; // Or handle the error case as needed
    }
}
exports.addArenaPoint = addArenaPoint;
