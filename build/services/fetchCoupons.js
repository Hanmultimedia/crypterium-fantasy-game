"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchCoupons = exports.userSchema = void 0;
const MenuState_1 = require("../rooms/MenuState");
const mongoose_1 = __importDefault(require("mongoose"));
exports.userSchema = new mongoose_1.default.Schema({
    eth: String,
    diamond: Number,
    coupon: Number,
    // other fields as required
});
async function fetchCoupons(eth) {
    let array = [];
    let c = new MenuState_1.Coupon();
    c.uid = "100001";
    c.quantity = 0;
    try {
        // Connect to MongoDB using your srv string
        //await mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
        // Define your user schema
        console.log("Fetch Coupon");
        // Create a model from the schema
        let User;
        try {
            User = mongoose_1.default.model('User');
        }
        catch (error) {
            User = mongoose_1.default.model('User', exports.userSchema);
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
        mongoose_1.default.connection.close();
        console.log(error);
        return array;
    }
    /*const snapshot = await db.collection('User').doc(eth).collection('Coupon').get()
    const coupons:any[] = []
    snapshot.forEach((doc) => {
      const data:any = doc.data()
      const coupon = new Coupon()
      coupon.uid = data.uid
      coupon.quantity = data.quantity
      if(!data.quantity)
      {
        coupon.quantity = 0
      }
      coupons.push(coupon)
    });
    return coupons*/
}
exports.fetchCoupons = fetchCoupons;
