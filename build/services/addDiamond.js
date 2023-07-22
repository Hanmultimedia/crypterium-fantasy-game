"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDiamond = exports.userSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.userSchema = new mongoose_1.default.Schema({
    eth: String,
    diamond: Number,
    coupon: Number,
    // other fields as required
});
async function addDiamond(eth, diamond) {
    if (!diamond)
        return;
    try {
        console.log("Fetch User To update Diamond");
        let User;
        try {
            User = mongoose_1.default.model('User');
        }
        catch (error) {
            User = mongoose_1.default.model('User', exports.userSchema);
        }
        // Use the model to query for a user with a matching eth address
        let user = await User.findOne({ eth });
        // If a user was found, return coupon
        if (user) {
            user.diamond += diamond;
            await user.save();
        }
    }
    catch (error) {
        console.log(error);
    }
}
exports.addDiamond = addDiamond;
