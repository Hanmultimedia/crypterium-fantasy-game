import { makeStat } from "../utils/initStats";
import { Character } from "../rooms/ArenaState";
import mongoose, { Schema, Document }  from 'mongoose';
import { CharacterSchema } from './character.schema';
import { UserModel } from './user.model';
import { fetchEquipments } from "../services/fetchEquipments";
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

const extractUID = (uid: string): string => {
  const parts = uid.split('+'); // Split the UID by '+'
  return parts[0]; // Return the first part, which is the number
};

export async function fetchArenaEnemies(eth: string,ethEnemies:string): Promise<any> {
  const CharacterModel = mongoose.model('Character', CharacterSchema);
  console.log("ethEnemies"+ethEnemies);
  const users = await UserModel.find({ eth:ethEnemies});
  const enemyCharacters: any[] = [];
  const equipments = await fetchEquipments()

  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    if (user.eth === eth) {
      continue; // exclude characters belonging to the player
    }

    //const excludedEthAddresses = [eth]; // add other eth addresses to exclude, if any

    const characters = await CharacterModel.find({
      ethAddress: user.eth
    }).limit(5);

    if (characters.length < 5) {
      continue; // exclude users with less than 5 characters
    }

    for (let j = 0; j < 5; j++) {
        let data = characters[j]
        data = calcNFTBonus2(data)
        const character_forstat = new CharacterTemplate(data.attributes,data.job,data.uid,"",0,data.level,data.hp,data.sp,data.speed,data.range)
        const stat = makeStat(character_forstat)
        const characer = new Character()

        //
        characer.id = data.id
        characer.uid = data.uid
        characer.level = data.level
        characer.job = data.job
        characer.name = data.name
        characer.position = j

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
  const uidWithoutSuffix = extractUID(data.equipments.slot_0);

  const equipment = equipments.find(c => c.uid === data.equipments.slot_0);
  if(equipment){
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
    }

    if(data.equipments.slot_1)
    {
  const uidWithoutSuffix = extractUID(data.equipments.slot_1);
  const equipment = equipments.find(c => c.uid === data.equipments.slot_1);
  if(equipment){
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
    }

    if(data.equipments.slot_2)
    {
  const uidWithoutSuffix = extractUID(data.equipments.slot_2);
  const equipment = equipments.find(c => c.uid === data.equipments.slot_2);
  if(equipment){
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
    }

    if(data.equipments.slot_3)
    {
  const uidWithoutSuffix = extractUID(data.equipments.slot_3);
  const equipment = equipments.find(c => c.uid === data.equipments.slot_3);
  if(equipment){
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
    }

    if(data.equipments.slot_4)
    {
  const uidWithoutSuffix = extractUID(data.equipments.slot_4);
  const equipment = equipments.find(c => c.uid === data.equipments.slot_4);
  if(equipment){
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
    }

    if(data.equipments.slot_5)
    {
  const uidWithoutSuffix = extractUID(data.equipments.slot_5);
  const equipment = equipments.find(c => c.uid === data.equipments.slot_5);
  if(equipment){
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
    }

    if(data.equipments.slot_6)
    {
  const uidWithoutSuffix = extractUID(data.equipments.slot_6);
  const equipment = equipments.find(c => c.uid === data.equipments.slot_6);
  if(equipment){
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
    }

    if(data.equipments.slot_7)
    {
  const uidWithoutSuffix = extractUID(data.equipments.slot_7);
  const equipment = equipments.find(c => c.uid === data.equipments.slot_7);
  if(equipment){
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
    }

    if(data.equipments.slot_8)
    {
  const uidWithoutSuffix = extractUID(data.equipments.slot_8);
  const equipment = equipments.find(c => c.uid === data.equipments.slot_8);
  if(equipment){
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
    }
    characer.exp = data.exp ? data.exp: 0
    enemyCharacters.push(characer);      
    }

    if(enemyCharacters.length >= 5)
    {
      break;
    }

  }

  if (enemyCharacters.length === 0) {
    return null;
  }

  return enemyCharacters;
}

