import mongoose, { Schema, Document }  from 'mongoose';
import { CharacterSchema } from './character.schema';
import { unEquipAllToCharacter } from "../services/unEquipAllToCharacter";
import { EnhancementLog } from './EnhancementLog';

const Character = mongoose.model('Character', CharacterSchema);

const InventoryEquipment = mongoose.model('InventoryEquipment');

export async function enhanceCharacterStar(eth: string, character1_id: string, character2_id: string,mode:string): Promise<any> {
    const character1: any = await Character.findOne({ _id: character1_id });
    const character2: any = await Character.findOne({ _id: character2_id });

    if (!character1 || !character2) {
        throw new Error('One or both characters not found');
    }

    // Cap character1's star value at 5 before incrementing
    if (character1.star < 5) {
        if(mode == "success")
        character1.star += 1;
    } else {
        console.log(`Character ${character1.name} (ID: ${character1_id}) is already at maximum stars.`);
        return { enhancedCharacter: character1, deletedCharacter: null };
    }

    await character1.save();

    // Unequip all equipment from character2 and delete them
    await unEquipAllToCharacter(eth, character2_id);

    // Delete character2 after unequipping equipment
    await Character.deleteOne({ _id: character2_id });

    console.log(`Character ${character1.name} (ID: ${character1_id}) enhanced successfully.`);
    console.log(`Character ${character2.name} (ID: ${character2_id}) deleted after enhancement.`);

    // Log the enhancement
    const enhancementLog = new EnhancementLog({
        character1_id: character1_id,
        character2_id: character2_id,
        eth: eth,
        enhancementDate: new Date()
    });

    await enhancementLog.save();

    return { enhancedCharacter: character1, deletedCharacter: character2 };
}

