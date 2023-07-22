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
exports.setArenaTeamPosition = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const characterSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    owner: { type: String, required: true },
    arenaAttackPosition: { type: Number, default: -1 },
    arenaDefendPosition: { type: Number, default: -1 }
});
const modelName = 'ArenaCharacter';
let Character;
try {
    // Try to retrieve the model from Mongoose's internal cache
    Character = mongoose_1.default.model(modelName);
}
catch (error) {
    // If the model doesn't exist, create a new one
    Character = mongoose_1.default.model(modelName, characterSchema);
}
async function setArenaTeamPosition(characterID, team, position) {
    const update = team === 'attack' ? { arenaAttackPosition: position } : { arenaDefendPosition: position };
    const options = { new: true, upsert: true };
    const filter = { id: characterID };
    const result = await Character.findOneAndUpdate(filter, update, options);
    return result;
}
exports.setArenaTeamPosition = setArenaTeamPosition;
