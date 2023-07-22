
import { fetchCharacterPool } from "./pools";
import { fetchCharacterRatings } from "./fetchCharacterRatings";
import { fetchRarityRatings } from "./fetchRarityRatings";
import { fetchCoupons } from "./fetchCoupons";
import { calcBonus, calcHeroHPMax, calcHeroSPMax, calcStatBonus, createDistribution, randomIndex } from "../utils/summonUtils";
import mongoose, { Schema, Document }  from 'mongoose';
import { CharacterSchema } from './character.schema';
export const userSchema = new mongoose.Schema({
      eth: String,
      diamond: Number,
      coupon: Number,
      // other fields as required
    });

export async function summonHeroes(eth:string, summon: number): Promise<any> {

  if (summon <= 0) {
    throw new Error("invalid amount of summons")
  }

  const coupon = await fetchCoupons(eth)
  console.log(coupon)
  //const coupon = await fetchCouponsByUID(eth, '100001')
  if (coupon.quantity < summon) {
    throw new Error("invalid coupon quantity")
  }

  const characterPools = fetchCharacterPool()
  const characterRatings = await fetchCharacterRatings('standard')
  const rarityRatings = await fetchRarityRatings('free-standard')

  if (!characterPools || !characterRatings || !rarityRatings) {
    throw new Error("Not found character pool!")
  }

  const jobs = []
  const jobWeights = []
  for(let key in characterRatings) {
    jobs.push(key)
    jobWeights.push(characterRatings[key])
  }
  const jobPool = createDistribution(jobs, jobWeights, 100);

  const rarities = []
  const rarityWeights = []
  for(let key in rarityRatings) {
    rarities.push(key)
    rarityWeights.push(rarityRatings[key])
  }

  const rarityPool = createDistribution(rarities, rarityWeights, 100)

  const summonList = []
  for(let i=0; i<summon; i++) {
    const jobIndex = randomIndex(jobPool);
    const rarityIndex = randomIndex(rarityPool);
    const char = {
      job: jobs[jobIndex],
      rarity: rarities[rarityIndex],      
    }

    //console.log("char.job " + char.job + " char.rarity " + char.rarity)
    const obj = characterPools.find(c => c.job === char.job && c.rarity === char.rarity)

    const bonus = {
      str: calcBonus(obj, 'str'),
      agi: calcBonus(obj, 'agi'),
      int: calcBonus(obj, 'int'),
      vit: calcBonus(obj, 'vit'),
      dex: calcBonus(obj, 'dex'),
      luk: calcBonus(obj, 'luk'),
    }

    const attributes = {
      str: calcStatBonus(obj, 'str', bonus),
      agi: calcStatBonus(obj, 'agi', bonus),
      int: calcStatBonus(obj, 'int', bonus),
      vit: calcStatBonus(obj, 'vit', bonus),
      dex: calcStatBonus(obj, 'dex', bonus),
      luk: calcStatBonus(obj, 'luk', bonus),
    }

    const equipments = {
      slot_0: "",
      slot_1: "",
      slot_2: "",
      slot_3: "",
      slot_4: "",
      slot_5: "",
    }

    const skill_equip = [
      "",
      "",
      "",
      "",
    ]

    
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
      treasure1:-1,
      treasure2:-1,
      treasure3:-1,
      bonus,
      free: true,
      ethAddress: eth,
      statPoint: 0,
      exp:0,
    }

    const hpMax = calcHeroHPMax(c)
    const spMax = calcHeroSPMax(c)

    c.hp = hpMax
    c.sp = spMax
    

    summonList.push(c)

    //await db.collection('Character').doc().set(c)
    
  }

  try {
    // Connect to MongoDB using your srv string
    //await mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
    
    let Character: any;
    try {
      Character =  mongoose.model('Character');
    } catch (error) {
      Character = mongoose.model('Character', CharacterSchema);
    }

    for(let i = 0 ; i < summonList.length ; i++){
    const character = new Character(summonList[i]);
    character.save((error) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Character saved successfully! ' + summonList[i].uid);
    }
    });

    }

  } catch (error) {
    console.log(error);
  }


  try {
    // Connect to MongoDB using your srv string
    //await mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
    // Define your user schema
    //console.log("Fetch Coupon")
    // Create a model from the schema

    let User: any;
    try {
      User =  mongoose.model('User');
    } catch (error) {
      User = mongoose.model('User', userSchema);
    }
    // Use the model to query for a user with a matching eth address
    let user = await User.findOne({ eth });
    // If a user was found, return coupon
    if (user) {
    user.coupon -= summon
    await user.save();
    return summonList
    // Close the Mongoose connection
    //mongoose.connection.close();
    }

  } catch (error) {
    console.log(error);
  }


  /*await db.collection('User').doc(eth).collection('Coupon').doc('100001').set({
    quantity: firestore.FieldValue.increment(-summon)
  }, {merge: true})*/


}