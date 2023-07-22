import { fetchItemPotionPools } from "./itemPotionPools";

export async function createShopItem(): Promise<any> {

  const potionPools = fetchItemPotionPools()
  
  return potionPools
}