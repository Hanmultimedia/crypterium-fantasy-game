"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuState = exports.SummonData = exports.Skill_Character = exports.Skill = exports.Coupon = exports.Equipment = exports.Equipment_Inventory = exports.Potion_Setting = exports.Materials_Inventory = exports.Potion_Inventory = exports.Potion = exports.Character = void 0;
const schema_1 = require("@colyseus/schema");
class Character extends schema_1.Schema {
}
__decorate([
    (0, schema_1.type)("string")
], Character.prototype, "id", void 0);
__decorate([
    (0, schema_1.type)("string")
], Character.prototype, "uid", void 0);
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
    (0, schema_1.type)("uint16")
], Character.prototype, "str", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], Character.prototype, "vit", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], Character.prototype, "int", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], Character.prototype, "dex", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], Character.prototype, "agi", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], Character.prototype, "luk", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], Character.prototype, "exp", void 0);
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
], Character.prototype, "team1", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], Character.prototype, "statPoint", void 0);
__decorate([
    (0, schema_1.type)(["string"])
], Character.prototype, "skill_equip", void 0);
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
    (0, schema_1.type)("number")
], Character.prototype, "arenaAttackPosition", void 0);
__decorate([
    (0, schema_1.type)("number")
], Character.prototype, "arenaDefendPosition", void 0);
exports.Character = Character;
class Potion extends schema_1.Schema {
}
__decorate([
    (0, schema_1.type)("string")
], Potion.prototype, "uid", void 0);
__decorate([
    (0, schema_1.type)("string")
], Potion.prototype, "type", void 0);
__decorate([
    (0, schema_1.type)("string")
], Potion.prototype, "name", void 0);
__decorate([
    (0, schema_1.type)("string")
], Potion.prototype, "effect", void 0);
__decorate([
    (0, schema_1.type)("string")
], Potion.prototype, "effect_type", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], Potion.prototype, "effect_amount", void 0);
__decorate([
    (0, schema_1.type)("string")
], Potion.prototype, "sprite", void 0);
__decorate([
    (0, schema_1.type)("number")
], Potion.prototype, "price", void 0);
exports.Potion = Potion;
class Potion_Inventory extends schema_1.Schema {
}
__decorate([
    (0, schema_1.type)("string")
], Potion_Inventory.prototype, "uid", void 0);
__decorate([
    (0, schema_1.type)("number")
], Potion_Inventory.prototype, "amount", void 0);
exports.Potion_Inventory = Potion_Inventory;
class Materials_Inventory extends schema_1.Schema {
}
__decorate([
    (0, schema_1.type)("string")
], Materials_Inventory.prototype, "uid", void 0);
__decorate([
    (0, schema_1.type)("number")
], Materials_Inventory.prototype, "amount", void 0);
exports.Materials_Inventory = Materials_Inventory;
class Potion_Setting extends schema_1.Schema {
}
__decorate([
    (0, schema_1.type)("string")
], Potion_Setting.prototype, "hp_uid", void 0);
__decorate([
    (0, schema_1.type)("number")
], Potion_Setting.prototype, "hp_percent", void 0);
__decorate([
    (0, schema_1.type)("string")
], Potion_Setting.prototype, "sp_uid", void 0);
__decorate([
    (0, schema_1.type)("number")
], Potion_Setting.prototype, "sp_percent", void 0);
exports.Potion_Setting = Potion_Setting;
class Equipment_Inventory extends schema_1.Schema {
}
__decorate([
    (0, schema_1.type)("string")
], Equipment_Inventory.prototype, "uid", void 0);
__decorate([
    (0, schema_1.type)("number")
], Equipment_Inventory.prototype, "amount", void 0);
exports.Equipment_Inventory = Equipment_Inventory;
class Equipment extends schema_1.Schema {
}
__decorate([
    (0, schema_1.type)("string")
], Equipment.prototype, "uid", void 0);
__decorate([
    (0, schema_1.type)("string")
], Equipment.prototype, "name", void 0);
__decorate([
    (0, schema_1.type)("string")
], Equipment.prototype, "type", void 0);
__decorate([
    (0, schema_1.type)(["string"])
], Equipment.prototype, "abilities", void 0);
__decorate([
    (0, schema_1.type)("string")
], Equipment.prototype, "description", void 0);
__decorate([
    (0, schema_1.type)("number")
], Equipment.prototype, "equipSlot", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], Equipment.prototype, "jobRequired_Archer", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], Equipment.prototype, "jobRequired_Acolyte", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], Equipment.prototype, "jobRequired_Magician", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], Equipment.prototype, "jobRequired_Lancer", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], Equipment.prototype, "jobRequired_Swordman", void 0);
__decorate([
    (0, schema_1.type)("string")
], Equipment.prototype, "icon", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], Equipment.prototype, "isDelete", void 0);
__decorate([
    (0, schema_1.type)("number")
], Equipment.prototype, "aspd", void 0);
__decorate([
    (0, schema_1.type)("number")
], Equipment.prototype, "atk", void 0);
__decorate([
    (0, schema_1.type)("number")
], Equipment.prototype, "cri", void 0);
__decorate([
    (0, schema_1.type)("number")
], Equipment.prototype, "criDamage", void 0);
__decorate([
    (0, schema_1.type)("number")
], Equipment.prototype, "def", void 0);
__decorate([
    (0, schema_1.type)("number")
], Equipment.prototype, "flee", void 0);
__decorate([
    (0, schema_1.type)("number")
], Equipment.prototype, "mAtk", void 0);
__decorate([
    (0, schema_1.type)("number")
], Equipment.prototype, "mDef", void 0);
__decorate([
    (0, schema_1.type)("number")
], Equipment.prototype, "speed", void 0);
__decorate([
    (0, schema_1.type)("number")
], Equipment.prototype, "slot", void 0);
__decorate([
    (0, schema_1.type)("number")
], Equipment.prototype, "price", void 0);
__decorate([
    (0, schema_1.type)("number")
], Equipment.prototype, "hit", void 0);
__decorate([
    (0, schema_1.type)("number")
], Equipment.prototype, "range", void 0);
__decorate([
    (0, schema_1.type)("number")
], Equipment.prototype, "spMAX", void 0);
__decorate([
    (0, schema_1.type)("number")
], Equipment.prototype, "hpMAX", void 0);
exports.Equipment = Equipment;
class Coupon extends schema_1.Schema {
}
__decorate([
    (0, schema_1.type)("string")
], Coupon.prototype, "uid", void 0);
__decorate([
    (0, schema_1.type)("number")
], Coupon.prototype, "quantity", void 0);
exports.Coupon = Coupon;
class Skill extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.jobRequired = new schema_1.ArraySchema();
    }
}
__decorate([
    (0, schema_1.type)("string")
], Skill.prototype, "uid", void 0);
__decorate([
    (0, schema_1.type)(["string"])
], Skill.prototype, "jobRequired", void 0);
__decorate([
    (0, schema_1.type)("string")
], Skill.prototype, "name", void 0);
__decorate([
    (0, schema_1.type)("number")
], Skill.prototype, "level", void 0);
__decorate([
    (0, schema_1.type)("string")
], Skill.prototype, "des", void 0);
exports.Skill = Skill;
class Skill_Character extends schema_1.Schema {
}
__decorate([
    (0, schema_1.type)("string")
], Skill_Character.prototype, "uid", void 0);
__decorate([
    (0, schema_1.type)("string")
], Skill_Character.prototype, "name", void 0);
__decorate([
    (0, schema_1.type)("number")
], Skill_Character.prototype, "level", void 0);
__decorate([
    (0, schema_1.type)("string")
], Skill_Character.prototype, "des", void 0);
exports.Skill_Character = Skill_Character;
class SummonData extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.data = new schema_1.ArraySchema();
    }
}
__decorate([
    (0, schema_1.type)(["string"])
], SummonData.prototype, "data", void 0);
exports.SummonData = SummonData;
class MenuState extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.page = "mainMenu";
        this.characters = new schema_1.ArraySchema();
        this.coupons = new schema_1.ArraySchema();
        this.potions_inventory = new schema_1.ArraySchema();
        this.potions = new schema_1.ArraySchema();
        this.equipments = new schema_1.ArraySchema();
        this.equipments_inventory = new schema_1.ArraySchema();
        this.skills = new schema_1.ArraySchema();
        this.materials_inventory = new schema_1.ArraySchema();
    }
}
__decorate([
    (0, schema_1.type)("string")
], MenuState.prototype, "page", void 0);
__decorate([
    (0, schema_1.type)("string")
], MenuState.prototype, "ethAddress", void 0);
__decorate([
    (0, schema_1.type)("number")
], MenuState.prototype, "diamonds", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], MenuState.prototype, "upgrade_ready", void 0);
__decorate([
    (0, schema_1.type)("number")
], MenuState.prototype, "current_selected_character", void 0);
__decorate([
    (0, schema_1.type)([Character])
], MenuState.prototype, "characters", void 0);
__decorate([
    (0, schema_1.type)([Coupon])
], MenuState.prototype, "coupons", void 0);
__decorate([
    (0, schema_1.type)([Potion_Inventory])
], MenuState.prototype, "potions_inventory", void 0);
__decorate([
    (0, schema_1.type)([Potion])
], MenuState.prototype, "potions", void 0);
__decorate([
    (0, schema_1.type)([Equipment])
], MenuState.prototype, "equipments", void 0);
__decorate([
    (0, schema_1.type)([Equipment_Inventory])
], MenuState.prototype, "equipments_inventory", void 0);
__decorate([
    (0, schema_1.type)(SummonData)
], MenuState.prototype, "summonData", void 0);
__decorate([
    (0, schema_1.type)([Skill])
], MenuState.prototype, "skills", void 0);
__decorate([
    (0, schema_1.type)([Materials_Inventory])
], MenuState.prototype, "materials_inventory", void 0);
exports.MenuState = MenuState;
