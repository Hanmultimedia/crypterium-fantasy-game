"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCoin = exports.userSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.userSchema = new mongoose_1.default.Schema({
    eth: String,
    doge: Number,
    bit: Number,
    coin: Number
    // other fields as required
});
async function addCoin(eth, type) {
    let state = 0;
    try {
        let User;
        try {
            User = mongoose_1.default.model('UserCoin');
        }
        catch (error) {
            User = mongoose_1.default.model('UserCoin', exports.userSchema);
        }
        // Use the model to query for a user with a matching eth address
        let user = await User.findOne({ eth });
        if (!user) {
            user = new User({
                eth,
                doge: 0,
                bit: 0,
                coin: 0
            });
        }
        if (type === "boss") {
            if (Math.random() < 0.01) {
                user.bit += 0.000001;
                state = 1;
            }
            else if (Math.random() < 0.01) {
                user.doge += 0.000001;
                state = 2;
            }
        }
        else {
            if (Math.random() < 0.05) {
                const coin = (Math.random() * (1 - 0.5) + 0.5).toFixed(6);
                user.coin += parseFloat(coin);
                state = parseFloat(coin);
            }
        }
        await user.save();
        return state;
    }
    catch (error) {
        console.log(error);
        return state;
    }
}
exports.addCoin = addCoin;
