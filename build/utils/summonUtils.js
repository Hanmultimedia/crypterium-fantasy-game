"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcHeroSPMax = exports.calcHeroHPMax = exports.calcStatBonus = exports.calcBonus = exports.randomIndex = exports.createDistribution = void 0;
function createDistribution(array, weights, size) {
    const distribution = [];
    const sum = weights.reduce((a, b) => a + b);
    const quant = size / sum;
    for (let i = 0; i < array.length; ++i) {
        const limit = quant * weights[i];
        for (let j = 0; j < limit; ++j) {
            distribution.push(i);
        }
    }
    return distribution;
}
exports.createDistribution = createDistribution;
;
function randomIndex(distribution) {
    const index = Math.floor(distribution.length * Math.random());
    return distribution[index];
}
exports.randomIndex = randomIndex;
;
function calcBonus(character, key) {
    const max = character.bonus[key];
    const bonus = Math.floor(max * Math.random());
    return bonus;
}
exports.calcBonus = calcBonus;
function calcStatBonus(character, key, bonus) {
    return character[key] + bonus[key];
}
exports.calcStatBonus = calcStatBonus;
function calcHeroHPMax(character) {
    let bonus = 0;
    bonus += (character.level) * 28;
    if (character.job === 'Swordman') {
        bonus += (character.level * 5);
    }
    let vit = character.attributes.vit;
    return Math.floor(character.hp + (vit * 25));
}
exports.calcHeroHPMax = calcHeroHPMax;
function calcHeroSPMax(character) {
    let bonus = 0;
    bonus += (character.level * 10);
    if (character.job === 'Acolyte' || character.job === 'Magician') {
        bonus += (character.level * 5);
    }
    let int = character.attributes.int;
    return Math.floor(character.sp + ((int / 2) * 10));
}
exports.calcHeroSPMax = calcHeroSPMax;
