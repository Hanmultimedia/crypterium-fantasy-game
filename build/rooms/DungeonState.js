"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DungeonState = exports.RewardState = exports.Character_Array = exports.Character = void 0;
const schema_1 = require("@colyseus/schema");
class Character extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.lastWave = 0;
    }
}
exports.Character = Character;
__decorate([
    (0, schema_1.type)("string")
], Character.prototype, "id", void 0);
__decorate([
    (0, schema_1.type)("string")
], Character.prototype, "uid", void 0);
__decorate([
    (0, schema_1.type)("uint8")
], Character.prototype, "position", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], Character.prototype, "level", void 0);
__decorate([
    (0, schema_1.type)("string")
], Character.prototype, "job", void 0);
__decorate([
    (0, schema_1.type)("string")
], Character.prototype, "name", void 0);
__decorate([
    (0, schema_1.type)("string")
], Character.prototype, "slot_0", void 0);
__decorate([
    (0, schema_1.type)("string")
], Character.prototype, "slot_1", void 0);
__decorate([
    (0, schema_1.type)("string")
], Character.prototype, "slot_2", void 0);
__decorate([
    (0, schema_1.type)("string")
], Character.prototype, "slot_3", void 0);
__decorate([
    (0, schema_1.type)("string")
], Character.prototype, "slot_4", void 0);
__decorate([
    (0, schema_1.type)("string")
], Character.prototype, "slot_5", void 0);
__decorate([
    (0, schema_1.type)("string")
], Character.prototype, "slot_6", void 0);
__decorate([
    (0, schema_1.type)("string")
], Character.prototype, "slot_7", void 0);
__decorate([
    (0, schema_1.type)("string")
], Character.prototype, "slot_8", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], Character.prototype, "atk", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], Character.prototype, "def", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], Character.prototype, "mAtk", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], Character.prototype, "mDef", void 0);
__decorate([
    (0, schema_1.type)("uint32")
], Character.prototype, "hpMAX", void 0);
__decorate([
    (0, schema_1.type)("uint32")
], Character.prototype, "spMAX", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], Character.prototype, "hit", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], Character.prototype, "flee", void 0);
__decorate([
    (0, schema_1.type)("number")
], Character.prototype, "cri", void 0);
__decorate([
    (0, schema_1.type)("number")
], Character.prototype, "aspd", void 0);
__decorate([
    (0, schema_1.type)("number")
], Character.prototype, "speed", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], Character.prototype, "range", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], Character.prototype, "treasure1", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], Character.prototype, "treasure2", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], Character.prototype, "treasure3", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], Character.prototype, "team1", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], Character.prototype, "hp", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], Character.prototype, "sp", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], Character.prototype, "lastWave", void 0);
__decorate([
    (0, schema_1.type)("number")
], Character.prototype, "exp", void 0);
__decorate([
    (0, schema_1.type)(["string"])
], Character.prototype, "skill_equip", void 0);
__decorate([
    (0, schema_1.type)("uint8")
], Character.prototype, "str", void 0);
__decorate([
    (0, schema_1.type)("uint8")
], Character.prototype, "agi", void 0);
__decorate([
    (0, schema_1.type)("uint8")
], Character.prototype, "dex", void 0);
__decorate([
    (0, schema_1.type)("uint8")
], Character.prototype, "luk", void 0);
__decorate([
    (0, schema_1.type)("uint8")
], Character.prototype, "vit", void 0);
__decorate([
    (0, schema_1.type)("uint8")
], Character.prototype, "int", void 0);
class Character_Array extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.character = new schema_1.ArraySchema();
    }
}
exports.Character_Array = Character_Array;
__decorate([
    (0, schema_1.type)([Character])
], Character_Array.prototype, "character", void 0);
class RewardState extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.data = new schema_1.MapSchema();
    }
}
exports.RewardState = RewardState;
__decorate([
    (0, schema_1.type)({ map: "number" })
], RewardState.prototype, "data", void 0);
class DungeonState extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.rewards = new RewardState();
        this.heroes = new schema_1.ArraySchema();
        this.monsters = new schema_1.ArraySchema();
        this.spawners_monsters = new schema_1.ArraySchema();
        this.spawners_chests = new schema_1.ArraySchema();
        this.spawners_boss = new schema_1.ArraySchema();
        this.characterBuff1 = false;
        this.characterBuff2 = false;
        this.buffDescriptions = new schema_1.ArraySchema();
        this.buffs1 = new schema_1.ArraySchema();
        this.buffs2 = new schema_1.ArraySchema();
        this.buffs3 = new schema_1.ArraySchema();
    }
}
exports.DungeonState = DungeonState;
__decorate([
    (0, schema_1.type)("uint16")
], DungeonState.prototype, "wave", void 0);
__decorate([
    (0, schema_1.type)("number")
], DungeonState.prototype, "drop", void 0);
__decorate([
    (0, schema_1.type)("number")
], DungeonState.prototype, "diamond", void 0);
__decorate([
    (0, schema_1.type)("number")
], DungeonState.prototype, "bit", void 0);
__decorate([
    (0, schema_1.type)("number")
], DungeonState.prototype, "doge", void 0);
__decorate([
    (0, schema_1.type)("number")
], DungeonState.prototype, "coin", void 0);
__decorate([
    (0, schema_1.type)("number")
], DungeonState.prototype, "star", void 0);
__decorate([
    (0, schema_1.type)("string")
], DungeonState.prototype, "ethAddress", void 0);
__decorate([
    (0, schema_1.type)("string")
], DungeonState.prototype, "map", void 0);
__decorate([
    (0, schema_1.type)("string")
], DungeonState.prototype, "dungeonId", void 0);
__decorate([
    (0, schema_1.type)(RewardState)
], DungeonState.prototype, "rewards", void 0);
__decorate([
    (0, schema_1.type)([Character])
], DungeonState.prototype, "heroes", void 0);
__decorate([
    (0, schema_1.type)([Character])
], DungeonState.prototype, "monsters", void 0);
__decorate([
    (0, schema_1.type)([Character_Array])
], DungeonState.prototype, "spawners_monsters", void 0);
__decorate([
    (0, schema_1.type)([Character_Array])
], DungeonState.prototype, "spawners_chests", void 0);
__decorate([
    (0, schema_1.type)([Character_Array])
], DungeonState.prototype, "spawners_boss", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], DungeonState.prototype, "characterBuff1", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], DungeonState.prototype, "characterBuff2", void 0);
__decorate([
    (0, schema_1.type)(["string"])
], DungeonState.prototype, "buffDescriptions", void 0);
__decorate([
    (0, schema_1.type)(["boolean"])
], DungeonState.prototype, "buffs1", void 0);
__decorate([
    (0, schema_1.type)(["boolean"])
], DungeonState.prototype, "buffs2", void 0);
__decorate([
    (0, schema_1.type)(["boolean"])
], DungeonState.prototype, "buffs3", void 0);
