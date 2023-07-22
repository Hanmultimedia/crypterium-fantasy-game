"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchDiamond = exports.userSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.userSchema = new mongoose_1.default.Schema({
    eth: String,
    diamond: Number,
    coupon: Number,
    // other fields as required
});
async function fetchDiamond(eth) {
    try {
        // Connect to MongoDB using your srv string
        //await mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
        // Define your user schema
        console.log("Fetch Diamond");
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
            // Close the Mongoose connection
            const diamond = user.diamond;
            //mongoose.connection.close();
            console.log("user have " + diamond + " diamond");
            return diamond;
        }
        else {
            console.log("user not found");
            //mongoose.connection.close();
            return 0;
        }
    }
    catch (error) {
        mongoose_1.default.connection.close();
        console.log(error);
        return 0;
    }
    /*const doc = await db.collection('Wallet').doc(eth).get()
  
    if (doc.exists) {
      const diamond = doc.data()
      return diamond.diamond
    }*/
}
exports.fetchDiamond = fetchDiamond;
