"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchCharacterByDocID = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const character_schema_1 = require("./character.schema");
async function fetchCharacterByDocID(characterID) {
    //await mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
    const Character = mongoose_1.default.model('Character', character_schema_1.CharacterSchema);
    const updatedCharacter = await Character.findOne({ _id: characterID });
    //mongoose.connection.close()
    return updatedCharacter;
}
exports.fetchCharacterByDocID = fetchCharacterByDocID;
