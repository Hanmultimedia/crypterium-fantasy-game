"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enhanceCharacterStar = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const character_schema_1 = require("./character.schema");
const unEquipAllToCharacter_1 = require("../services/unEquipAllToCharacter");
const EnhancementLog_1 = require("./EnhancementLog");
const Character = mongoose_1.default.model('Character', character_schema_1.CharacterSchema);
const InventoryEquipment = mongoose_1.default.model('InventoryEquipment');
async function enhanceCharacterStar(eth, character1_id, character2_id, mode) {
    const character1 = await Character.findOne({ _id: character1_id });
    const character2 = await Character.findOne({ _id: character2_id });
    if (!character1 || !character2) {
        throw new Error('One or both characters not found');
    }
    // Cap character1's star value at 5 before incrementing
    if (character1.star < 5) {
        if (mode == "success")
            character1.star += 1;
    }
    else {
        console.log(`Character ${character1.name} (ID: ${character1_id}) is already at maximum stars.`);
        return { enhancedCharacter: character1, deletedCharacter: null };
    }
    await character1.save();
    // Unequip all equipment from character2 and delete them
    await (0, unEquipAllToCharacter_1.unEquipAllToCharacter)(eth, character2_id);
    // Delete character2 after unequipping equipment
    await Character.deleteOne({ _id: character2_id });
    console.log(`Character ${character1.name} (ID: ${character1_id}) enhanced successfully.`);
    console.log(`Character ${character2.name} (ID: ${character2_id}) deleted after enhancement.`);
    // Log the enhancement
    const enhancementLog = new EnhancementLog_1.EnhancementLog({
        character1_id: character1_id,
        character2_id: character2_id,
        eth: eth,
        enhancementDate: new Date()
    });
    await enhancementLog.save();
    return { enhancedCharacter: character1, deletedCharacter: character2 };
}
exports.enhanceCharacterStar = enhanceCharacterStar;
