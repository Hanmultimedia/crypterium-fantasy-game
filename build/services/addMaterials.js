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
exports.addMaterials = exports.userSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.userSchema = new mongoose_1.default.Schema({
    eth: String,
    diamond: Number,
    coupon: Number,
    // other fields as required
});
const MaterialsSchema = new mongoose_1.Schema({
    uid: { type: String, required: true },
    quantity: { type: Number, required: true }
});
const InventorySchema = new mongoose_1.Schema({
    eth: { type: String, required: true },
    materials: {
        type: Map,
        of: {
            uid: { type: String, required: true },
            quantity: { type: Number, required: true }
        }
    }
});
async function addMaterials(eth, mat_uid, amount) {
    const result = [];
    //Add Material section
    console.log("Check Material inventory");
    let Inventory;
    try {
        Inventory = mongoose_1.default.model("InventoryMaterial");
    }
    catch (error) {
        Inventory = mongoose_1.default.model("InventoryMaterial", InventorySchema);
    }
    let updatedInventory = await Inventory.findOne({ eth: eth });
    if (updatedInventory) {
        console.log("Update Material in inventory");
        if (!updatedInventory.materials) {
            updatedInventory.materials = new Map();
        }
        if (!updatedInventory.materials.has(mat_uid)) {
            updatedInventory.materials.set(mat_uid, { uid: mat_uid, quantity: 0 });
        }
        updatedInventory.materials.get(mat_uid).quantity += amount;
        await updatedInventory.save();
    }
    else {
        console.log("Create New Materials");
        let MaterialsModel;
        try {
            MaterialsModel = mongoose_1.default.model("Materials");
        }
        catch (error) {
            MaterialsModel = mongoose_1.default.model("Materials", MaterialsSchema);
        }
        const newMaterials = new MaterialsModel({ uid: mat_uid, quantity: amount });
        updatedInventory = await Inventory.create({
            eth: eth,
            materials: new Map([[mat_uid, { uid: mat_uid, quantity: newMaterials.quantity }]])
        });
    }
    console.log("Finish add materials");
    //mongoose.connection.close();
    return true;
}
exports.addMaterials = addMaterials;
