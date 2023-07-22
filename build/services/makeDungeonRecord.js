"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpNextLevel = exports.addExpToHeroes = exports.calcDungeonRewards = exports.finishDungeon = exports.updateDungeonRecord = exports.createDungeonRecord = exports.userSchema = void 0;
const dungeonRecordModel_1 = require("./dungeonRecordModel");
const dungeonRewardModel_1 = require("./dungeonRewardModel");
const dungeonRewards_1 = require("../utils/dungeonRewards");
const addMaterials_1 = require("./addMaterials");
const mongoose_1 = __importDefault(require("mongoose"));
const character_schema_1 = require("./character.schema");
const CharacterModel = mongoose_1.default.model('Character', character_schema_1.CharacterSchema);
exports.userSchema = new mongoose_1.default.Schema({
    eth: String,
    diamond: Number,
    coupon: Number,
});
async function createDungeonRecord(eth, heroes, map) {
    /*let amount = [9,5,5,5,3,3,3,8,3,8]
    
    for(let i = 0 ; i < 10 ; i ++){
    
      let items = []
    
      for(let j = 0 ; j < amount[i] ; j++)
      {
        items.push(
        { percent: 0, tick: 3, uid: '900001' })
      }
    
      const testDungeonReward = new DungeonRewardModel({
      diamond: 100,
      exp: 200,
      items: items,
      level: 5,
      slug: 'deep-forest',
    });
    
      // Save test dungeonReward document to database
    testDungeonReward.save((err, doc) => {
      if (err) {
        console.error(err);
      } else {
        console.log(doc);
      }
    });
    
    }*/
    const stats = heroes.map((h) => {
        return {
            id: h.id,
            hp: h.hp,
            sp: h.sp,
        };
    });
    const id = Math.random().toString(36).substr(2, 24);
    const dungeonRecord = new dungeonRecordModel_1.DungeonRecordModel({
        ethAddress: eth,
        dungeon_id: id,
        map: map,
        wave: 1,
        start: new Date(),
        levelState: 'START',
        waves: [
            {
                wave: 1,
                start: new Date(),
                heroes: stats,
            },
        ],
    });
    await dungeonRecord.save();
    return id;
    /*const data = {
      ethAddress: eth,
      map: map,
      wave: 1,
      start: firestore.FieldValue.serverTimestamp(),
      levelState: 'START',
    }
    const ref = db.collection("User").doc(eth).collection("DungeonRecord").doc()
    await ref.set(data)
  
    await db.collection("User").doc(eth).collection("DungeonRecord").doc(ref.id).collection('wave').doc().set({
      wave: 1,
      start: firestore.FieldValue.serverTimestamp(),
      heroes: heroes.map(h => {
        return {
          id: h.id,
          hp: h.hp,
          sp: h.sp,
        }
      })
    })
  
    return ref.id*/
}
exports.createDungeonRecord = createDungeonRecord;
async function updateDungeonRecord(eth, heroes, wave, refId) {
    const stats = [];
    heroes.forEach((h) => {
        stats.push({
            id: h.id,
            hp: h.hp,
            sp: h.sp,
        });
    });
    const dungeonRecord = await dungeonRecordModel_1.DungeonRecordModel.findOneAndUpdate({ ethAddress: eth, dungeon_id: refId }, {
        $set: {
            wave: wave,
        },
        $push: {
            waves: {
                wave: wave,
                start: new Date(),
                heroes: stats,
            },
        },
    }, { new: true });
    return dungeonRecord;
    /* const stats = []
   
     heroes.forEach((h) => {
       stats.push({
         id: h.id,
         hp: h.hp,
         sp: h.sp,
       })
     })
   
     await db.collection("User").doc(eth).collection("DungeonRecord").doc(refId).update({
       wave: wave,
     })
   
     await db.collection("User").doc(eth).collection("DungeonRecord").doc(refId).collection('wave').doc().set({
       wave: wave,
       start: firestore.FieldValue.serverTimestamp(),
       heroes: stats,
     })
   
     */
}
exports.updateDungeonRecord = updateDungeonRecord;
async function finishDungeon(eth, wave, refId, map, heroes) {
    const rewards = await calcDungeonRewards(wave - 1, map);
    //const rewards = []
    await dungeonRecordModel_1.DungeonRecordModel.updateOne({ ethAddress: eth, dungeon_id: refId }, {
        rewardWave: wave - 1,
        end: new Date(),
        levelState: 'END',
        rewards: rewards,
        lastWaves: heroes.map((h) => {
            return {
                id: h.id,
                lastWave: h.lastWave
            };
        })
    });
    /*await db.collection("User").doc(eth).collection("DungeonRecord").doc(refId).update({
      rewardWave: wave - 1,
      end: firestore.FieldValue.serverTimestamp(),
      levelState: 'END',
      rewards: rewards,
      lastWaves: heroes.map((h) => {
        return {
          id: h.id,
          lastWave: h.lastWave
        }
      })
    })*/
    //console.log('reward', rewards)
    for (const key in rewards) {
        const value = rewards[key];
        //if (value > 0 && key !== 'diamon' && key !== 'exp') {
        //  db.collection("User").doc(eth).collection("Item").doc(key).set({
        //    quantity: firestore.FieldValue.increment(value)
        //  }, {merge: true})
        //}
        if (key === '500001') {
            await (0, addMaterials_1.addMaterials)(eth, "mat_010", value);
        }
        if (key === '500002') {
            await (0, addMaterials_1.addMaterials)(eth, "mat_009", value);
        }
        if (key === '500003') {
            await (0, addMaterials_1.addMaterials)(eth, "mat_008", value);
        }
        if (key === 'diamond') {
            try {
                let User;
                try {
                    User = mongoose_1.default.model('User');
                }
                catch (error) {
                    User = mongoose_1.default.model('User', exports.userSchema);
                }
                // Use the model to query for a user with a matching eth address
                let user = await User.findOne({ eth });
                // If a user was found, return coupon
                if (user) {
                    user.diamond += value;
                    await user.save();
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        if (key === 'exp') {
            await addExpToHeroes(heroes, 100);
            // await addExpToHeroes(heroes, rewards.exp)
        }
    }
    return rewards;
}
exports.finishDungeon = finishDungeon;
async function calcDungeonRewards(wave, slug) {
    const rWave = wave;
    if (!rWave) {
        return null;
    }
    let rewards = {
        diamond: 0,
        exp: 0,
    };
    if (rWave <= 10) {
        const rewardConfig = await dungeonRewardModel_1.DungeonRewardModel.findOne({ level: rWave, slug: slug }).lean();
        if (rewardConfig) {
            (0, dungeonRewards_1.randomRewards)(rewardConfig, rewards);
        }
        return rewards;
    }
    if (rWave > 10) {
        const rewardConfig = await dungeonRewardModel_1.DungeonRewardModel.findOne({ level: 10, slug: slug }).lean();
        const loop = Math.floor(rWave / 10);
        if (rewardConfig) {
            for (let i = 0; i < loop; i++) {
                (0, dungeonRewards_1.randomRewards)(rewardConfig, rewards);
            }
        }
        const level = rWave % 10;
        if (level > 0) {
            const rewardConfig2 = await dungeonRewardModel_1.DungeonRewardModel.findOne({ level: level }).lean();
            if (rewardConfig2) {
                (0, dungeonRewards_1.randomRewards)(rewardConfig2, rewards);
            }
        }
        return rewards;
    }
    return null;
}
exports.calcDungeonRewards = calcDungeonRewards;
async function addExpToHeroes(heroes, totalExp) {
    if (!totalExp)
        return;
    let sum = 0;
    heroes.forEach((h) => {
        sum += h.lastWave;
    });
    heroes.forEach(async (h) => {
        let rating = h.lastWave / sum;
        const exp = Math.round(rating * totalExp);
        let level = h.level;
        if (h.exp + exp >= getExpNextLevel(h.level)) {
            level++;
            const increment = { $inc: { exp: exp, level: 1, statPoint: 10 } };
            const character = await CharacterModel.findOneAndUpdate({ _id: h.id }, increment, { new: true });
            if (!character) {
                throw new Error('Character not found');
            }
            /*await db.collection("Character").doc(h.id).set({
              exp: firestore.FieldValue.increment(exp),
              level: level,
              statPoint: firestore.FieldValue.increment(10),
            }, {merge: true})*/
        }
        else {
            const increment = { $inc: { exp: exp } };
            const character = await CharacterModel.findOneAndUpdate({ _id: h.id }, increment, { new: true });
            if (!character) {
                throw new Error('Character not found');
            }
            /*  await db.collection("Character").doc(h.id).set({
                exp: firestore.FieldValue.increment(exp),
              }, {merge: true})
            */
        }
    });
}
exports.addExpToHeroes = addExpToHeroes;
function getExpNextLevel(lv) {
    if (lv < 84) {
        let exponent = 1.5;
        let baseXP = 240;
        return Math.floor(baseXP * Math.pow(lv, exponent));
    }
    else if (lv < 90) {
        let exponent = 1.5;
        let baseExp = 270;
        let modifier = (lv - 83) / 100;
        return Math.floor(baseExp * Math.pow(lv, exponent + modifier));
    }
    else {
        let exponent = 1.5;
        let baseExp = 300;
        let modifier = (lv - 83) / 100;
        return Math.floor(baseExp * Math.pow(lv, exponent + modifier));
    }
}
exports.getExpNextLevel = getExpNextLevel;
