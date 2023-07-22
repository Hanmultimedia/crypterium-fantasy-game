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
exports.addPotion = exports.userSchema = void 0;
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
async function addPotion(eth, amount) {
    if (!amount)
        return;
    const potion_uid = "1003";
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
    const result = [];
    const p2 = new MenuState_1.Potion_Inventory();
    p2.uid = potion.uid;
    p2.amount = amount;
    result["potion"] = p2;
    result["amount"] = amount;
    //Add potion section
    let Inventory;
    try {
        Inventory = mongoose_1.default.model("Inventory");
    }
    catch (error) {
        Inventory = mongoose_1.default.model("Inventory", InventorySchema);
    }
    let updatedInventory = await Inventory.findOne({ eth: eth });
    if (updatedInventory) {
        console.log("Update in inventory");
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
        console.log("Create New Potion");
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
    console.log("Finish add potion reward");
    //mongoose.connection.close();
    return result;
}
exports.addPotion = addPotion;
