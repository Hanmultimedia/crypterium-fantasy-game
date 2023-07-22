"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createShopItem = void 0;
const itemPotionPools_1 = require("./itemPotionPools");
async function createShopItem() {
    const potionPools = (0, itemPotionPools_1.fetchItemPotionPools)();
    return potionPools;
}
exports.createShopItem = createShopItem;
