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
exports.fetchMaterialsInventory = void 0;
const mongoose_1 = __importStar(require("mongoose"));
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
const Inventory = mongoose_1.default.model('InventoryMaterial', InventorySchema);
async function fetchMaterialsInventory(eth) {
    const inventory = await Inventory.findOne({ eth: eth });
    console.log("Your InventoryMaterial");
    console.log(inventory);
    let filteredMaterials = [];
    if (!inventory) {
        return filteredMaterials;
    }
    inventory.materials.forEach((materials) => {
        console.log(materials);
        if (materials.quantity > 0) {
            let m = [];
            m["uid"] = materials.uid;
            m["amount"] = materials.quantity;
            filteredMaterials.push(m);
        }
    });
    console.log("filtered Materials");
    console.log(filteredMaterials);
    return filteredMaterials;
}
exports.fetchMaterialsInventory = fetchMaterialsInventory;
