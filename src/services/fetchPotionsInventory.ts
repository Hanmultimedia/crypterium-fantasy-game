import mongoose, { Schema, Document }  from 'mongoose';

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

const Inventory = mongoose.model('Inventory', InventorySchema);

export async function fetchPotionsInventory(eth: string) {
  const inventory = await Inventory.findOne({ eth:eth });
 // console.log("Your potion")
 // console.log(inventory)
  
  let filteredPotions = [];
  if(!inventory)
  {
    return filteredPotions;
  }

    inventory.potions.forEach((potion) => {
      console.log(potion)
      if(potion.quantity > 0) {
            let p = []
            p["uid"] = potion.uid
            p["amount"] = potion.quantity
            filteredPotions.push(p)
      }
  });
 // console.log("filtered")
 // console.log(filteredPotions)
  //const potions = inventory.potions.filter(potion => potion.quantity > 0);
  return filteredPotions;
}

/*import { db } from "../arena.config";
import { Potion } from "../rooms/MenuState";
export async function fetchPotionsInventory(eth:string): Promise<any> {
  
  const snapshot = await db.collection('Inventory').doc(eth).collection('Potion').
  where('quantity', '>', 0).get()
  const potions:any[] = []
  snapshot.forEach((doc) => {
    const data:any = doc.data()
    let potion = []
    potion["uid"] = doc.id
    potion["amount"] = data.quantity
    potions.push(potion)
  });

  return potions
}
*/