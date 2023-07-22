"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStats = void 0;
const character_schema_1 = require("./character.schema");
const mongoose_1 = __importDefault(require("mongoose"));
async function updateStats(eth, characterID, points, stats) {
    //await mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
    const Character = mongoose_1.default.model('Character', character_schema_1.CharacterSchema);
    const updatedCharacter = await Character.findOneAndUpdate({ _id: characterID }, { $inc: {
            "attributes.str": stats[0],
            "attributes.dex": stats[1],
            "attributes.agi": stats[2],
            "attributes.int": stats[3],
            "attributes.vit": stats[4],
            "attributes.luk": stats[5],
            "statPoint": -points
        } }, { new: true });
    //mongoose.connection.close()
    //const character = await fetchCharacterByDocID(characterID)
    /*character.statPoint -= points
  
    character.attributes.str += stats[0]
    character.attributes.dex += stats[1]
    character.attributes.agi += stats[2]
    character.attributes.int += stats[3]
    character.attributes.vit += stats[4]
    character.attributes.luk += stats[5]
  
    const result = await db.collection('Character').doc(characterID).set(character)*/
    //const result = await db.collection('Character').doc(characterID).set({
    //    team1 : index
    //}, {merge: true})*/
    //add more team in the future
    return updatedCharacter;
}
exports.updateStats = updateStats;
