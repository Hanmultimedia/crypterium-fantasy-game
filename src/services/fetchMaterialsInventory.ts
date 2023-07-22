import mongoose, { Schema, Document }  from 'mongoose';

const InventorySchema = new Schema({
    eth: { type: String, required: true },
    materials: {
    type: Map,
    of: {
        uid: { type: String, required: true },
        quantity: { type: Number, required: true }
    }
    }
});

const Inventory = mongoose.model('InventoryMaterial', InventorySchema);

export async function fetchMaterialsInventory(eth: string) {
  const inventory = await Inventory.findOne({ eth:eth });
  console.log("Your InventoryMaterial")
  console.log(inventory)
  
  let filteredMaterials = [];
  if(!inventory)
  {
    return filteredMaterials;
  }

    inventory.materials.forEach((materials) => {
      console.log(materials)
      if(materials.quantity > 0) {
            let m = []
            m["uid"] = materials.uid
            m["amount"] = materials.quantity
            filteredMaterials.push(m)
      }
  });
  console.log("filtered Materials")
  console.log(filteredMaterials)
  return filteredMaterials;
}