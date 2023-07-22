"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPotions = void 0;
const MenuState_1 = require("../rooms/MenuState");
const itemPotionPools_1 = require("../services/itemPotionPools");
async function fetchPotions() {
    const potionPools = (0, itemPotionPools_1.fetchItemPotionPools)();
    const potions = [];
    potionPools.forEach((potion) => {
        const p = new MenuState_1.Potion();
        p.uid = potion.uid;
        p.type = potion.type;
        p.name = potion.name;
        p.effect = potion.effect;
        p.effect_type = potion.effect_type;
        p.effect_amount = potion.effect_amount;
        p.sprite = potion.sprite;
        p.price = potion.price;
        potions.push(p);
    });
    return potions;
}
exports.fetchPotions = fetchPotions;
