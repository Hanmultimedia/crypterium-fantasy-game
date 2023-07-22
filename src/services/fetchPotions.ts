
import { Potion } from "../rooms/MenuState";
import { fetchItemPotionPools } from "../services/itemPotionPools";
export async function fetchPotions(): Promise<any> {
  
  const potionPools = fetchItemPotionPools()

  const potions:any[] = []
    potionPools.forEach((potion) => {
    const p = new Potion()
    p.uid = potion.uid
    p.type = potion.type
    p.name = potion.name
    p.effect =  potion.effect
    p.effect_type = potion.effect_type
    p.effect_amount = potion.effect_amount
    p.sprite = potion.sprite
    p.price = potion.price
    potions.push(p)
    
  });

  return potions
}