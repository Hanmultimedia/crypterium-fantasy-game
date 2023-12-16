import { Character } from "../rooms/ArenaState";
import { makeStat } from "../utils/initStats";
import { Equipment } from "../rooms/MenuState";
import { fetchEquipments } from "../services/fetchEquipments";
import mongoose, { Schema, Document }  from 'mongoose';
import { CharacterSchema } from './character.schema';
import { calcNFTBonus,calcNFTBonus2 } from "../utils/equipmentUtils";

class CharacterTemplate {
  attributes: Attributes;
  job: string;
  uid: string;
  slug: string;
  position: number;
  level: number;
  hp: number;
  sp: number;
  speed: number;
  range: number;

constructor(attributes: Attributes, job:string, uid:string, slug:string, position:number, level:number, hp:number, sp:number, speed:number, range:number) {
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


interface Attributes {
  vit: number;
  agi: number;
  int: number;
  str: number;
  luk: number;
  dex: number;
}

const ArenaCharacterSchema = new Schema({
  id: { type: String, required: true },
  owner: { type: String, required: true },
  arenaAttackPosition: { type: Number, default: -1 },
  arenaDefendPosition: { type: Number, default: -1 }
});

export async function fetchHeroesArena(eth:string): Promise<any> {

  //const snapshot = await db.collection('Character').get()
  const characters:any[] = []
  let position = 0;
  const equipments = await fetchEquipments()

  //await mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
  const db = mongoose.connection;
  //db.on('error', console.error.bind(console, 'connection error:'));
   
    // we're connected!
    //console.log("Connected with mongo to get characters")
    const CharacterModel = mongoose.model('Character', CharacterSchema);

    const modelName = 'ArenaCharacter';
    const existingModel = mongoose.models[modelName];

    let ArenaCharacterModel;
    try {
      // Try to retrieve the model from Mongoose's internal cache
      ArenaCharacterModel = mongoose.model(modelName);
    } catch (error) {
      // If the model doesn't exist, create a new one
      ArenaCharacterModel = mongoose.model(modelName, ArenaCharacterSchema);
    }

    try {
      const characters_data = await CharacterModel.find({ethAddress:eth});
      const characters:any[] = []
      //console.log( characters_data )
      for(let i = 0 ; i < characters_data.length ; i++)
      {
        let data = characters_data[i]
        data = await calcNFTBonus2(data)
        const arenaData = await ArenaCharacterModel.findOne({ id: data.id });
        const arenaAttackPosition = arenaData?.arenaAttackPosition ?? -1;
        const arenaDefendPosition = arenaData?.arenaDefendPosition ?? -1;


        const character_forstat = new CharacterTemplate(data.attributes,data.job,data.uid,"",0,data.level,data.hp,data.sp,data.speed,data.range)
        const stat = makeStat(character_forstat)
        let characer = new Character()

        //console.log("Heroes " + characters_data[i].job + " stats");
        //console.log(stat)

        //
        characer.id = data.id
    characer.uid = data.uid
    characer.level = data.level
    characer.job = data.job
    characer.name = data.name
    characer.position = position

    if(typeof data.skill_equip === 'undefined')
    {
      characer.skill_equip = ["","","",""]   
    }else
    {
      characer.skill_equip = data.skill_equip
    }

    characer.atk = stat.atk
    characer.def = stat.def
    characer.mAtk = stat.mAtk
    characer.mDef = stat.mDef
    characer.hpMAX = stat.hpMAX
    characer.spMAX = stat.spMAX
    characer.hit = stat.hit
    characer.flee = stat.flee
    characer.cri = stat.cri
    characer.aspd = stat.aspd
    characer.speed = stat.speed
    characer.range = stat.range
    characer.exp = data.exp

    characer.hp = stat.hpMAX
    characer.sp = stat.spMAX

    characer.hpMAX += (5*data.level)
    characer.spMAX += (2*data.level)

    //console.log("this is data skill equip")
    //console.log(data.skill_equip)

    characer.slot_0 = data.equipments.slot_0
    characer.slot_1 = data.equipments.slot_1
    characer.slot_2 = data.equipments.slot_2
    characer.slot_3 = data.equipments.slot_3
    characer.slot_4 = data.equipments.slot_4
    characer.slot_5 = data.equipments.slot_5
    characer.slot_6 = data.equipments.slot_6
    characer.slot_7 = data.equipments.slot_7
    characer.slot_8 = data.equipments.slot_8

    if(data.skill_equip)
    {
      characer.skill_equip = data.skill_equip
    }
    else
    {
      characer.skill_equip = []
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


    characer.exp = data.exp ? data.exp: 0

    characer.arenaAttackPosition = arenaAttackPosition;
    characer.arenaDefendPosition = arenaDefendPosition;
    characer = await calcNFTBonus(characer,data)
        //
    if(arenaAttackPosition != -1 && data.ethAddress == eth)
    {
      characters.push(characer)
      position++;
    }
        
    }

      //mongoose.connection.close()
      //console.log("return characters")
      //console.log(characters)
      return characters
    } catch (err) {
      console.log(err);
      //mongoose.connection.close()
      return []
    }


}