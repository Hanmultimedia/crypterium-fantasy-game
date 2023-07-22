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
exports.createMonster = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const monsterPools_1 = require("./monsterPools");
const baseMonsterSchema = new mongoose_1.Schema({
    uid: { type: String, required: true },
    atk: { type: Number, required: true },
    def: { type: Number, required: true },
    name: { type: String, required: true },
    aspd: { type: Number, required: true },
    cri: { type: Number, required: true },
    exp: { type: Number, required: true },
    free: { type: Number, required: true },
    hit: { type: Number, required: true },
    hp: { type: Number, required: true },
    level: { type: Number, required: true },
    mAtk: { type: Number, required: true },
    mDef: { type: Number, required: true },
    range: { type: Number, required: true },
    speed: { type: Number, required: true },
    type: { type: String, required: true },
    vision: { type: Number, required: true },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now },
});
baseMonsterSchema.pre('save', function (next) {
    this.updated_date = new Date();
    next();
});
async function createMonster() {
    const monsterPools = (0, monsterPools_1.fetchMonsterPool)();
    // Connect to MongoDB using the SRV connection string
    //mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
    const connection = mongoose_1.default.connection;
    let newMonster;
    return new Promise((resolve, reject) => {
        connection.on('open', async () => {
            console.log("MongoDB database connection established successfully");
            //Define the schema for the "BaseMonster" collection
            // Create a model for the "BaseMonster" collection
            let BaseMonster;
            try {
                BaseMonster = mongoose_1.default.model('BaseMonster');
            }
            catch (error) {
                BaseMonster = mongoose_1.default.model('BaseMonster', baseMonsterSchema);
            }
            for (let i = 0; i < monsterPools.length; i++) {
                // Insert a new document into the "BaseMonster" collection
                newMonster = new BaseMonster(monsterPools[i]);
                await newMonster.save()
                    .then(() => {
                    if (i + 1 >= monsterPools.length) {
                        console.log("Create monsters successfully");
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
exports.createMonster = createMonster;
