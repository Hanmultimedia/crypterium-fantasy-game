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
exports.fetchSkillsByJob = void 0;
const MenuState_1 = require("../rooms/MenuState");
const mongoose_1 = __importStar(require("mongoose"));
const baseSkillSchema = new mongoose_1.Schema({
    uid: { type: String, required: true },
    des: { type: String, required: true },
    name: { type: String, required: true },
    level: { type: Number, required: true },
    jobRequired: { type: String, required: true },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now },
});
baseSkillSchema.pre('save', function (next) {
    this.updated_date = new Date();
    next();
});
async function fetchSkillsByJob(job) {
    /*const snapshot = await db.collection('Skill').get()
    const skills:any[] = []
    snapshot.forEach((doc) => {
      const data:any = doc.data()
      const skill = new Skill()
      skill.uid = doc.id
      skill.name = data.name
      if(data.jobRequired){
        skill.jobRequired = data.jobRequired
      }
      skill.level = data.level
      skill.des = data.des
      if(skill.jobRequired.includes(job)){
        skills.push(skill)
      }
  
    });*/
    //await mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
    const db = mongoose_1.default.connection;
    //db.on('error', console.error.bind(console, 'connection error:'));
    // we're connected!
    console.log("Connected with mongo to get skills");
    let SkillModel;
    try {
        SkillModel = mongoose_1.default.model('Skill');
    }
    catch (error) {
        SkillModel = mongoose_1.default.model('Skill', baseSkillSchema);
    }
    try {
        const skills_data = await SkillModel.find({ jobRequired: job });
        const skills = [];
        //console.log(skills_data)
        for (let i = 0; i < skills_data.length; i++) {
            const skill = new MenuState_1.Skill();
            skill.uid = skills_data[i].uid;
            skill.name = skills_data[i].name;
            skill.des = skills_data[i].des;
            if (skills_data[i].jobRequired) {
                skill.jobRequired.push(skills_data[i].jobRequired);
            }
            skill.level = skills_data[i].level;
            skills.push(skill);
        }
        //mongoose.connection.close()
        //console.log("return skills")
        //console.log(skills)
        return skills;
    }
    catch (err) {
        //console.log(err);
        return err;
        //mongoose.connection.close()
    }
}
exports.fetchSkillsByJob = fetchSkillsByJob;
