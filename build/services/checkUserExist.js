"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserExist = void 0;
const axios_1 = __importDefault(require("axios"));
const user_model_1 = require("./user.model");
async function checkUserExist(eth) {
    try {
        // Connect to MongoDB using your srv string
        //await mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
        // Define your user schema
        // Create a model from the schema
        // Use the model to query for a user with a matching eth address
        let user = await user_model_1.UserModel.findOne({ eth });
        // Close the Mongoose connection
        // If a user was found, return true
        if (user) {
            console.log(eth + " Exist");
            //mongoose.connection.close();
            return true;
        }
        else {
            // If no user was found, return false
            console.log(eth + " Not Exist");
            user = new user_model_1.UserModel({ eth: eth, diamond: 2000, coupon: 10 });
            await user.save();
            const totalUsers = await user_model_1.UserModel.countDocuments();
            //mongoose.connection.close();
            const response = await axios_1.default.post('https://support-api.crypterium.game/webhook/new-user-connect', {
                walletAddress: eth,
                totalUser: totalUsers
            });
            return false;
        }
    }
    catch (error) {
        console.log(error);
        return error;
    }
}
exports.checkUserExist = checkUserExist;
