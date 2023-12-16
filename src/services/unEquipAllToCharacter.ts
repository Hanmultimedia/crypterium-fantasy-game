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

export async function unEquipAllToCharacter(eth: string, character_id: string): Promise<any> {
    const character: any = await Character.findOne({ _id: character_id });

    if (!character) {
        throw new Error('Character not found');
    }

    let inventory: any = await InventoryEquipment.findOne({ eth: eth });
    if (!inventory) {
        inventory = new InventoryEquipment({ eth: eth, equipments: new Map() });
    }

    for (let i = 0; i <= 8; i++) {
        const slotKey = `slot_${i}`;
        const equipment_uid = character[slotKey];

        if (equipment_uid) {
            // Increment the quantity of the equipment in inventory (assuming +1 is for unequipping)
            if (!inventory.equipments.has(equipment_uid)) {
                inventory.equipments.set(equipment_uid, { uid: equipment_uid, quantity: 0 });
            }
            inventory.equipments.get(equipment_uid).quantity += 1;

            // Unequip the equipment from the character by clearing the slot
            await Character.updateOne({ _id: character_id }, { $set: { [slotKey]: "" } });
        }
    }

    await inventory.save();
    return character;
}
