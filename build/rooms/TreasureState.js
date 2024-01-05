"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreasureState_T = exports.Character_T = void 0;
const schema_1 = require("@colyseus/schema");
class Character_T extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.lastWave = 0;
    }
}
exports.Character_T = Character_T;
__decorate([
    (0, schema_1.type)("string")
], Character_T.prototype, "id", void 0);
__decorate([
    (0, schema_1.type)("string")
], Character_T.prototype, "uid", void 0);
__decorate([
    (0, schema_1.type)("uint8")
], Character_T.prototype, "position", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], Character_T.prototype, "level", void 0);
__decorate([
    (0, schema_1.type)("string")
], Character_T.prototype, "job", void 0);
__decorate([
    (0, schema_1.type)("string")
], Character_T.prototype, "name", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], Character_T.prototype, "atk", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], Character_T.prototype, "def", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], Character_T.prototype, "mAtk", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], Character_T.prototype, "mDef", void 0);
__decorate([
    (0, schema_1.type)("uint32")
], Character_T.prototype, "hpMAX", void 0);
__decorate([
    (0, schema_1.type)("uint32")
], Character_T.prototype, "spMAX", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], Character_T.prototype, "hit", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], Character_T.prototype, "flee", void 0);
__decorate([
    (0, schema_1.type)("number")
], Character_T.prototype, "cri", void 0);
__decorate([
    (0, schema_1.type)("number")
], Character_T.prototype, "aspd", void 0);
__decorate([
    (0, schema_1.type)("number")
], Character_T.prototype, "speed", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], Character_T.prototype, "range", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], Character_T.prototype, "team1", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], Character_T.prototype, "hp", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], Character_T.prototype, "sp", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], Character_T.prototype, "lastWave", void 0);
__decorate([
    (0, schema_1.type)("number")
], Character_T.prototype, "exp", void 0);
__decorate([
    (0, schema_1.type)(["string"])
], Character_T.prototype, "skill_equip", void 0);
//export class RewardState_T extends Schema {
//  @type({ map: "number"}) data = new MapSchema<number>();
//}
class TreasureState_T extends schema_1.Schema {
    constructor() {
        super(...arguments);
        //@type(RewardState_T) rewards: RewardState_T = new RewardState_T()
        this.heroes = new schema_1.ArraySchema();
        this.monsters = new schema_1.ArraySchema();
    }
}
exports.TreasureState_T = TreasureState_T;
__decorate([
    (0, schema_1.type)("uint16")
], TreasureState_T.prototype, "wave", void 0);
__decorate([
    (0, schema_1.type)("string")
], TreasureState_T.prototype, "ethAddress", void 0);
__decorate([
    (0, schema_1.type)("string")
], TreasureState_T.prototype, "map", void 0);
__decorate([
    (0, schema_1.type)("string")
], TreasureState_T.prototype, "dungeonId", void 0);
__decorate([
    (0, schema_1.type)([Character_T])
], TreasureState_T.prototype, "heroes", void 0);
__decorate([
    (0, schema_1.type)([Character_T])
], TreasureState_T.prototype, "monsters", void 0);
