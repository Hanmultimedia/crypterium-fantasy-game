//import { db } from "../arena.config";
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

export async function fetchRandomMonster(slug:string, wave:number , monsters_data:any): Promise<any> {



    /*let MonsterModel;

    try 
    {
      MonsterModel = mongoose.model('BaseMonster');
    }catch (error)
    {
      MonsterModel = mongoose.model('BaseMonster',baseMonsterSchema);
    }*/

    try {
      //const monsters_data = await MonsterModel.find({});
      const monsters:any[] = []

    const data = {}
    monsters_data.forEach((monster) => {
    data[monster.uid] = {
        ...monster.toObject(),
        job: monster.uid,
        uid: monster.uid, 
    }
    });

    let possible_uid = 
    [
      "100003",
      "100004",
      "100005",
      "100006",
    ]

    if(slug == "1")
    {
      possible_uid = 
      [
        "100003",
        "100004",
      ]
    }


    const uid = possible_uid[Math.floor(Math.random() * possible_uid.length)]

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
          characer.exp = m.exp
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