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
exports.fetchWaveMonsters = void 0;
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
baseMonsterSchema.pre('save', function (next) {
    this.updated_date = new Date();
    next();
});
async function fetchWaveMonsters(slug, wave) {
    //console.log("Fetch Wave monster " + wave);
    let BaseMonster;
    try {
        BaseMonster = mongoose_1.default.model('BaseMonster');
    }
    catch (error) {
        BaseMonster = mongoose_1.default.model('BaseMonster', baseMonsterSchema);
    }
    const numWaves = 10;
    const currentWave = wave % numWaves || numWaves;
    const bossMonsterId = "110001";
    const monsterIds = ["100003", "100004", "100005", "100006"];
    const numMonstersPerWave = [
        [{ id: "100005", count: 1 }, { id: "100004", count: 1 }],
        [{ id: "100005", count: 3 }, { id: "100004", count: 1 }, { id: "100003", count: 1 }],
        [{ id: "100005", count: 3 }, { id: "100004", count: 1 }, { id: "100003", count: 2 }],
        [{ id: "100005", count: 3 }, { id: "100004", count: 3 }, { id: "100003", count: 2 }],
        [{ id: "100005", count: 3 }, { id: "100004", count: 3 }, { id: "100003", count: 2 }, { id: "100006", count: 1 }],
        [{ id: "100005", count: 3 }, { id: "100004", count: 3 }, { id: "100003", count: 3 }, { id: "100006", count: 1 }],
        [{ id: "100005", count: 2 }, { id: "100004", count: 4 }, { id: "100003", count: 4 }, { id: "100006", count: 1 }],
        [{ id: "100005", count: 2 }, { id: "100004", count: 4 }, { id: "100003", count: 4 }, { id: "100006", count: 2 }],
        [{ id: "100005", count: 4 }, { id: "100004", count: 4 }, { id: "100003", count: 4 }, { id: "100006", count: 2 }],
        [{ id: "100005", count: 4 }, { id: "100004", count: 3 }, { id: "100003", count: 3 }, { id: "100006", count: 3 }, { id: "110001", count: 1 }]
    ];
    const waveMonsterIds = [];
    for (let i = 1; i <= numWaves; i++) {
        let waveMonsters = [];
        const numMonsters = numMonstersPerWave[i - 1];
        for (const { id, count } of numMonsters) {
            for (let j = 1; j <= count; j++) {
                waveMonsters.push(id);
            }
        }
        waveMonsterIds.push(waveMonsters);
    }
    const monsters = [];
    const baseMonsters = await BaseMonster.find({});
    const data = {};
    baseMonsters.forEach((monster) => {
        data[monster.uid] = {
            ...monster.toObject(),
            job: monster.uid
        };
    });
    let position = 0;
    if (wave <= 10) {
        const monsterWaves = waveMonsterIds[currentWave - 1];
        monsterWaves.forEach((d, index) => {
            const m = data[d];
            const characer = new DungeonState_1.Character();
            characer.id = `${d.uid}-${position + 1}`;
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
            characer.hp = m.hp;
            characer.sp = 0;
            monsters.push(characer);
            position++;
        });
    }
    else if (wave > 10) {
        let indexWave = (wave % 10);
        if (indexWave === 0)
            indexWave = 10;
        const monsterWaves = waveMonsterIds[indexWave - 1];
        let multiply = (Math.ceil(wave / 10) - 1) * (1.2 - 1) + 1;
        let index = 0;
        monsterWaves.forEach((d) => {
            const m = data[d];
            const characer = new DungeonState_1.Character();
            characer.id = `${d.uid}-${index + 1}`;
            characer.uid = m.uid;
            characer.position = index;
            characer.level = m.level;
            characer.job = m.job;
            characer.name = m.name;
            characer.atk = m.atk * multiply;
            characer.def = m.def * multiply;
            characer.mAtk = m.mAtk * multiply;
            characer.mDef = m.mDef * multiply;
            characer.hpMAX = m.hp * multiply;
            characer.spMAX = 0 * multiply;
            characer.hit = m.hit * multiply;
            characer.flee = m.flee * multiply;
            characer.cri = m.cri * multiply;
            characer.aspd = m.aspd;
            characer.speed = m.speed;
            characer.range = m.range;
            characer.hp = m.hp * multiply;
            characer.sp = 0 * multiply;
            monsters.push(characer);
            position++;
            index++;
        });
    }
    /*const doc = await db.collection('DungeonConfig').doc(slug).get();
    let config = null
    if (doc.exists) {
      config = doc.data()
    }

    const mSnapshot = await db.collection('BaseMonster').get();
    const data = {}
    mSnapshot.forEach((doc) => {
      const m = doc.data()
      data[doc.id] = {
        ...m,
        job: doc.id,
        uid: doc.id,
      }
    });

    const monsters = []

    let currentWave = wave
    let position = 0;

    if (currentWave <= config.total_wave) {
      const monsterWaves = config.waves[currentWave - 1].monsters
      monsterWaves.forEach((d, index) => {
        const m = data[d.uid]

        for(let i=0;i<d.amount;i++) {

          const characer = new Character()
          characer.id = `${d.uid}-${i+1}`
          characer.uid = m.uid
          characer.position = position
          characer.level = m.level
          characer.job = m.job
          characer.name = m.name
          
          characer.atk = m.atk
          characer.def = m.def
          characer.mAtk = m.mAtk
          characer.mDef = m.mDef
          characer.hpMAX = m.hp
          characer.spMAX = 0
          characer.hit = m.hit
          characer.flee = m.flee
          characer.cri = m.cri
          characer.aspd = m.aspd
          characer.speed = m.speed
          characer.range = m.range

          characer.hp = m.hp
          characer.sp = 0

          monsters.push(characer)
          position++;
        }
      })
    } else if (currentWave > config.total_wave) {
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
    return monsters;
}
exports.fetchWaveMonsters = fetchWaveMonsters;
