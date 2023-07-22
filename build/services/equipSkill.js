"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.equipSkill = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const character_schema_1 = require("./character.schema");
const Character = mongoose_1.default.model('Character', character_schema_1.CharacterSchema);
async function equipSkill(eth, character_id, skill_uid, slot) {
    const db = mongoose_1.default.connection;
    console.log("Character " + character_id + " Equip skill" + skill_uid);
    const character = await Character.findOne({ _id: character_id });
    if (!character) {
        throw new Error("Character not found");
    }
    const skill_equip = character.skill_equip;
    skill_equip[slot] = skill_uid;
    await Character.findOneAndUpdate({ _id: character_id }, { $set: { skill_equip } }, { new: true });
    return null;
}
exports.equipSkill = equipSkill;
