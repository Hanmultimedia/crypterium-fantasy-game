"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchHeroes = void 0;
const DungeonState_1 = require("../rooms/DungeonState");
const initStats_1 = require("../utils/initStats");
const fetchEquipments_1 = require("../services/fetchEquipments");
const mongoose_1 = __importDefault(require("mongoose"));
const character_schema_1 = require("./character.schema");
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
async function fetchHeroes(eth) {
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
    try {
        const characters_data = await CharacterModel.find({ ethAddress: eth });
        const characters = [];
        //console.log( characters_data )
        for (let i = 0; i < characters_data.length; i++) {
            const data = characters_data[i];
            const character_forstat = new CharacterTemplate(data.attributes, data.job, data.uid, "", 0, data.level, data.hp, data.sp, data.speed, data.range);
            const stat = (0, initStats_1.makeStat)(character_forstat);
            const characer = new DungeonState_1.Character();
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
            //characer.slot_0 = data.equipments.slot_0
            //characer.slot_1 = data.equipments.slot_1
            //characer.slot_2 = data.equipments.slot_2
            //characer.slot_3 = data.equipments.slot_3
            //characer.slot_4 = data.equipments.slot_4
            //characer.slot_5 = data.equipments.slot_5
            //characer.equipments = data.equipments
            //console.log("Equipment 5" + data.Equipment_5)
            if (typeof data.team1 !== 'undefined') {
                characer.team1 = data.team1;
            }
            else {
                characer.team1 = -1;
            }
            if (typeof data.treasure1 !== 'undefined') {
                characer.treasure1 = data.treasure1;
            }
            else {
                characer.treasure1 = -1;
            }
            if (typeof data.treasure2 !== 'undefined') {
                characer.treasure2 = data.treasure2;
            }
            else {
                characer.treasure2 = -1;
            }
            if (typeof data.treasure1 !== 'undefined') {
                characer.treasure3 = data.treasure3;
            }
            else {
                characer.treasure3 = -1;
            }
            //characer.statPoint = data.statPoint
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
            characer.hp = stat.hpMAX;
            characer.sp = stat.spMAX;
            //console.log("this is data skill equip")
            //console.log(data.skill_equip)
            if (data.skill_equip) {
                characer.skill_equip = data.skill_equip;
            }
            else {
                characer.skill_equip = [];
            }
            if (data.equipments.slot_0) {
                const equipment = equipments.find(c => c.uid === data.equipments.slot_0);
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
            if (data.equipments.slot_1) {
                const equipment = equipments.find(c => c.uid === data.equipments.slot_1);
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
            if (data.equipments.slot_2) {
                const equipment = equipments.find(c => c.uid === data.equipments.slot_2);
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
            if (data.equipments.slot_3) {
                const equipment = equipments.find(c => c.uid === data.equipments.slot_3);
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
            if (data.equipments.slot_4) {
                const equipment = equipments.find(c => c.uid === data.equipments.slot_4);
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
            if (data.equipments.slot_5) {
                const equipment = equipments.find(c => c.uid === data.equipments.slot_5);
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
            characer.exp = data.exp ? data.exp : 0;
            //
            if (data.team1 != undefined && characer.team1 != -1 && data.ethAddress == eth) {
                characters.push(characer);
                position++;
            }
        }
        //mongoose.connection.close()
        // console.log("return characters")
        // console.log(characters)
        return characters;
    }
    catch (err) {
        console.log(err);
        //mongoose.connection.close()
        return [];
    }
    /*snapshot.forEach((doc) => {
      const data:any = doc.data()
      const stat = makeStat(data)
  
      const characer = new Character()
      characer.id = doc.id
      characer.uid = data.uid
      characer.position = position
      characer.level = data.level
      characer.job = data.job
      characer.name = data.name
      
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
  
      characer.team1 = data.team1
      characer.treasure1 = data.treasure1
      characer.treasure2 = data.treasure2
      characer.treasure3 = data.treasure3
  
      if(data.team1 == undefined)
      {
        characer.treasure1 = -1
      }
  
      if(data.treasure1 == undefined)
      {
        characer.treasure1 = -1
      }
  
      if(data.treasure2 == undefined)
      {
        characer.treasure2 = -1
      }
  
      if(data.treasure3 == undefined)
      {
        characer.treasure3 = -1
      }
  
  
      characer.hp = stat.hpMAX
      characer.sp = stat.spMAX
  
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
  
      if(data.equipments.slot_0)
      {
          const equipment = equipments.find( c => c.uid === data.equipments.slot_0)
          console.log(equipment.uid + equipment.hit)
          characer.atk += equipment.atk
          characer.def += equipment.def
          characer.mAtk += equipment.mAtk
          characer.mDef += equipment.mDef
          characer.hpMAX += equipment.hpMAX
          characer.spMAX += equipment.spMAX
          characer.hit += equipment.hit
          characer.flee += equipment.flee
          characer.cri += equipment.cri
          characer.aspd += equipment.aspd
          characer.speed += equipment.speed
          characer.range += equipment.range
      }
  
      if(data.equipments.slot_1)
      {
          const equipment = equipments.find( c => c.uid === data.equipments.slot_1)
          console.log(equipment.uid + equipment.hit)
          characer.atk += equipment.atk
          characer.def += equipment.def
          characer.mAtk += equipment.mAtk
          characer.mDef += equipment.mDef
          characer.hpMAX += equipment.hpMAX
          characer.spMAX += equipment.spMAX
          characer.hit += equipment.hit
          characer.flee += equipment.flee
          characer.cri += equipment.cri
          characer.aspd += equipment.aspd
          characer.speed += equipment.speed
          characer.range += equipment.range
      }
  
      if(data.equipments.slot_2)
      {
         const equipment = equipments.find( c => c.uid === data.equipments.slot_2)
         console.log(equipment.uid + equipment.hit)
          characer.atk += equipment.atk
          characer.def += equipment.def
          characer.mAtk += equipment.mAtk
          characer.mDef += equipment.mDef
          characer.hpMAX += equipment.hpMAX
          characer.spMAX += equipment.spMAX
          characer.hit += equipment.hit
          characer.flee += equipment.flee
          characer.cri += equipment.cri
          characer.aspd += equipment.aspd
          characer.speed += equipment.speed
          characer.range += equipment.range
      }
  
      if(data.equipments.slot_3)
      {
        const equipment = equipments.find( c => c.uid === data.equipments.slot_3)
        console.log(equipment.uid + equipment.hit)
          characer.atk += equipment.atk
          characer.def += equipment.def
          characer.mAtk += equipment.mAtk
          characer.mDef += equipment.mDef
          characer.hpMAX += equipment.hpMAX
          characer.spMAX += equipment.spMAX
          characer.hit += equipment.hit
          characer.flee += equipment.flee
          characer.cri += equipment.cri
          characer.aspd += equipment.aspd
          characer.speed += equipment.speed
          characer.range += equipment.range
      }
  
      if(data.equipments.slot_4)
      {
        const equipment = equipments.find( c => c.uid === data.equipments.slot_4)
        console.log(equipment.uid + equipment.hit)
          characer.atk += equipment.atk
          characer.def += equipment.def
          characer.mAtk += equipment.mAtk
          characer.mDef += equipment.mDef
          characer.hpMAX += equipment.hpMAX
          characer.spMAX += equipment.spMAX
          characer.hit += equipment.hit
          characer.flee += equipment.flee
          characer.cri += equipment.cri
          characer.aspd += equipment.aspd
          characer.speed += equipment.speed
          characer.range += equipment.range
      }
  
      if(data.equipments.slot_5)
      {
        const equipment = equipments.find( c => c.uid === data.equipments.slot_5)
        console.log(equipment.uid + equipment.hit)
          characer.atk += equipment.atk
          characer.def += equipment.def
          characer.mAtk += equipment.mAtk
          characer.mDef += equipment.mDef
          characer.hpMAX += equipment.hpMAX
          characer.spMAX += equipment.spMAX
          characer.hit += equipment.hit
          characer.flee += equipment.flee
          characer.cri += equipment.cri
          characer.aspd += equipment.aspd
          characer.speed += equipment.speed
          characer.range += equipment.range
      }
  
      characer.exp = data.exp ? data.exp: 0
  
      if(data.team1 != undefined && characer.team1 != -1 && data.ethAddress == eth)
      {
        characters.push(characer)
        position++;
      }
  
    });
    return characters*/
}
exports.fetchHeroes = fetchHeroes;
