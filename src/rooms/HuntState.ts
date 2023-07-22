import { Schema, type, ArraySchema} from "@colyseus/schema"

export class Player extends Schema {
  @type("number") x: number;
  @type("number") y: number;
}

export class Character extends Schema {
  @type('string') uid: string;

  @type('string') name: string;
  @type('string') job: string;
  @type('string') rarity: string;

  @type("number") x: number;
  @type("number") y: number;
}

export class HuntState extends Schema {
  @type("number") mapWidth: number;
  @type("number") mapHeight: number;

  @type([Character]) characters = new ArraySchema<Character>();
  @type([Character]) enemies = new ArraySchema<Character>();
}