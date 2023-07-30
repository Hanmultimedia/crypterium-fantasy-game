import { Character } from "../rooms/DungeonState";
import { makeStat } from "../utils/initStats";
import mongoose, { Schema, Document }  from 'mongoose';

const baseMonsterSchema = new Schema({
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

export async function fetchRandomChest(slug:string, wave:number): Promise<any> {

   /* const doc = await db.collection('DungeonConfig').doc(slug).get();
    let config = null
    if (doc.exists) {
      config = doc.data()
    }*/

    let MonsterModel;

    try 
    {
      MonsterModel = mongoose.model('BaseMonster');
    }catch (error)
    {
      MonsterModel = mongoose.model('BaseMonster',baseMonsterSchema);
    }

    try {
      const monsters_data = await MonsterModel.find({});
      const monsters:any[] = []

    const data = {}
    monsters_data.forEach((monster) => {
    data[monster.uid] = {
        ...monster.toObject(),
        job: monster.uid,
        uid: monster.uid, 
    }
    });

// Define the items and their corresponding probabilities
let possible_uid = [
  { uid: "chest001", probability: 0.5 }, // 50% probability
  { uid: "chest002", probability: 0.3 }, // 30% probability
  { uid: "chest003", probability: 0.2 }, // 20% probability
];

if(slug == "1")
{
  possible_uid = [{ uid: "chest001", probability: 1 }, // 50% probability];
}

// Create the cumulative distribution function (CDF) array
const cdf = [];
let cumulativeProbability = 0;

for (const item of possible_uid) {
  cumulativeProbability += item.probability;
  cdf.push({ uid: item.uid, cumulativeProbability });
}

// Generate a random number between 0 and 1
const randomValue = Math.random();

// Find the item in the CDF whose cumulative probability is greater than the randomValue
const selected = cdf.find((item) => item.cumulativeProbability >= randomValue);

// Get the selected uid
const uid = selected.uid;

console.log(uid);


   /* const possible_uid = 
    [
      "chest001",
      "chest002",
      "chest003"
    ]


    const uid = possible_uid[Math.floor(Math.random() * possible_uid.length)] */

    let currentWave = wave
    let position = 0;
    const m = data[uid]
          const characer = new Character()
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
          //monsters.push(characer)
          return characer
      }
      catch (error) 
      {

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