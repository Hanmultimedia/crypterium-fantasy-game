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
exports.unEquipToCharacter = exports.InventoryEquipmentSchema = exports.EquipmentSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const character_schema_1 = require("./character.schema");
exports.EquipmentSchema = new mongoose_1.Schema({
    uid: { type: String, required: true },
    quantity: { type: Number, required: true },
});
const Character = mongoose_1.default.model('Character', character_schema_1.CharacterSchema);
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
const InventoryEquipment = mongoose_1.default.model('InventoryEquipment');
async function unEquipToCharacter(eth, character_id, equipment_uid, slot) {
    console.log("UnEquip " + equipment_uid + " to " + character_id);
    let inventory = await InventoryEquipment.findOne({ eth: eth });
    if (inventory) {
        console.log("Update in inventory");
        if (!inventory.equipments) {
            inventory.equipments = new Map();
        }
        if (!inventory.equipments.has(equipment_uid)) {
            inventory.equipments.set(equipment_uid, { uid: equipment_uid, quantity: 0 });
        }
        inventory.equipments.get(equipment_uid).quantity += 1;
        await inventory.save();
    }
    //InventoryEquipment.equipments.set(equipment_uid, { uid: equipment_uid, quantity: -1 });
    const update = {};
    update[`equipments.slot_${slot}`] = "";
    const character = await Character.findOneAndUpdate({ _id: character_id }, { $set: update }, { new: true });
    if (!character) {
        throw new Error('Character not found');
    }
    return character;
}
exports.unEquipToCharacter = unEquipToCharacter;
