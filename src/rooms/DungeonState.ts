import { Schema, type, ArraySchema, MapSchema} from "@colyseus/schema"

export class Character extends Schema {
  @type("string") id: string;
  @type("string") uid: string;
  @type("uint8") position: number;
  @type("uint16") level: number;
  @type("string") job:string;
  @type("string") name:string;
  
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
  
  @type("uint16") treasure1: number;
  @type("uint16") treasure2: number;
  @type("uint16") treasure3: number;

  @type("uint16") team1: number;
  @type("uint16") hp: number;
  @type("uint16") sp: number;

  @type("uint16") lastWave: number = 0;
  @type("number") exp: number;
  @type(["string"]) skill_equip: string[];

  @type("uint8") str: number;
  @type("uint8") agi: number;
  @type("uint8") dex: number;
  @type("uint8") luk: number;
  @type("uint8") vit: number;
  @type("uint8") int: number;
}

export class Character_Array extends Schema {
  @type([Character]) character = new ArraySchema<Character>();
}

export class RewardState extends Schema {
  @type({ map: "number"}) data = new MapSchema<number>();
}

export class DungeonState extends Schema {
  @type("uint16") wave: number;
  @type("number") drop: number;
  
  @type("number") diamond: number;
  @type("number") bit: number;
  @type("number") doge: number;
  @type("number") coin: number;

  @type("number") star: number;

  @type("string") ethAddress: string;
  @type("string") map: string;
  @type("string") dungeonId: string;

  @type(RewardState) rewards: RewardState = new RewardState()
  
  @type([Character]) heroes = new ArraySchema<Character>()
  @type([Character]) monsters = new ArraySchema<Character>()

  @type([Character_Array]) spawners_monsters = new ArraySchema<Character_Array>()
  @type([Character_Array]) spawners_chests = new ArraySchema<Character_Array>()
  @type([Character_Array]) spawners_boss = new ArraySchema<Character_Array>()

  @type("boolean") characterBuff1: boolean = false;
  @type("boolean") characterBuff2: boolean = false;

  @type(["boolean"]) buffs1: ArraySchema<boolean> = new ArraySchema<boolean>();
  @type(["boolean"]) buffs2: ArraySchema<boolean> = new ArraySchema<boolean>();
  @type(["boolean"]) buffs3: ArraySchema<boolean> = new ArraySchema<boolean>();
}

