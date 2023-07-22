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
exports.createSkill = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const skillPools_1 = require("./skillPools");
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
async function createSkill() {
    const skillPools = (0, skillPools_1.fetchSkillPool)();
    // Connect to MongoDB using the SRV connection string
    //mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
    const connection = mongoose_1.default.connection;
    return new Promise((resolve, reject) => {
        connection.on('open', async () => {
            console.log("MongoDB database connection established successfully");
            //Define the schema for the "BaseMonster" collection
            // Create a model for the "BaseMonster" collection
            let Skill;
            try {
                Skill = mongoose_1.default.model('Skill');
            }
            catch (error) {
                Skill = mongoose_1.default.model('Skill', baseSkillSchema);
            }
            for (let i = 0; i < skillPools.length; i++) {
                const newSkill = new Skill(skillPools[i]);
                await newSkill.save()
                    .then(() => {
                    if (i + 1 >= skillPools.length) {
                        //console.log("Create monsters successfully")
                        resolve("success");
                        //connection.close();
                    }
                })
                    .catch(err => {
                    console.log(err);
                    reject(err);
                    //connection.close();
                });
            }
        });
    });
}
exports.createSkill = createSkill;
