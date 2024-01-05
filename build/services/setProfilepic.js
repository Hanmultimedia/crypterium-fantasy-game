"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setProfilepic = exports.userSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.userSchema = new mongoose_1.default.Schema({
    eth: String,
    diamond: Number,
    coupon: Number,
    profilepic: Number,
    profilename: String
    // other fields as required
});
async function setProfilepic(eth, profilepic) {
    try {
        // Connect to MongoDB using your srv string
        //await mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
        // Define your user schema
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
            user.profilepic = profilepic;
            await user.save();
            return 1;
        }
        else {
            //console.log("user not found " + eth)
            //mongoose.connection.close();
            return 0;
        }
    }
    catch (error) {
        console.log(error);
        return 0;
    }
    /*const doc = await db.collection('Wallet').doc(eth).get()
  
    if (doc.exists) {
      const diamond = doc.data()
      return diamond.diamond
    }*/
}
exports.setProfilepic = setProfilepic;
