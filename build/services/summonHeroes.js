"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.summonHeroes = exports.userSchema = void 0;
const pools_1 = require("./pools");
const fetchCharacterRatings_1 = require("./fetchCharacterRatings");
const fetchRarityRatings_1 = require("./fetchRarityRatings");
const fetchCoupons_1 = require("./fetchCoupons");
const summonUtils_1 = require("../utils/summonUtils");
const mongoose_1 = __importDefault(require("mongoose"));
const character_schema_1 = require("./character.schema");
exports.userSchema = new mongoose_1.default.Schema({
    eth: String,
    diamond: Number,
    coupon: Number,
    coupon2: Number
    // other fields as required
});
async function summonHeroes(eth, summon) {
    if (summon <= 0) {
        throw new Error("invalid amount of summons");
    }
    const coupon = await (0, fetchCoupons_1.fetchCoupons)(eth);
    console.log(coupon);
    //const coupon = await fetchCouponsByUID(eth, '100001')
    if (coupon.quantity < summon) {
        throw new Error("invalid coupon quantity");
    }
    const characterPools = (0, pools_1.fetchCharacterPool)();
    const characterRatings = await (0, fetchCharacterRatings_1.fetchCharacterRatings)('standard');
    const rarityRatings = await (0, fetchRarityRatings_1.fetchRarityRatings)('free-standard');
    if (!characterPools || !characterRatings || !rarityRatings) {
        throw new Error("Not found character pool!");
    }
    const jobs = [];
    const jobWeights = [];
    for (let key in characterRatings) {
        jobs.push(key);
        jobWeights.push(characterRatings[key]);
    }
    const jobPool = (0, summonUtils_1.createDistribution)(jobs, jobWeights, 100);
    const rarities = [];
    const rarityWeights = [];
    for (let key in rarityRatings) {
        rarities.push(key);
        rarityWeights.push(rarityRatings[key]);
    }
    const rarityPool = (0, summonUtils_1.createDistribution)(rarities, rarityWeights, 100);
    const summonList = [];
    for (let i = 0; i < summon; i++) {
        const jobIndex = (0, summonUtils_1.randomIndex)(jobPool);
        const rarityIndex = (0, summonUtils_1.randomIndex)(rarityPool);
        const char = {
            job: jobs[jobIndex],
            rarity: rarities[rarityIndex],
        };
        //console.log("char.job " + char.job + " char.rarity " + char.rarity)
        const obj = characterPools.find(c => c.job === char.job && c.rarity === char.rarity);
        const bonus = {
            str: (0, summonUtils_1.calcBonus)(obj, 'str'),
            agi: (0, summonUtils_1.calcBonus)(obj, 'agi'),
            int: (0, summonUtils_1.calcBonus)(obj, 'int'),
            vit: (0, summonUtils_1.calcBonus)(obj, 'vit'),
            dex: (0, summonUtils_1.calcBonus)(obj, 'dex'),
            luk: (0, summonUtils_1.calcBonus)(obj, 'luk'),
        };
        const attributes = {
            str: (0, summonUtils_1.calcStatBonus)(obj, 'str', bonus),
            agi: (0, summonUtils_1.calcStatBonus)(obj, 'agi', bonus),
            int: (0, summonUtils_1.calcStatBonus)(obj, 'int', bonus),
            vit: (0, summonUtils_1.calcStatBonus)(obj, 'vit', bonus),
            dex: (0, summonUtils_1.calcStatBonus)(obj, 'dex', bonus),
            luk: (0, summonUtils_1.calcStatBonus)(obj, 'luk', bonus),
        };
        const equipments = {
            slot_0: "",
            slot_1: "",
            slot_2: "",
            slot_3: "",
            slot_4: "",
            slot_5: "",
        };
        const skill_equip = [
            "",
            "",
            "",
            "",
        ];
        const c = {
            level: 1,
            rarity: obj.rarity,
            name: obj.name,
            job: obj.job,
            uid: `${obj.uid}`,
            hp: obj.hp,
            sp: obj.sp,
            range: obj.range,
            speed: obj.spd,
            attributes: attributes,
            equipments: equipments,
            skill_equip: skill_equip,
            team1: -1,
            treasure1: -1,
            treasure2: -1,
            treasure3: -1,
            bonus,
            free: true,
            ethAddress: eth,
            star: 0,
            statPoint: 0,
            exp: 0,
        };
        const hpMax = (0, summonUtils_1.calcHeroHPMax)(c);
        const spMax = (0, summonUtils_1.calcHeroSPMax)(c);
        c.hp = hpMax;
        c.sp = spMax;
        summonList.push(c);
        //await db.collection('Character').doc().set(c)
    }
    try {
        // Connect to MongoDB using your srv string
        //await mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
        let Character;
        try {
            Character = mongoose_1.default.model('Character');
        }
        catch (error) {
            Character = mongoose_1.default.model('Character', character_schema_1.CharacterSchema);
        }
        for (let i = 0; i < summonList.length; i++) {
            const character = new Character(summonList[i]);
            character.save((error) => {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log('Character saved successfully! ' + summonList[i].uid);
                }
            });
        }
    }
    catch (error) {
        console.log(error);
    }
    try {
        // Connect to MongoDB using your srv string
        //await mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
        // Define your user schema
        //console.log("Fetch Coupon")
        // Create a model from the schema
        let User;
        try {
            User = mongoose_1.default.model('User');
        }
        catch (error) {
            User = mongoose_1.default.model('User', exports.userSchema);
        }
        // Use the model to query for a user with a matching eth address
        let user = await User.findOne({ eth });
        // If a user was found, return coupon
        if (user) {
            user.coupon -= summon;
            await user.save();
            return summonList;
            // Close the Mongoose connection
            //mongoose.connection.close();
        }
    }
    catch (error) {
        console.log(error);
    }
    /*await db.collection('User').doc(eth).collection('Coupon').doc('100001').set({
      quantity: firestore.FieldValue.increment(-summon)
    }, {merge: true})*/
}
exports.summonHeroes = summonHeroes;
