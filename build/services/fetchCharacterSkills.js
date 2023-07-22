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
exports.fetchCharacterSkills = exports.userSchema = void 0;
const MenuState_1 = require("../rooms/MenuState");
const mongoose_1 = __importStar(require("mongoose"));
exports.userSchema = new mongoose_1.default.Schema({
    eth: String,
    diamond: Number,
    coupon: Number,
    // other fields as required
});
const baseSkillSchema = new mongoose_1.Schema({
    uid: { type: String, required: true },
    des: { type: String, required: true },
    name: { type: String, required: true },
    level: { type: Number, required: true },
    jobRequired: { type: String, required: true },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now },
});
const CharacterSkillSchema = new mongoose_1.Schema({
    character_id: { type: String, required: true },
    skills: {
        type: Map,
        of: {
            uid: { type: String, required: true },
            name: { type: String, required: true },
            level: { type: Number, required: true },
            jobRequired: { type: String, required: true }
        }
    },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now },
});
CharacterSkillSchema.pre('save', function (next) {
    this.updated_date = new Date();
    next();
});
baseSkillSchema.pre('save', function (next) {
    this.updated_date = new Date();
    next();
});
async function fetchCharacterSkills(character_id, job) {
    //await mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
    const db = mongoose_1.default.connection;
    //db.on('error', console.error.bind(console, 'connection error:'));
    // we're connected!
    console.log("Connected with mongo to get character skills");
    let Inventory;
    try {
        Inventory = mongoose_1.default.model('Character_Skill');
    }
    catch (error) {
        Inventory = mongoose_1.default.model('Character_Skill', CharacterSkillSchema);
    }
    try {
        const skills = [];
        const skills_data = await Inventory.find({ character_id: character_id });
        //console.log("Skill Data")
        //console.log(skills_data)
        for (let i = 0; i < skills_data.length; i++) {
            for (const key of skills_data[i].skills.keys()) {
                const skill = new MenuState_1.Skill_Character();
                const s = skills_data[i].skills.get(key);
                skill.uid = s.uid;
                skill.name = s.name;
                skill.level = s.level;
                skills.push(skill);
            }
        }
        //mongoose.connection.close()
        //console.log("return character skills")
        //console.log(skills)
        return skills;
    }
    catch (err) {
        console.log(err);
        //mongoose.connection.close()
        return err;
    }
    /*const snapshot = await db.collection('Character_Skill').doc(character_id).collection('Skill').get()
    const skills:any[] = []
  
    snapshot.forEach((doc) => {
      const data:any = doc.data()
      let skill = new Skill_Character()
      skill.uid = doc.id
      skill.name = data.name
      skill.level = data.level
      console.log(job)
      console.log(data)
      let passRequirement = false
      if(job == "Archer" && data.jobRequired[0]=="Archer")
      {
          passRequirement = true
      }
  
      if(job == "Magician" && data.jobRequired[0]=="Magician")
      {
          passRequirement = true
      }
  
      if(job == "Swordman" && data.jobRequired[0]=="Swordman")
      {
          passRequirement = true
      }
  
      if(job == "Acolyte" && data.jobRequired[0]=="Acolyte")
      {
          passRequirement = true
      }
  
      if(job == "Lancer" && data.jobRequired[0]=="Lancer")
      {
          passRequirement = true
      }
  
      if(passRequirement){
        skills.push(skill)
      }
  
    });*/
    //return skills
}
exports.fetchCharacterSkills = fetchCharacterSkills;
