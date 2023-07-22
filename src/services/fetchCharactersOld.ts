
import { makeStat } from "../utils/initStats";
import { Character } from "../rooms/MenuState";
import mongoose, { Schema, Document }  from 'mongoose';
import { CharacterSchema } from './character.schema';

const CharacterOldSchema: Schema = new mongoose.Schema({
  level: { type: Number, required: true },
  rarity: { type: String, required: true },
  name: { type: String, required: true },
  job: { type: String, required: true },
  uid: { type: String, required: true },
  range: { type: Number, required: true },
  bonus: { type: Schema.Types.Mixed, required: true },
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

interface BaseCharacterOldSModel extends Document {
    level: number;
    rarity: string;
    uid:string;
    name: string;
    job: string;
    ethAddress: string;
    bonus: [];
    _created_at: Date;
    _updated_at: Date;
    str: number;
    agi: number;
    int: number;
    vit:number;
    dex: number;
    luk: number;
    hpMAX : number;
    spMAX : number;
    range: number;
    cbt: boolean;
    spd : number;
}

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

export async function fetchCharactersOld(eth:string): Promise<any> {

  const db = mongoose.connection;
  const summonList = []
    // we're connected!
    console.log("Connected with mongo to get characters " + eth)
    let CharacterModel:any;
    try {
      CharacterModel = mongoose.model<BaseCharacterOldSModel>('CBTCharacter');
    } catch (error) {
      CharacterModel = mongoose.model<BaseCharacterOldSModel>('CBTCharacter', CharacterOldSchema);
    }

    try {
      const characters_data = await CharacterModel.find({});
      console.log("have CBT character " + characters_data.length)
      const characters:any[] = []
      console.log( characters_data )
      for(let i = 0 ; i < characters_data.length ; i++)
      {
        const data = characters_data[i]


        //data

    const bonus = data.bonus

    const attributes = {
      str: data.str,
      agi: data.agi,
      int: data.int,
      vit: data.vit,
      dex: data.dex,
      luk: data.luk,
    }

    const equipments = {
      slot_0: "",
      slot_1: "",
      slot_2: "",
      slot_3: "",
      slot_4: "",
      slot_5: "",
    }

    const skill_equip = [
      "",
      "",
      "",
      "",
    ]

    let speed = 1
    if(data.spd)
    {
      speed = data.spd
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
      treasure1:-1,
      treasure2:-1,
      treasure3:-1,
      bonus,
      free: true,
      ethAddress: data.ethAddress,
      statPoint: 0,
      exp:0,
    }

    summonList.push(c)
        //end data
    }

    //save

    try {
    // Connect to MongoDB using your srv string
    //await mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
    
    let Character: any;
    try {
      Character =  mongoose.model('Character');
    } catch (error) {
      Character = mongoose.model('Character', CharacterSchema);
    }

    for(let i = 0 ; i < summonList.length ; i++){
    const character = new Character(summonList[i]);
    character.save((error) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Character saved successfully! ' + summonList[i].uid);
    }
    });

    }

  } catch (error) {
    console.log(error);
  }


    //end save

      console.log("return CBT characters" + characters.length)
      return true
    } catch (err) {
      console.log(err);
      //mongoose.connection.close()
      return false
    }
}