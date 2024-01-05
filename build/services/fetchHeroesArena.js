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
exports.fetchHeroesArena = void 0;
const ArenaState_1 = require("../rooms/ArenaState");
const initStats_1 = require("../utils/initStats");
const fetchEquipments_1 = require("../services/fetchEquipments");
const mongoose_1 = __importStar(require("mongoose"));
const character_schema_1 = require("./character.schema");
const equipmentUtils_1 = require("../utils/equipmentUtils");
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
const ArenaCharacterSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    owner: { type: String, required: true },
    arenaAttackPosition: { type: Number, default: -1 },
    arenaDefendPosition: { type: Number, default: -1 }
});
async function fetchHeroesArena(eth) {
    //const snapshot = await db.collection('Character').get()
    const characters = [];
    let position = 0;
    const equipments = await (0, fetchEquipments_1.fetchEquipments)();
    //await mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
    const db = mongoose_1.default.connection;
    //db.on('error', console.error.bind(console, 'connection error:'));
    // we're connected!
    //console.log("Connected with mongo to get characters")
    const CharacterModel = mongoose_1.default.model('Character', character_schema_1.CharacterSchema);
    const modelName = 'ArenaCharacter';
    const existingModel = mongoose_1.default.models[modelName];
    let ArenaCharacterModel;
    try {
        // Try to retrieve the model from Mongoose's internal cache
        ArenaCharacterModel = mongoose_1.default.model(modelName);
    }
    catch (error) {
        // If the model doesn't exist, create a new one
        ArenaCharacterModel = mongoose_1.default.model(modelName, ArenaCharacterSchema);
    }
    try {
        const characters_data = await CharacterModel.find({ ethAddress: eth });
        const characters = [];
        //console.log( characters_data )
        for (let i = 0; i < characters_data.length; i++) {
            let data = characters_data[i];
            data = await (0, equipmentUtils_1.calcNFTBonus2)(data);
            const arenaData = await ArenaCharacterModel.findOne({ id: data.id });
            const arenaAttackPosition = arenaData?.arenaAttackPosition ?? -1;
            const arenaDefendPosition = arenaData?.arenaDefendPosition ?? -1;
            const character_forstat = new CharacterTemplate(data.attributes, data.job, data.uid, "", 0, data.level, data.hp, data.sp, data.speed, data.range);
            const stat = (0, initStats_1.makeStat)(character_forstat);
            let characer = new ArenaState_1.Character();
            //console.log("Heroes " + characters_data[i].job + " stats");
            //console.log(stat)
            //
            characer.id = data.id;
            characer.uid = data.uid;
            characer.level = data.level;
            characer.job = data.job;
            characer.name = data.name;
            characer.position = position;
            if (typeof data.skill_equip === 'undefined') {
                characer.skill_equip = ["", "", "", ""];
            }
            else {
                characer.skill_equip = data.skill_equip;
            }
            characer.atk = stat.atk;
            characer.def = stat.def;
            characer.mAtk = stat.mAtk;
            characer.mDef = stat.mDef;
            characer.hpMAX = stat.hpMAX;
            characer.spMAX = stat.spMAX;
            characer.hit = stat.hit;
            characer.flee = stat.flee;
            characer.cri = stat.cri;
            characer.aspd = stat.aspd;
            characer.speed = stat.speed;
            characer.range = stat.range;
            characer.exp = data.exp;
            characer.hp = stat.hpMAX;
            characer.sp = stat.spMAX;
            characer.hpMAX += (5 * data.level);
            characer.spMAX += (2 * data.level);
            //console.log("this is data skill equip")
            //console.log(data.skill_equip)
            characer.slot_0 = data.equipments.slot_0;
            characer.slot_1 = data.equipments.slot_1;
            characer.slot_2 = data.equipments.slot_2;
            characer.slot_3 = data.equipments.slot_3;
            characer.slot_4 = data.equipments.slot_4;
            characer.slot_5 = data.equipments.slot_5;
            characer.slot_6 = data.equipments.slot_6;
            characer.slot_7 = data.equipments.slot_7;
            characer.slot_8 = data.equipments.slot_8;
            if (data.skill_equip) {
                characer.skill_equip = data.skill_equip;
            }
            else {
                characer.skill_equip = [];
            }
            for (let i = 0; i <= 8; i++) {
                const slotKey = `slot_${i}`;
                if (data.equipments[slotKey]) {
                    // Remove the + and numbers following it
                    const uidWithoutSuffix = data.equipments[slotKey].replace(/\+\d+$/, '');
                    const equipment = equipments.find(c => c.uid === uidWithoutSuffix);
                    if (equipment) {
                        characer.atk += equipment.atk;
                        characer.def += equipment.def;
                        characer.mAtk += equipment.mAtk;
                        characer.mDef += equipment.mDef;
                        characer.hpMAX += equipment.hpMAX;
                        characer.spMAX += equipment.spMAX;
                        characer.hit += equipment.hit;
                        characer.flee += equipment.flee;
                        characer.cri += equipment.cri;
                        characer.aspd += equipment.aspd;
                        characer.speed += equipment.speed;
                        characer.range += equipment.range;
                    }
                }
            }
            characer.exp = data.exp ? data.exp : 0;
            characer.arenaAttackPosition = arenaAttackPosition;
            characer.arenaDefendPosition = arenaDefendPosition;
            characer = await (0, equipmentUtils_1.calcNFTBonus)(characer, data);
            //
            if (arenaAttackPosition != -1 && data.ethAddress == eth) {
                characters.push(characer);
                position++;
            }
        }
        //mongoose.connection.close()
        //console.log("return characters")
        //console.log(characters)
        return characters;
    }
    catch (err) {
        console.log(err);
        //mongoose.connection.close()
        return [];
    }
}
exports.fetchHeroesArena = fetchHeroesArena;
