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
exports.fetchCharactersOld = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const character_schema_1 = require("./character.schema");
const CharacterOldSchema = new mongoose_1.default.Schema({
    level: { type: Number, required: true },
    rarity: { type: String, required: true },
    name: { type: String, required: true },
    job: { type: String, required: true },
    uid: { type: String, required: true },
    range: { type: Number, required: true },
    bonus: { type: mongoose_1.Schema.Types.Mixed, required: true },
    cbt: { type: Boolean, required: true },
    ethAddress: { type: String, required: true },
    _created_at: { type: Date, default: Date.now },
    _updated_at: { type: Date, default: Date.now },
    str: { type: Number, required: true },
    agi: { type: Number, required: true },
    int: { type: Number, required: true },
    vit: { type: Number, required: true },
    dex: { type: Number, required: true },
    luk: { type: Number, required: true },
    spMax: { type: Number, required: true },
    hpMax: { type: Number, required: true },
    spd: { type: Number, required: true }
});
class CharacterTemplate {
    constructor(attributes, job, uid, slug, position, level, hp, sp, speed, range) {
        this.attributes = attributes;
        this.job = job;
        this.uid = uid;
        this.slug = slug;
        this.position = position;
        this.level = level;
        this.hp = hp;
        this.sp = sp;
        this.speed = speed;
        this.range = range;
    }
}
async function fetchCharactersOld(eth) {
    const db = mongoose_1.default.connection;
    const summonList = [];
    // we're connected!
    console.log("Connected with mongo to get characters " + eth);
    let CharacterModel;
    try {
        CharacterModel = mongoose_1.default.model('CBTCharacter');
    }
    catch (error) {
        CharacterModel = mongoose_1.default.model('CBTCharacter', CharacterOldSchema);
    }
    try {
        const characters_data = await CharacterModel.find({});
        console.log("have CBT character " + characters_data.length);
        const characters = [];
        console.log(characters_data);
        for (let i = 0; i < characters_data.length; i++) {
            const data = characters_data[i];
            //data
            const bonus = data.bonus;
            const attributes = {
                str: data.str,
                agi: data.agi,
                int: data.int,
                vit: data.vit,
                dex: data.dex,
                luk: data.luk,
            };
            const equipments = {
                slot_0: "",
                slot_1: "",
                slot_2: "",
                slot_3: "",
                slot_4: "",
                slot_5: "",
            };
            const skill_equip = [
                "",
                "",
                "",
                "",
            ];
            let speed = 1;
            if (data.spd) {
                speed = data.spd;
            }
            const c = {
                level: data.level,
                rarity: data.rarity,
                name: data.name,
                job: data.job,
                uid: data.uid,
                hp: data.hpMax,
                sp: data.spMax,
                range: data.range,
                speed: speed,
                attributes: attributes,
                equipments: equipments,
                skill_equip: skill_equip,
                team1: -1,
                treasure1: -1,
                treasure2: -1,
                treasure3: -1,
                bonus,
                free: true,
                ethAddress: data.ethAddress,
                statPoint: 0,
                exp: 0,
            };
            summonList.push(c);
            //end data
        }
        //save
        try {
            // Connect to MongoDB using your srv string
            //await mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
            let Character;
            try {
                Character = mongoose_1.default.model('Character');
            }
            catch (error) {
                Character = mongoose_1.default.model('Character', character_schema_1.CharacterSchema);
            }
            for (let i = 0; i < summonList.length; i++) {
                const character = new Character(summonList[i]);
                character.save((error) => {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log('Character saved successfully! ' + summonList[i].uid);
                    }
                });
            }
        }
        catch (error) {
            console.log(error);
        }
        //end save
        console.log("return CBT characters" + characters.length);
        return true;
    }
    catch (err) {
        console.log(err);
        //mongoose.connection.close()
        return false;
    }
}
exports.fetchCharactersOld = fetchCharactersOld;
