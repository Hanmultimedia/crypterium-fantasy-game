import mongoose, { Schema, Document }  from 'mongoose';
import { Equipment } from "../rooms/MenuState";
import { CharacterSchema } from './character.schema';

export const EquipmentSchema: Schema = new Schema({
  uid: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const Character = mongoose.model('Character', CharacterSchema);

export const InventoryEquipmentSchema: Schema = new Schema({
  eth: { type: String, required: true },
  equipments: {
    type: Map,
    of: {
        uid: { type: String, required: true },
        quantity: { type: Number, required: true }
    }
    }
});

const InventoryEquipment = mongoose.model('InventoryEquipment');

export async function unEquipToCharacter(eth:string, character_id: string , equipment_uid: string , slot : number): Promise<any> {
  console.log("UnEquip " + equipment_uid + " to " + character_id)

  let inventory = await InventoryEquipment.findOne(
    { eth: eth}
    );

    if (inventory) {
      console.log("Update in inventory")
      if (!inventory.equipments) {
        inventory.equipments = new Map();
      }
      if (!inventory.equipments.has(equipment_uid)) {
        inventory.equipments.set(equipment_uid, { uid: equipment_uid, quantity: 0 });
      }
      inventory.equipments.get(equipment_uid).quantity += 1;
      await inventory.save();
    }

  //InventoryEquipment.equipments.set(equipment_uid, { uid: equipment_uid, quantity: -1 });

  const update = {};
  update[`equipments.slot_${slot}`] = "";
  const character = await Character.findOneAndUpdate({ _id: character_id }, { $set: update }, { new: true });
  if (!character) {
    throw new Error('Character not found');
  }
  return character;
}