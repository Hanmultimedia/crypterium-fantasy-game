import { fetchDiamond } from "./fetchDiamond";
import { fetchItemPotionPools } from "../services/itemPotionPools";
import { Potion,Potion_Inventory } from "../rooms/MenuState";
import { CharacterSchema } from './character.schema';  
import mongoose, { Schema, Document }  from 'mongoose';

export const userSchema = new mongoose.Schema({
      eth: String,
      diamond: Number,
      coupon: Number,
      // other fields as required
    });

const PotionSchema = new Schema({
    uid: { type: String, required: true },
    quantity: { type: Number, required: true }
});

const InventorySchema = new Schema({
    eth: { type: String, required: true },
    potions: {
    type: Map,
    of: {
        uid: { type: String, required: true },
        quantity: { type: Number, required: true }
    }
    }
});

export async function buyPotion(eth:string, potion_uid: string , amount: number): Promise<any> {

  let diamonds = await fetchDiamond(eth)
  const potions = await fetchItemPotionPools()
  const p = potions.find(p => p.uid === potion_uid)

  const potion = new Potion()
  potion.uid = p.uid
  potion.type = p.type
  potion.name = p.name
  potion.effect = p.effect
  potion.effect_type = p.effect_type
  potion.effect_amount = p.effect_amount
  potion.sprite = p.sprite
  potion.price = p.price

  const price = potion.price * amount

  //console.log(eth + " buy potion " + potion.uid + " buy amount " + amount +" total price " + price + " have diamond " + diamonds)

  const result:any = []

  if(diamonds >= price )
  {
//Diamond section
try {
    // Connect to MongoDB using your srv string
    //await mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
    // Define your user schema
    console.log("Fetch User To update Diamond")
    // Create a model from the schema

    let User: any;
    try {
      User =  mongoose.model('User');
    } catch (error) {
      User = mongoose.model('User', userSchema);
    }
    // Use the model to query for a user with a matching eth address
    let user = await User.findOne({ eth:eth });
    // If a user was found, return coupon
    if (user) {
    user.diamond -= price
    await user.save();
    }

  } catch (error) {
    console.log(error);
  }
//End Diamond section

    const p = new Potion_Inventory()
    p.uid = potion.uid
    p.amount = amount

    result["diamond"] = diamonds-price
    result["potion"] = p
    result["amount"] = amount

    //Add potion section
    console.log("Check potion inventory")
    let Inventory: any;
    try {
      Inventory = mongoose.model("Inventory");
    } catch (error) {
      Inventory = mongoose.model("Inventory", InventorySchema);
    }

    let updatedInventory = await Inventory.findOne(
    { eth: eth}
    );

    if (updatedInventory) {
    console.log("Update in inventory")
    if (!updatedInventory.potions) {
      updatedInventory.potions = new Map();
    }
    if (!updatedInventory.potions.has(potion.uid)) {
      updatedInventory.potions.set(potion.uid, { uid: potion.uid, quantity: 0 });
    }
    updatedInventory.potions.get(potion.uid).quantity += amount;
    await updatedInventory.save();
    }else
    {
      console.log("Create New Potion")
      let PotionModel: any;
      try {
        PotionModel = mongoose.model("Potion");
      } catch (error) {
        PotionModel = mongoose.model("Potion", PotionSchema);
      }
      const newPotion = new PotionModel({ uid:potion.uid,quantity:amount });

      updatedInventory = await Inventory.create({
        eth: eth,
      potions: new Map([[newPotion.uid, { uid: newPotion.uid, quantity: newPotion.quantity }]])
      });
    }
    
    console.log("Finish buy potion")
    //mongoose.connection.close();
    return result
  }
  else
  {
    console.log("Check potion inventory Error")
    result["diamond"] = diamonds
    result["potion"] = potion
    result["amount"] = 0

    mongoose.connection.close();
    return result
  }
}