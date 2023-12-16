import { makeStat } from "../utils/initStats";
import { Character } from "../rooms/MenuState";
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

const ArenaCharacterSchema = new Schema({
  id: { type: String, required: true },
  owner: { type: String, required: true },
  arenaAttackPosition: { type: Number, default: -1 },
  arenaDefendPosition: { type: Number, default: -1 }
});


interface Attributes {
  vit: number;
  agi: number;
  int: number;
  str: number;
  luk: number;
  dex: number;
}

export async function fetchCharacters(eth:string): Promise<any> {

  //await mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
  const db = mongoose.connection;
  //db.on('error', console.error.bind(console, 'connection error:'));
   
    // we're connected!
    //console.log("Connected with mongo to get characters " + eth)
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
      //console.log("have character " + characters_data.length)
      const characters:any[] = []
      //console.log( characters_data )
      for(let i = 0 ; i < characters_data.length ; i++)
      {
        let characer = new Character()

        let data = characters_data[i]
        
    characer.oristr = data.attributes.str
    characer.orivit = data.attributes.vit
    characer.oriint = data.attributes.int
    characer.oriagi = data.attributes.agi
    characer.oridex = data.attributes.dex
    characer.oriluk = data.attributes.luk

        data = await calcNFTBonus2(data)

        const arenaData = await ArenaCharacterModel.findOne({ id: data.id });
        const arenaAttackPosition = arenaData?.arenaAttackPosition ?? -1;
        const arenaDefendPosition = arenaData?.arenaDefendPosition ?? -1;

        const character_forstat = new CharacterTemplate(data.attributes,data.job,data.uid,"",0,data.level,data.hp,data.sp,data.speed,data.range)
        const stat = makeStat(character_forstat)
       
        characer.id = data.id

    characer.uid = data.uid
    characer.level = data.level
    characer.job = data.job
    characer.name = data.name
    characer.str = data.attributes.str
    characer.vit = data.attributes.vit
    characer.int = data.attributes.int
    characer.agi = data.attributes.agi
    characer.dex = data.attributes.dex
    characer.luk = data.attributes.luk
    characer.exp = data.exp
    characer.star = data.star;

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

    characer.statPoint = data.statPoint

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

    characer.arenaAttackPosition = arenaAttackPosition;
    characer.arenaDefendPosition = arenaDefendPosition;
    characer = await calcNFTBonus(characer,data)
    characters.push(characer)
    }

      return characters
    } catch (err) {
      console.log(err);
      return []
    }
}