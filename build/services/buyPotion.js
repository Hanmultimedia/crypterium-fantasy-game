"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyPotion = exports.userSchema = void 0;
const fetchDiamond_1 = require("./fetchDiamond");
const itemPotionPools_1 = require("../services/itemPotionPools");
const MenuState_1 = require("../rooms/MenuState");
const mongoose_1 = __importStar(require("mongoose"));
exports.userSchema = new mongoose_1.default.Schema({
    eth: String,
    diamond: Number,
    coupon: Number,
    // other fields as required
});
const PotionSchema = new mongoose_1.Schema({
    uid: { type: String, required: true },
    quantity: { type: Number, required: true }
});
const InventorySchema = new mongoose_1.Schema({
    eth: { type: String, required: true },
    potions: {
        type: Map,
        of: {
            uid: { type: String, required: true },
            quantity: { type: Number, required: true }
        }
    }
});
async function buyPotion(eth, potion_uid, amount) {
    let diamonds = await (0, fetchDiamond_1.fetchDiamond)(eth);
    const potions = await (0, itemPotionPools_1.fetchItemPotionPools)();
    const p = potions.find(p => p.uid === potion_uid);
    const potion = new MenuState_1.Potion();
    potion.uid = p.uid;
    potion.type = p.type;
    potion.name = p.name;
    potion.effect = p.effect;
    potion.effect_type = p.effect_type;
    potion.effect_amount = p.effect_amount;
    potion.sprite = p.sprite;
    potion.price = p.price;
    const price = potion.price * amount;
    //console.log(eth + " buy potion " + potion.uid + " buy amount " + amount +" total price " + price + " have diamond " + diamonds)
    const result = [];
    if (diamonds >= price) {
        //Diamond section
        try {
            // Connect to MongoDB using your srv string
            //await mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
            // Define your user schema
            //console.log("Fetch User To update Diamond")
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
                user.diamond -= price;
                await user.save();
            }
        }
        catch (error) {
            console.log(error);
        }
        //End Diamond section
        const p = new MenuState_1.Potion_Inventory();
        p.uid = potion.uid;
        p.amount = amount;
        result["diamond"] = diamonds - price;
        result["potion"] = p;
        result["amount"] = amount;
        //Add potion section
        //console.log("Check potion inventory")
        let Inventory;
        try {
            Inventory = mongoose_1.default.model("Inventory");
        }
        catch (error) {
            Inventory = mongoose_1.default.model("Inventory", InventorySchema);
        }
        let updatedInventory = await Inventory.findOne({ eth: eth });
        if (updatedInventory) {
            //console.log("Update in inventory")
            if (!updatedInventory.potions) {
                updatedInventory.potions = new Map();
            }
            if (!updatedInventory.potions.has(potion.uid)) {
                updatedInventory.potions.set(potion.uid, { uid: potion.uid, quantity: 0 });
            }
            updatedInventory.potions.get(potion.uid).quantity += amount;
            await updatedInventory.save();
        }
        else {
            //console.log("Create New Potion")
            let PotionModel;
            try {
                PotionModel = mongoose_1.default.model("Potion");
            }
            catch (error) {
                PotionModel = mongoose_1.default.model("Potion", PotionSchema);
            }
            const newPotion = new PotionModel({ uid: potion.uid, quantity: amount });
            updatedInventory = await Inventory.create({
                eth: eth,
                potions: new Map([[newPotion.uid, { uid: newPotion.uid, quantity: newPotion.quantity }]])
            });
        }
        console.log("Finish buy potion " + eth + " " + potion_uid + " " + amount);
        //mongoose.connection.close();
        return result;
    }
    else {
        //console.log("Check potion inventory Error")
        result["diamond"] = diamonds;
        result["potion"] = potion;
        result["amount"] = 0;
        mongoose_1.default.connection.close();
        return result;
    }
}
exports.buyPotion = buyPotion;
