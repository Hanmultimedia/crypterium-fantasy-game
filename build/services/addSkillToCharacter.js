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
exports.addSkillToCharacter = exports.userSchema = void 0;
const fetchSkills_1 = require("../services/fetchSkills");
const fetchDiamond_1 = require("./fetchDiamond");
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
baseSkillSchema.pre('save', function (next) {
    this.updated_date = new Date();
    next();
});
async function addSkillToCharacter(eth, character_id, skill_id) {
    let diamonds = await (0, fetchDiamond_1.fetchDiamond)(eth);
    const price = [
        100,
        140,
        180,
        220,
        260,
        300,
        340,
        380,
        420
    ];
    if (diamonds >= price[0]) {
        const skills = await (0, fetchSkills_1.fetchSkills)();
        const skill = skills.find((c) => c.uid == skill_id);
        let s = {
            uid: skill.uid,
            level: 1,
            name: skill.name,
            jobRequired: skill.jobRequired
        };
        //await mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
        const db = mongoose_1.default.connection;
        //db.on('error', console.error.bind(console, 'connection error:'));
        /////////////////////////
        //Add potion section
        console.log("Check skill inventory");
        let Inventory;
        try {
            Inventory = mongoose_1.default.model("Character_Skill");
        }
        catch (error) {
            Inventory = mongoose_1.default.model("Character_Skill", CharacterSkillSchema);
        }
        let updatedInventory = await Inventory.findOne({ character_id: character_id });
        if (updatedInventory) {
            console.log("Update skill in inventory");
            if (!updatedInventory.skills) {
                console.log("No Skill Field");
                updatedInventory.skills = new Map();
            }
            if (!updatedInventory.skills.has(skill.uid)) {
                console.log("Skill Field but no skill");
                updatedInventory.skills.set(skill.uid, { uid: skill.uid, level: 1, name: skill.name, jobRequired: skill.jobRequired });
            }
            await updatedInventory.save();
        }
        else {
            console.log("Create New Skill");
            let BaseSkillModel;
            try {
                BaseSkillModel = mongoose_1.default.model("SkillInventory");
            }
            catch (error) {
                BaseSkillModel = mongoose_1.default.model("SkillInventory", baseSkillSchema);
            }
            const newSkill = new BaseSkillModel({ uid: skill.uid, level: 1, name: skill.name, jobRequired: skill.jobRequired });
            updatedInventory = await Inventory.create({
                character_id: character_id,
                skills: new Map([[skill.uid, { uid: skill.uid, level: 1, name: skill.name, jobRequired: skill.jobRequired }]])
            });
        }
        console.log("Finish buy skill");
        /////////////////////////
        try {
            // Connect to MongoDB using your srv string
            // Define your user schema
            console.log("Fetch User To update Diamond");
            // Create a model from the schema
            let User;
            try {
                User = mongoose_1.default.model('User');
            }
            catch (error) {
                User = mongoose_1.default.model('User', exports.userSchema);
            }
            // Use the model to query for a user with a matching eth address
            let user = await User.findOne({ eth: eth });
            // If a user was found, return coupon
            if (user) {
                user.diamond -= price[0];
                await user.save();
            }
        }
        catch (error) {
            console.log(error);
        }
        //
        //mongoose.connection.close()
        //console.log(character_id + " buy skill " + skill_id)
        //await db.collection('Character_Skill').doc(character_id).collection("Skill").doc(s.uid).set(s)
        //await db.collection('Wallet').doc(eth).set({
        //diamond: firestore.FieldValue.increment(-price[0])
        //}, {merge: true})
    }
    //return null
}
exports.addSkillToCharacter = addSkillToCharacter;
