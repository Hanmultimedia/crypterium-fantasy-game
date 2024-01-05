import { Character } from "../rooms/DungeonState";
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

export async function fetchHeroesTreasure(eth:string): Promise<any> {

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
    try {
      const characters_data = await CharacterModel.find({ethAddress:eth});
      const characters:any[] = []
      //console.log( characters_data )
      for(let i = 0 ; i < characters_data.length ; i++)
      {
        let data = characters_data[i]
        data = await calcNFTBonus2(data)

        const character_forstat = new CharacterTemplate(data.attributes,data.job,data.uid,"",0,data.level,data.hp,data.sp,data.speed,data.range)
        const stat = makeStat(character_forstat)
        let characer = new Character()
        //characer.attributes = data.attributes

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

    characer.slot_0 = data.equipments.slot_0
    characer.slot_1 = data.equipments.slot_1
    characer.slot_2 = data.equipments.slot_2
    characer.slot_3 = data.equipments.slot_3
    characer.slot_4 = data.equipments.slot_4
    characer.slot_5 = data.equipments.slot_5
    characer.slot_6 = data.equipments.slot_6
    characer.slot_7 = data.equipments.slot_7
    characer.slot_8 = data.equipments.slot_8
    
    //characer.equipments = data.equipments

    //console.log("Equipment 5" + data.Equipment_5)

    if(typeof data.team1 !== 'undefined')
    {
      characer.team1 = data.team1   
    }
    else
    {
      characer.team1 = -1   
    }

    if(typeof data.treasure1 !== 'undefined')
    {
      characer.treasure1 = data.treasure1   
    }
    else
    {
      characer.treasure1 = -1   
    }

    if(typeof data.treasure2 !== 'undefined')
    {
      characer.treasure2 = data.treasure2   
    }
    else
    {
      characer.treasure2 = -1   
    }

    if(typeof data.treasure1 !== 'undefined')
    {
      characer.treasure3 = data.treasure3   
    }
    else
    {
      characer.treasure3 = -1   
    }

    //characer.statPoint = data.statPoint
    //console.log(stat)
    characer.atk = stat.atk
    characer.def = stat.def
    characer.mAtk = stat.mAtk
    characer.mDef = stat.mDef
    characer.hpMAX = stat.hpMAX
    characer.spMAX = stat.spMAX

    characer.hpMAX += (5*data.level)
    characer.spMAX += (2*data.level)

    characer.hit = stat.hit
    characer.flee = stat.flee
    characer.cri = stat.cri
    characer.aspd = stat.aspd
    characer.speed = stat.speed
    characer.range = stat.range
    characer.exp = data.exp

    characer.hp = stat.hpMAX
    characer.sp = stat.spMAX

    // Set character attributes from data.attributes
    characer.str = data.attributes.str;
    characer.agi = data.attributes.agi;
    characer.dex = data.attributes.dex;
    characer.luk = data.attributes.luk;
    characer.vit = data.attributes.vit;
    characer.int = data.attributes.int;

    //console.log("this is data skill equip")
    //console.log(data.skill_equip)

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
    characer = await calcNFTBonus(characer,data)
        //
    if((characer.treasure1 != -1 || characer.treasure2 != -1 || characer.treasure3 != -1) && data.ethAddress == eth)
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