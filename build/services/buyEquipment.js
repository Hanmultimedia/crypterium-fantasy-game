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
exports.buyEquipment = exports.InventoryEquipmentSchema = exports.EquipmentSchema = exports.userSchema = void 0;
const fetchDiamond_1 = require("./fetchDiamond");
const fetchEquipments_1 = require("../services/fetchEquipments");
const MenuState_1 = require("../rooms/MenuState");
const mongoose_1 = __importStar(require("mongoose"));
exports.userSchema = new mongoose_1.default.Schema({
    eth: String,
    diamond: Number,
    coupon: Number,
    // other fields as required
});
exports.EquipmentSchema = new mongoose_1.Schema({
    uid: { type: String, required: true },
    quantity: { type: Number, required: true },
});
const EquipmentModel = mongoose_1.default.model('EquipmentInventory', exports.EquipmentSchema, 'EquipmentInventory');
exports.InventoryEquipmentSchema = new mongoose_1.Schema({
    eth: { type: String, required: true },
    equipments: {
        type: Map,
        of: {
            uid: { type: String, required: true },
            quantity: { type: Number, required: true }
        }
    }
});
//export const InventoryEquipment = mongoose.model('InventoryEquipment', InventoryEquipmentSchema , 'InventoryEquipment');    
async function buyEquipment(eth, equipment_uid, amount) {
    let diamonds = await (0, fetchDiamond_1.fetchDiamond)(eth);
    const equipments = await (0, fetchEquipments_1.fetchEquipments)();
    const equipment = equipments.find(e => e.uid === equipment_uid);
    const e = new MenuState_1.Equipment_Inventory();
    e.uid = equipment.uid;
    const price = equipment.price * amount;
    const result = [];
    if (diamonds >= price) {
        console.log(eth + " buy equipment " + equipment_uid);
        //
        try {
            // Define your user schema
            console.log("Fetch User To update Diamond");
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
        //
        result["diamond"] = diamonds - price;
        result["equipment"] = e;
        result["amount"] = amount;
        //
        console.log("Check equipment inventory");
        let InventoryEquipment;
        try {
            InventoryEquipment = mongoose_1.default.model('InventoryEquipment');
        }
        catch (error) {
            InventoryEquipment = mongoose_1.default.model('InventoryEquipment', exports.InventoryEquipmentSchema);
        }
        let updatedInventory = await InventoryEquipment.findOne({ eth: eth });
        if (updatedInventory) {
            console.log("Update in inventory");
            if (!updatedInventory.equipments) {
                updatedInventory.equipments = new Map();
            }
            if (!updatedInventory.equipments.has(equipment.uid)) {
                updatedInventory.equipments.set(equipment.uid, { uid: equipment.uid, quantity: 0 });
            }
            updatedInventory.equipments.get(equipment.uid).quantity += amount;
            await updatedInventory.save();
        }
        else {
            console.log("Create New Equipment");
            const newEquipment = new EquipmentModel({ uid: equipment.uid, quantity: amount });
            updatedInventory = await InventoryEquipment.create({
                eth: eth,
                equipments: new Map([[newEquipment.uid, { uid: newEquipment.uid, quantity: newEquipment.quantity }]])
            });
        }
        console.log("Finish buy equipment");
        //mongoose.connection.close();
        return result;
        //
    }
    else {
        result["diamond"] = diamonds;
        result["equipment"] = e;
        result["amount"] = 0;
        return result;
    }
}
exports.buyEquipment = buyEquipment;
