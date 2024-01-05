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
exports.unEquipAllToCharacter = exports.InventoryEquipmentSchema = exports.EquipmentSchema = void 0;
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
async function unEquipAllToCharacter(eth, character_id) {
    const character = await Character.findOne({ _id: character_id });
    if (!character) {
        throw new Error('Character not found');
    }
    let inventory = await InventoryEquipment.findOne({ eth: eth });
    if (!inventory) {
        inventory = new InventoryEquipment({ eth: eth, equipments: new Map() });
    }
    for (let i = 0; i <= 8; i++) {
        const slotKey = `slot_${i}`;
        const equipment_uid = character[slotKey];
        if (equipment_uid) {
            // Increment the quantity of the equipment in inventory (assuming +1 is for unequipping)
            if (!inventory.equipments.has(equipment_uid)) {
                inventory.equipments.set(equipment_uid, { uid: equipment_uid, quantity: 0 });
            }
            inventory.equipments.get(equipment_uid).quantity += 1;
            // Unequip the equipment from the character by clearing the slot
            await Character.updateOne({ _id: character_id }, { $set: { [slotKey]: "" } });
        }
    }
    await inventory.save();
    return character;
}
exports.unEquipAllToCharacter = unEquipAllToCharacter;
