"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchArenaStamina = void 0;
const user_model_1 = require("./user.model");
async function fetchArenaStamina(eth) {
    try {
        // Use the model to query for a user with a matching eth address
        let user = await user_model_1.UserModel.findOne({ eth: eth });
        // If a user was found, return coupon
        if (user) {
            if (user.arenastamina) {
                return user.arenastamina;
            }
            else {
                return 5;
            }
        }
        else {
            user.arenastamina = 0;
            // mongoose.connection.close();
            return 0;
        }
    }
    catch (error) {
        console.log(error);
        return 0;
    }
}
exports.fetchArenaStamina = fetchArenaStamina;
