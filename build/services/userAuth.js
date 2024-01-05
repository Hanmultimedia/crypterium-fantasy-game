"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOnlineStatus = exports.userNonAuth = exports.userAuth = exports.userSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.userSchema = new mongoose_1.default.Schema({
    eth: String,
    status: Boolean
    // other fields as required
});
async function userAuth(eth) {
    try {
        let User;
        try {
            User = mongoose_1.default.model('UserAuth');
        }
        catch (error) {
            User = mongoose_1.default.model('UserAuth', exports.userSchema);
        }
        // Use the model to query for a user with a matching eth address
        try {
            let user = await User.findOne({ eth });
            if (!user) {
                user = new User({
                    eth,
                    status: true,
                });
                await user.save();
            }
            // Rest of your code
        }
        catch (error) {
            console.error("Error while querying the database:", error);
            // Handle the error as needed
        }
    }
    catch (error) {
        console.log(error);
    }
}
exports.userAuth = userAuth;
async function userNonAuth(eth) {
    try {
        let User;
        try {
            User = mongoose_1.default.model('UserAuth');
        }
        catch (error) {
            User = mongoose_1.default.model('UserAuth', exports.userSchema);
        }
        // Use the model to query for a user with a matching eth address
        let user = await User.findOne({ eth });
        if (user) {
            user.status = false;
        }
        await user.save();
    }
    catch (error) {
        console.log(error);
    }
}
exports.userNonAuth = userNonAuth;
async function getOnlineStatus(eth) {
    try {
        let User;
        try {
            User = mongoose_1.default.model('UserAuth');
        }
        catch (error) {
            User = mongoose_1.default.model('UserAuth', exports.userSchema);
        }
        // Use the model to query for a user with a matching eth address
        let user = await User.findOne({ eth });
        if (user) {
            return user.status;
        }
        return false;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}
exports.getOnlineStatus = getOnlineStatus;
