"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchCoupons = void 0;
const MenuState_1 = require("../rooms/MenuState");
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
async function fetchCoupons(eth) {
    let array = [];
    let c = new MenuState_1.Coupon();
    c.uid = "100001";
    c.quantity = 0;
    try {
        // Define your user schema
        console.log("Fetch Coupon");
        // Create a model from the schema
        let User;
        try {
            User = mongoose_1.default.model('User');
        }
        catch (error) {
            User = mongoose_1.default.model('User', userSchema);
        }
        // Use the model to query for a user with a matching eth address
        let user = await User.findOne({ eth: eth });
        // If a user was found, return coupon
        if (user) {
            const coupon = user.coupon;
            // Close the Mongoose connection
            //mongoose.connection.close();
            c.quantity = coupon;
            array.push(c);
            console.log("user have " + coupon + " coupon");
            return array;
        }
        else {
            console.log("user not found");
            // mongoose.connection.close();
            array.push(c);
            return array;
        }
    }
    catch (error) {
        console.log(error);
        return array;
    }
}
exports.fetchCoupons = fetchCoupons;
