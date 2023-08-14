import { Schema, type, ArraySchema} from "@colyseus/schema"

export class Character extends Schema {
  @type("string") id: string;
  @type("string") uid: string;
  @type("uint16") level: number;
  @type("string") job:string;
  @type("string") name:string;

  @type("uint16") str: number;
  @type("uint16") vit: number;
  @type("uint16") int: number;
  @type("uint16") dex: number;
  @type("uint16") agi: number;
  @type("uint16") luk: number;

  @type("uint16") exp: number;

  @type("uint16") atk: number;
  @type("uint16") def: number;
  @type("uint16") mAtk: number;
  @type("uint16") mDef: number;
  @type("uint32") hpMAX: number;
  @type("uint32") spMAX: number;
  @type("uint16") hit: number;
  @type("uint16") flee: number;
  @type("number") cri: number;
  @type("number") aspd: number;
  @type("number") speed: number;
  @type("uint16") range: number;
  @type("uint16") team1: number;
  @type("uint16") statPoint: number;
  @type(["string"]) skill_equip:string[];

  @type("uint16") treasure1: number;
  @type("uint16") treasure2: number;
  @type("uint16") treasure3: number;

  @type("string") slot_0:string;
  @type("string") slot_1:string;
  @type("string") slot_2:string;
  @type("string") slot_3:string;
  @type("string") slot_4:string;
  @type("string") slot_5:string;
  @type("string") slot_6:string;
  @type("string") slot_7:string;
  @type("number") arenaAttackPosition: number;
  @type("number") arenaDefendPosition: number;

}

export class Potion extends Schema {
  @type("string") uid: string;
  @type("string") type: string;
  @type("string") name: string;
  @type("string") effect: string;
  @type("string") effect_type: string;
  @type("uint16") effect_amount: number;
  @type("string") sprite: string;
  @type("number") price: number;
}

export class Potion_Inventory extends Schema {
  @type("string") uid: string;
  @type("number") amount: number;
}

export class Materials_Inventory extends Schema {
  @type("string") uid: string;
  @type("number") amount: number;
}

export class Potion_Setting extends Schema {
  @type("string") hp_uid: string;
  @type("number") hp_percent: number;
  @type("string") sp_uid: string;
  @type("number") sp_percent: number;
}

export class Equipment_Inventory extends Schema {
  @type("string") uid: string;
  @type("number") amount: number;
}

export class Equipment extends Schema 
{
  @type("string") uid: string;
  @type("string") name: string;
  @type("string") type: string;
  @type(["string"]) abilities: string[];
  @type("string") description: string;
  @type("number") equipSlot: number;

  @type("boolean") jobRequired_Archer: boolean;
  @type("boolean") jobRequired_Acolyte: boolean;
  @type("boolean") jobRequired_Magician: boolean;
  @type("boolean") jobRequired_Lancer: boolean;
  @type("boolean") jobRequired_Swordman: boolean;

  @type("string") icon: string;
  @type("boolean") isDelete: boolean;

  @type("number") aspd: number;
  @type("number") atk: number;
  @type("number") cri: number;
  @type("number") criDamage: number;
  @type("number") def: number;
  @type("number") flee: number;
  @type("number") mAtk: number;
  @type("number") mDef: number;
  @type("number") speed: number;
  @type("number") slot: number;
  @type("number") price: number;

  @type("number") hit: number;
  @type("number") range: number;
  @type("number") spMAX: number;
  @type("number") hpMAX: number;

}

export class Coupon extends Schema {
  @type("string") uid: string;
  @type("number") quantity: number;
}

export class Skill extends Schema {
  @type("string") uid: string;
  @type(["string"]) jobRequired = new ArraySchema<string>();
  @type("string") name: string;
  @type("number") level: number;
  @type("string") des: string;
}

export class Skill_Character extends Schema {
  @type("string") uid: string;
  @type("string") name: string;
  @type("number") level: number;
  @type("string") des: string;
}

export class SummonData extends Schema {
  @type(["string"]) data = new ArraySchema<string>();
}

export class MenuState extends Schema {
  @type("string") page: string = "mainMenu";
  @type("string") ethAddress: string;
  @type("number") profilepic: number;
  @type("string") profilename: string;
  @type("number") diamonds: number;

  @type("boolean") upgrade_ready: boolean;

  @type("number") current_selected_character: number;

  @type([Character]) characters = new ArraySchema<Character>();
  @type([Coupon]) coupons = new ArraySchema<Coupon>();

  @type([Potion_Inventory]) potions_inventory = new ArraySchema<Potion_Inventory>();
  @type([Potion]) potions = new ArraySchema<Potion>();

  @type([Equipment]) equipments = new ArraySchema<Equipment>();
  @type([Equipment_Inventory]) equipments_inventory = new ArraySchema<Equipment_Inventory>();

  @type(SummonData) summonData: SummonData;

  @type([Skill]) skills = new ArraySchema<Skill>();

  @type([Materials_Inventory]) materials_inventory = new ArraySchema<Materials_Inventory>();

  @type("number") bit: number;
  @type("number") doge: number;
  @type("number") coin: number;
  
}



