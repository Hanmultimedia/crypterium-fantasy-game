"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingTeamsTreasure = exports.settingTeams = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const character_schema_1 = require("./character.schema");
const Character = mongoose_1.default.model('Character', character_schema_1.CharacterSchema);
async function settingTeams(characterID, index) {
    //await mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
    const db = mongoose_1.default.connection;
    //db.on('error', console.error.bind(console, 'connection error:'));
    console.log("characterID" + characterID);
    const result = await Character.findOneAndUpdate({ _id: characterID }, { $set: { team1: index } }, { new: true });
    return result;
}
exports.settingTeams = settingTeams;
async function settingTeamsTreasure(characterID, index, team) {
    //await mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
    const update = {};
    if (team == 1) {
        update["treasure1"] = index;
        update["treasure2"] = -1;
        update["treasure3"] = -1;
    }
    if (team == 2) {
        update["treasure1"] = -1;
        update["treasure2"] = index;
        update["treasure3"] = -1;
    }
    if (team == 3) {
        update["treasure1"] = -1;
        update["treasure2"] = -1;
        update["treasure3"] = index;
    }
    // Similarly for other cases of team
    const result = await Character.findOneAndUpdate({ _id: characterID }, { $set: update }, { new: true });
    return result;
}
exports.settingTeamsTreasure = settingTeamsTreasure;
/*export async function settingTeamsTreasure(characterID:string, index: number , team:number): Promise<any> {

  if(team == 1)
  {

    const result = await db.collection('Character').doc(characterID).set({
      treasure1 : index,
      treasure2 : -1,
      treasure3 : -1
    }, {merge: true})

  }

  if(team == 2)
  {

    const result = await db.collection('Character').doc(characterID).set({
      treasure1 : -1,
      treasure2 : index,
      treasure3 : -1
    }, {merge: true})

  }

    if(team == 3)
  {

    const result = await db.collection('Character').doc(characterID).set({
      treasure1 : -1,
      treasure2 : -1,
      treasure3 : index
    }, {merge: true})

  }
  //add more team in the future

  return null
}*/ 
