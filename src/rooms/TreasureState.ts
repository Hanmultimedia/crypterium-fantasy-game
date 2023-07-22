import { Schema, type, ArraySchema, MapSchema} from "@colyseus/schema"

export class Character_T extends Schema {
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
  
  @type("uint16") team1: number;
  @type("uint16") hp: number;
  @type("uint16") sp: number;

  @type("uint16") lastWave: number = 0;
  @type("number") exp: number;
  @type(["string"]) skill_equip: string[];
}

//export class RewardState_T extends Schema {
//  @type({ map: "number"}) data = new MapSchema<number>();
//}

export class TreasureState_T extends Schema {
  @type("uint16") wave: number;
  @type("string") ethAddress: string;
  @type("string") map: string;
  @type("string") dungeonId: string;

  //@type(RewardState_T) rewards: RewardState_T = new RewardState_T()
  
  @type([Character_T]) heroes = new ArraySchema<Character_T>()
  @type([Character_T]) monsters = new ArraySchema<Character_T>()

}

