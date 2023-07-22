"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcReward = exports.randomRewards = void 0;
function randomRewards(config, rewards) {
    rewards.diamond += config.diamond;
    rewards.exp += config.exp;
    config.items.forEach((item) => {
        if (!rewards[item.uid]) {
            rewards[item.uid] = calcReward(item.percent, item.tick);
        }
        else {
            rewards[item.uid] += calcReward(item.percent, item.tick);
        }
    });
}
exports.randomRewards = randomRewards;
function calcReward(percent, tick) {
    let quantity = 0;
    for (let i = 0; i < tick; i++) {
        if (percent < Math.random()) {
            quantity++;
        }
    }
    return quantity;
}
exports.calcReward = calcReward;
