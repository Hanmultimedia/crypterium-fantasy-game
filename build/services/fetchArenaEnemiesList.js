"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchArenaEnemiesList = void 0;
const initStats_1 = require("../utils/initStats");
const MenuState_1 = require("../rooms/MenuState");
const mongoose_1 = __importDefault(require("mongoose"));
const character_schema_1 = require("./character.schema");
const user_model_1 = require("./user.model");
const fetchEquipments_1 = require("../services/fetchEquipments");
const equipmentUtils_1 = require("../utils/equipmentUtils");
const schema_1 = require("@colyseus/schema");
class CharacterTemplate {
    constructor(attributes, job, uid, slug, position, level, hp, sp, speed, range) {
        this.attributes = attributes;
        this.job = job;
        this.uid = uid;
        this.slug = slug;
        this.position = position;
        this.level = level;
        this.hp = hp;
        this.sp = sp;
        this.speed = speed;
        this.range = range;
    }
}
async function fetchArenaEnemiesList(eth, battlepoint) {
    const CharacterModel = mongoose_1.default.model('Character', character_schema_1.CharacterSchema);
    let users = await user_model_1.UserModel.find({
        $and: [
            { eth: { $ne: eth } },
            {
                $or: [
                    { battlepoint: { $gte: battlepoint - 10, $lte: battlepoint + 10 } },
                    { battlepoint: { $exists: false } },
                    { battlepoint: null } // Include documents where battlepoint is null
                ]
            }
        ]
    }).limit(5);
    if (users.length < 5) {
        const additionalUsersCount = 5 - users.length;
        const additionalUsers = await user_model_1.UserModel.aggregate([
            { $sample: { size: additionalUsersCount } }
        ]);
        users.push(...additionalUsers);
    }
    const fetchedEnemiesList = new schema_1.ArraySchema();
    const equipments = await (0, fetchEquipments_1.fetchEquipments)();
    const maxFetchedCount = 5;
    const getRandomIndices = (arrayLength, maxItems) => {
        const indices = Array.from({ length: arrayLength }, (_, i) => i);
        const shuffled = indices.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, maxItems);
    };
    // Function to shuffle users
    const shuffleUsers = (usersArray, maxItems) => {
        const indices = getRandomIndices(usersArray.length, maxItems);
        const shuffledUsers = indices.map((index) => usersArray[index]);
        return shuffledUsers;
    };
    const extractUID = (uid) => {
        const parts = uid.split('+'); // Split the UID by '+'
        return parts[0]; // Return the first part, which is the number
    };
    // Get shuffled users
    const shuffledUsers = shuffleUsers(users, maxFetchedCount);
    for (const user of users) {
        //console.log(`Fetching characters for user with eth: ${user.eth}`);
        const excludedEthAddresses = [eth]; // add other eth addresses to exclude, if any
        const characters = await CharacterModel.find({
            ethAddress: user.eth // Fetch characters based on the current user's eth address
        }).limit(5);
        if (characters.length >= 5) {
            //console.log(`Found ${characters.length} characters for user ${user.eth}`);
            const enemyCharacters = new schema_1.ArraySchema();
            //console.log("uid")
            for (let j = 0; j < 5; j++) {
                //console.log(`Loop  characters ${j} for user ${user.eth}`);
                let data = characters[j];
                // Additional processing and character creation steps...
                data = (0, equipmentUtils_1.calcNFTBonus2)(data);
                const character_forstat = new CharacterTemplate(data.attributes, data.job, data.uid, "", 0, data.level, data.hp, data.sp, data.speed, data.range);
                const stat = (0, initStats_1.makeStat)(character_forstat);
                const characer = new MenuState_1.Character();
                //
                characer.id = data.id;
                characer.uid = data.uid;
                characer.ethAddress = user.eth;
                //console.log(characer.id + " " +user.eth + " " + data.level)
                characer.level = data.level;
                characer.job = data.job;
                characer.name = data.name;
                characer.position = j;
                if (typeof data.skill_equip === 'undefined') {
                    characer.skill_equip = ["", "", "", ""];
                }
                else {
                    characer.skill_equip = data.skill_equip;
                }
                characer.atk = stat.atk;
                characer.def = stat.def;
                characer.mAtk = stat.mAtk;
                characer.mDef = stat.mDef;
                characer.hpMAX = stat.hpMAX;
                characer.spMAX = stat.spMAX;
                characer.hpMAX += (5 * data.level);
                characer.spMAX += (2 * data.level);
                characer.hit = stat.hit;
                characer.flee = stat.flee;
                characer.cri = stat.cri;
                characer.aspd = stat.aspd;
                characer.speed = stat.speed;
                characer.range = stat.range;
                characer.exp = data.exp;
                characer.hp = stat.hpMAX;
                characer.sp = stat.spMAX;
                if (data.skill_equip) {
                    characer.skill_equip = data.skill_equip;
                }
                else {
                    characer.skill_equip = [];
                }
                if (data.equipments.slot_0) {
                    const uidWithoutSuffix = extractUID(data.equipments.slot_0);
                    const equipment = equipments.find(c => c.uid === data.equipments.slot_0);
                    if (equipment) {
                        characer.atk += equipment.atk;
                        characer.def += equipment.def;
                        characer.mAtk += equipment.mAtk;
                        characer.mDef += equipment.mDef;
                        characer.hpMAX += equipment.hpMAX;
                        characer.spMAX += equipment.spMAX;
                        characer.hit += equipment.hit;
                        characer.flee += equipment.flee;
                        characer.cri += equipment.cri;
                        characer.aspd += equipment.aspd;
                        characer.speed += equipment.speed;
                        characer.range += equipment.range;
                    }
                }
                if (data.equipments.slot_1) {
                    const uidWithoutSuffix = extractUID(data.equipments.slot_1);
                    const equipment = equipments.find(c => c.uid === data.equipments.slot_1);
                    if (equipment) {
                        characer.atk += equipment.atk;
                        characer.def += equipment.def;
                        characer.mAtk += equipment.mAtk;
                        characer.mDef += equipment.mDef;
                        characer.hpMAX += equipment.hpMAX;
                        characer.spMAX += equipment.spMAX;
                        characer.hit += equipment.hit;
                        characer.flee += equipment.flee;
                        characer.cri += equipment.cri;
                        characer.aspd += equipment.aspd;
                        characer.speed += equipment.speed;
                        characer.range += equipment.range;
                    }
                }
                if (data.equipments.slot_2) {
                    const uidWithoutSuffix = extractUID(data.equipments.slot_2);
                    const equipment = equipments.find(c => c.uid === data.equipments.slot_2);
                    if (equipment) {
                        characer.atk += equipment.atk;
                        characer.def += equipment.def;
                        characer.mAtk += equipment.mAtk;
                        characer.mDef += equipment.mDef;
                        characer.hpMAX += equipment.hpMAX;
                        characer.spMAX += equipment.spMAX;
                        characer.hit += equipment.hit;
                        characer.flee += equipment.flee;
                        characer.cri += equipment.cri;
                        characer.aspd += equipment.aspd;
                        characer.speed += equipment.speed;
                        characer.range += equipment.range;
                    }
                }
                if (data.equipments.slot_3) {
                    const uidWithoutSuffix = extractUID(data.equipments.slot_3);
                    const equipment = equipments.find(c => c.uid === data.equipments.slot_3);
                    if (equipment) {
                        characer.atk += equipment.atk;
                        characer.def += equipment.def;
                        characer.mAtk += equipment.mAtk;
                        characer.mDef += equipment.mDef;
                        characer.hpMAX += equipment.hpMAX;
                        characer.spMAX += equipment.spMAX;
                        characer.hit += equipment.hit;
                        characer.flee += equipment.flee;
                        characer.cri += equipment.cri;
                        characer.aspd += equipment.aspd;
                        characer.speed += equipment.speed;
                        characer.range += equipment.range;
                    }
                }
                if (data.equipments.slot_4) {
                    const uidWithoutSuffix = extractUID(data.equipments.slot_4);
                    const equipment = equipments.find(c => c.uid === data.equipments.slot_4);
                    if (equipment) {
                        characer.atk += equipment.atk;
                        characer.def += equipment.def;
                        characer.mAtk += equipment.mAtk;
                        characer.mDef += equipment.mDef;
                        characer.hpMAX += equipment.hpMAX;
                        characer.spMAX += equipment.spMAX;
                        characer.hit += equipment.hit;
                        characer.flee += equipment.flee;
                        characer.cri += equipment.cri;
                        characer.aspd += equipment.aspd;
                        characer.speed += equipment.speed;
                        characer.range += equipment.range;
                    }
                }
                if (data.equipments.slot_5) {
                    const uidWithoutSuffix = extractUID(data.equipments.slot_5);
                    const equipment = equipments.find(c => c.uid === data.equipments.slot_5);
                    if (equipment) {
                        characer.atk += equipment.atk;
                        characer.def += equipment.def;
                        characer.mAtk += equipment.mAtk;
                        characer.mDef += equipment.mDef;
                        characer.hpMAX += equipment.hpMAX;
                        characer.spMAX += equipment.spMAX;
                        characer.hit += equipment.hit;
                        characer.flee += equipment.flee;
                        characer.cri += equipment.cri;
                        characer.aspd += equipment.aspd;
                        characer.speed += equipment.speed;
                        characer.range += equipment.range;
                    }
                }
                if (data.equipments.slot_6) {
                    const uidWithoutSuffix = extractUID(data.equipments.slot_6);
                    const equipment = equipments.find(c => c.uid === data.equipments.slot_6);
                    if (equipment) {
                        characer.atk += equipment.atk;
                        characer.def += equipment.def;
                        characer.mAtk += equipment.mAtk;
                        characer.mDef += equipment.mDef;
                        characer.hpMAX += equipment.hpMAX;
                        characer.spMAX += equipment.spMAX;
                        characer.hit += equipment.hit;
                        characer.flee += equipment.flee;
                        characer.cri += equipment.cri;
                        characer.aspd += equipment.aspd;
                        characer.speed += equipment.speed;
                        characer.range += equipment.range;
                    }
                }
                if (data.equipments.slot_7) {
                    const uidWithoutSuffix = extractUID(data.equipments.slot_7);
                    const equipment = equipments.find(c => c.uid === data.equipments.slot_7);
                    if (equipment) {
                        characer.atk += equipment.atk;
                        characer.def += equipment.def;
                        characer.mAtk += equipment.mAtk;
                        characer.mDef += equipment.mDef;
                        characer.hpMAX += equipment.hpMAX;
                        characer.spMAX += equipment.spMAX;
                        characer.hit += equipment.hit;
                        characer.flee += equipment.flee;
                        characer.cri += equipment.cri;
                        characer.aspd += equipment.aspd;
                        characer.speed += equipment.speed;
                        characer.range += equipment.range;
                    }
                }
                if (data.equipments.slot_8) {
                    const uidWithoutSuffix = extractUID(data.equipments.slot_8);
                    const equipment = equipments.find(c => c.uid === data.equipments.slot_8);
                    if (equipment) {
                        characer.atk += equipment.atk;
                        characer.def += equipment.def;
                        characer.mAtk += equipment.mAtk;
                        characer.mDef += equipment.mDef;
                        characer.hpMAX += equipment.hpMAX;
                        characer.spMAX += equipment.spMAX;
                        characer.hit += equipment.hit;
                        characer.flee += equipment.flee;
                        characer.cri += equipment.cri;
                        characer.aspd += equipment.aspd;
                        characer.speed += equipment.speed;
                        characer.range += equipment.range;
                    }
                }
                characer.exp = data.exp ? data.exp : 0;
                // Inside the loop where enemyCharacters is populated
                // Push the character into the enemyCharacters array
                enemyCharacters.push(characer);
                if (j == 4) {
                    //console.log(`Characters for user ${user.eth}:`);
                    //console.log(enemyCharacters);
                }
            }
            // Add the set of enemy characters into the fetchedEnemiesList
            fetchedEnemiesList.push(enemyCharacters);
        }
        else {
            //console.log(`User ${user.eth} does not have sufficient characters`);
        }
        if (fetchedEnemiesList.length >= maxFetchedCount) {
            //console.log(`Reached maximum count of fetched enemies (${maxFetchedCount})`);
            break;
        }
    }
    // Pad the fetchedEnemiesList with null values if necessary
    /*console.log("******");
    console.log("fetchedEnemiesList:");
    console.log(fetchedEnemiesList);
    console.log("******");
    */
    if (fetchedEnemiesList.length === 0) {
        console.log("No fetched enemies found.");
        return null;
    }
    //console.log("First ArraySchema in fetchedEnemiesList:");
    //const firstEnemyTeam = fetchedEnemiesList.find((_, index) => index === 0);
    //console.log(firstEnemyTeam);
    return fetchedEnemiesList;
}
exports.fetchArenaEnemiesList = fetchArenaEnemiesList;
