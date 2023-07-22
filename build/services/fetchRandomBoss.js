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
exports.fetchRandomBoss = void 0;
//import { db } from "../arena.config";
const DungeonState_1 = require("../rooms/DungeonState");
const mongoose_1 = __importStar(require("mongoose"));
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
async function fetchRandomBoss(slug, wave) {
    /* const doc = await db.collection('DungeonConfig').doc(slug).get();
     let config = null
     if (doc.exists) {
       config = doc.data()
     }*/
    let MonsterModel;
    try {
        MonsterModel = mongoose_1.default.model('BaseMonster');
    }
    catch (error) {
        MonsterModel = mongoose_1.default.model('BaseMonster', baseMonsterSchema);
    }
    try {
        const monsters_data = await MonsterModel.find({});
        const monsters = [];
        const data = {};
        monsters_data.forEach((monster) => {
            data[monster.uid] = {
                ...monster.toObject(),
                job: monster.uid,
                uid: monster.uid,
            };
        });
        const possible_uid = [
            "110002",
            "110003",
            "110004",
        ];
        const uid = possible_uid[Math.floor(Math.random() * possible_uid.length)];
        let currentWave = wave;
        let position = 0;
        const m = data[uid];
        const characer = new DungeonState_1.Character();
        characer.uid = m.uid;
        characer.position = position;
        characer.level = m.level;
        characer.job = m.job;
        characer.name = m.name;
        characer.atk = m.atk;
        characer.def = m.def;
        characer.mAtk = m.mAtk;
        characer.mDef = m.mDef;
        characer.hpMAX = m.hp;
        characer.spMAX = 0;
        characer.hit = m.hit;
        characer.flee = m.flee;
        characer.cri = m.cri;
        characer.aspd = m.aspd;
        characer.speed = m.speed;
        characer.range = m.range;
        characer.exp = m.exp;
        characer.hp = m.hp;
        characer.sp = 0;
        //monsters.push(characer)
        return characer;
    }
    catch (error) {
    }
    /*else if (currentWave > config.total_wave) {
      let indexWave = (currentWave % config.total_wave)
      if (indexWave === 0) indexWave = config.total_wave
      const monsterWaves = config.waves[indexWave - 1].monsters


      let multiply = (Math.ceil(currentWave/config.total_wave) - 1) * (config.loop_lv_up_factor - 1) + 1
      let index = 1
      monsterWaves.forEach((d) => {
        const m = data[d.uid]
        for(let i=0;i<d.amount;i++) {

          const characer = new Character()
          characer.id = `${d.uid}-${i+1}`
          characer.uid = m.uid
          characer.position = index - 1
          characer.level = m.level
          characer.job = m.job
          characer.name = m.name
          
          characer.atk = m.atk * multiply
          characer.def = m.def * multiply
          characer.mAtk = m.mAtk * multiply
          characer.mDef = m.mDef * multiply
          characer.hpMAX = m.hp * multiply
          characer.spMAX = 0 * multiply
          characer.hit = m.hit * multiply
          characer.flee = m.flee * multiply
          characer.cri = m.cri * multiply
          characer.aspd = m.aspd
          characer.speed = m.speed
          characer.range = m.range

          characer.hp = m.hp * multiply
          characer.sp = 0 * multiply

          monsters.push(characer)
          position++;
        }
        
        index++
      })
    }*/
}
exports.fetchRandomBoss = fetchRandomBoss;
