import { Room, Client } from "colyseus";
import { fetchCharacters } from "../services/fetchCharacters";
import { fetchCharactersOld } from "../services/fetchCharactersOld";
import { fetchCoupons } from "../services/fetchCoupons";
import { fetchCoupons2 } from "../services/fetchCoupons2";
import { fetchPotions } from "../services/fetchPotions";
import { fetchPotionsInventory } from "../services/fetchPotionsInventory";
import { fetchMaterialsInventory } from "../services/fetchMaterialsInventory";
import { fetchEquipments } from "../services/fetchEquipments";
import { fetchEquipmentsInventory } from "../services/fetchEquipmentsInventory";
import { setStamina } from "../services/setStamina";
import { setArenaStamina } from "../services/setArenaStamina";
import { fetchArenaStamina } from "../services/fetchArenaStamina";
import { fetchStamina } from "../services/fetchStamina";
import { fetchDiamond } from "../services/fetchDiamond";
import { fetchSkills } from "../services/fetchSkills";
import { initialize } from "../services/initialize";
import { summonHeroes } from "../services/summonHeroes";
import { summonHeroes2 } from "../services/summonHeroes2";
import { buyPotion } from "../services/buyPotion";
import { buyEquipment } from "../services/buyEquipment";
import { addSkillToCharacter } from "../services/addSkillToCharacter";
import { upgradeSkillToCharacter } from "../services/upgradeSkillToCharacter";
import { equipSkill } from "../services/equipSkill";
import { equipToCharacter } from "../services/equipToCharacter";
import { unEquipToCharacter } from "../services/unEquipToCharacter";
import { unEquipAllToCharacter } from "../services/unEquipAllToCharacter";
import { MenuState, SummonData , Skill ,Potion , Potion_Inventory , Equipment , Equipment_Inventory} from "./MenuState";
import { settingTeams } from "../services/settingTeams";
import { settingTeamsTreasure } from "../services/settingTeams";
import { createMonster } from "../services/createMonster";
import { createSkill } from "../services/createSkill";
import { createEquipment } from "../services/createEquipment";
import { userAuth,userNonAuth } from "../services/userAuth";
import { checkUserExist } from "../services/checkUserExist";
import { updateStats } from "../services/updateStats";
import { Schema, type, ArraySchema} from "@colyseus/schema"
import { CopyCollection } from "../services/copyCollection";
import { enhanceCharacterStar } from "../services/enhanceCharacterStar";
import { setArenaTeamPosition } from '../services/setArenaTeamPosition';
import { fetchCoin } from "../services/fetchCoin";
import { refine } from "../services/refine";
import { fetchProfile } from "../services/fetchProfile";
import { setProfilepic } from "../services/setProfilepic";
import BannedUser, { IBannedUser } from "../services/BannedUser";
import { fetchArenaEnemiesList } from "../services/fetchArenaEnemiesList";
import { fetchBattlePoint } from "../services/fetchBattlePoint";
import { fetchBattleRank } from "../services/fetchBattleRank";
import { getTopPlayers } from "../services/getTopPlayers";

import mongoose, { Document }  from 'mongoose';

export class MenuRoom extends Room<MenuState> {

  maxClients = 1;
  dbQueriesCount = 0; // Counter variable for database queries
  ethAddress : string
  static existingRoomIds: Set<string> = new Set();
  banList: string[] = []; // Initialize the ban list array
  async onCreate(options:any) {

    await mongoose.connect('mongodb+srv://CPAY-CF-USER:CPh76oCwQsLELHBg@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
    const db = mongoose.connection;
    //db.on('error', console.error.bind(console, 'connection error:'));

    options.ethAddress = options.ethAddress.toLowerCase();
    //branch
    //this.setSeatReservationTime(10000) 
    const randomNum = Math.floor(Math.random() * 1001);
    this.roomId = `MenuRoom-${options.ethAddress}`;
    console.log("MenuRoom created!", options);
    this.ethAddress = options.ethAddress

    // Check if a room with the same name already exists
    if (MenuRoom.existingRoomIds.has(this.roomId)) {
      //console.log("Room with the same name already exists. Cannot create a new one.");
      this.disconnect(); // Disconnect the client trying to create the room
      return;
    }

    const bannedAddresses = await this.fetchBannedAddressesFromMongoDB();
    //console.log(bannedAddresses)
    // Populate the ban list with the retrieved banned addresses
    this.banList = bannedAddresses;

    // Check if the user's Ethereum address is in the ban list
    if (this.banList.includes(options.ethAddress)) {
      console.log("User is banned. Disconnecting...");
      this.disconnect();
      return;
    }

    // Add the room name to the existingRoomIds set
    MenuRoom.existingRoomIds.add(this.roomId);
    console.log("Have online " + MenuRoom.existingRoomIds.size)
    
    this.setState(new MenuState());

    await initialize(options.ethAddress);
     // Connect to MongoDB using your srv string

    //if(options.ethAddress == "0x8b320e54B34bc8c09A40E32C37fF8A294cE23768")
    //{
      //console.log("fetchCharactersOld")
      //await fetchCharactersOld(options.ethAddress)
    //}

    this.state.bit = await fetchCoin(options.ethAddress,1)
    this.state.doge = await fetchCoin(options.ethAddress,2)    
    this.state.coin = await fetchCoin(options.ethAddress,3)
    this.state.stamina = await fetchStamina(options.ethAddress)
    this.state.arenastamina = await fetchArenaStamina(options.ethAddress)

    this.state.profilename = await fetchProfile(options.ethAddress,1) 
    
    // Generate a random number between 0 and 6 (inclusive)
    const randomProfilePic = Math.floor(Math.random() * 7); // Math.random() * (max - min + 1) + min

    this.state.profilepic = randomProfilePic; 
    //this.state.profilepic = await fetchProfile(options.ethAddress,2) 

    //await fetchCharactersOld(options.ethAddress)
    //await createEquipment()
    //const characters_pre = await fetchCharacters(options.ethAddress)
    //await enhanceCharacterStar(options.ethAddress,characters_pre[0].id,characters_pre[1].id)
    const characters = await fetchCharacters(options.ethAddress)
    const potions = await fetchPotions()

    const exist = await checkUserExist(options.ethAddress)
    await userAuth(options.ethAddress)
    const coupons = await fetchCoupons(options.ethAddress)
    const coupons2 = await fetchCoupons2(options.ethAddress)

    const diamonds = await fetchDiamond(options.ethAddress)
    const skills = await fetchSkills()

    this.state.potions = potions;
    //this.state.potions_inventory = potions_inventory;
    this.state.coupons = coupons;
    this.state.coupons2 = coupons2;
    this.state.characters = characters;
    this.state.ethAddress = options.ethAddress;

    this.state.diamonds = diamonds;
    this.state.current_selected_character = 0;
    this.state.skills = skills;

    this.state.refine_state = -1;

    await this.reloadArena(options);
    //await createMonster()
    //await createSkill()
    //this.calculateEquipment()


    this.onMessage("summonHeroes", async (client, data) => {
      const summonList = await summonHeroes(this.state.ethAddress, data.summon)
      const summonData = new SummonData()
      summonData.data = summonList.map((s:any) => s.uid)
      this.state.summonData = summonData
      const coupons = await fetchCoupons(options.ethAddress)
      this.state.coupons = coupons;

      setTimeout(() => {
        this.reloadCharacter()
      }, 1000)

    })

    this.onMessage("summonHeroes2", async (client, data) => {
      const summonList = await summonHeroes2(this.state.ethAddress, data.summon)
      const summonData = new SummonData()
      summonData.data = summonList.map((s:any) => s.uid)
      this.state.summonData = summonData
      const coupons2 = await fetchCoupons2(options.ethAddress)
      this.state.coupons2 = coupons2;

      setTimeout(() => {
        this.reloadCharacter()
      }, 1000)

    })

    this.onMessage("clearState", async (client, data) => {

      //console.log("ClearState")
      this.state.summonData = new SummonData()

    })

    this.onMessage("settingTeams", async (client, data) => {
      const result = await settingTeams(data.characterID,data.index);
      for(let i = 0 ; i < this.state.characters.length ; i++)
      {
        //console.log(this.state.characters[i].id + " " +data.characterID)
        if(this.state.characters[i].id == data.characterID)
        {
          //console.log("update character team")
          this.state.characters[i].team1 = data.index
        }
      }

    })

    this.onMessage("setprofilepic", async (client, data) => {
      const result = await setProfilepic(options.ethAddress,data.profilepic);
    })

   this.onMessage("setStamina", async (client, data) => {
      const result = await setStamina(options.ethAddress);
      //this.state.stamina--
    })

  this.onMessage("setArenaStamina", async (client, data) => {
      const result = await setArenaStamina(options.ethAddress);
      this.reloadArena(options);
      //this.state.stamina--
    })

    this.onMessage("settingTeamsTreasure1", async (client, data) => {
      const result = await settingTeamsTreasure(data.characterID,data.index,1);
      for(let i = 0 ; i < this.state.characters.length ; i++)
      {
        if(this.state.characters[i].id == data.characterID)
        {
          this.state.characters[i].treasure1 = data.index
          this.state.characters[i].treasure2 = -1
          this.state.characters[i].treasure3 = -1
        }
      }
    })

    this.onMessage("settingTeamsTreasure2", async (client, data) => {
      const result = await settingTeamsTreasure(data.characterID,data.index,2);
      for(let i = 0 ; i < this.state.characters.length ; i++)
      {
        if(this.state.characters[i].id == data.characterID)
        {
          this.state.characters[i].treasure1 = -1
          this.state.characters[i].treasure2 = data.index
          this.state.characters[i].treasure3 = -1
        }
      }
    })

    this.onMessage("settingTeamsTreasure3", async (client, data) => {
      const result = await settingTeamsTreasure(data.characterID,data.index,3);
      for(let i = 0 ; i < this.state.characters.length ; i++)
      {
        if(this.state.characters[i].id == data.characterID)
        {
          this.state.characters[i].treasure1 = -1
          this.state.characters[i].treasure2 = -1
          this.state.characters[i].treasure3 = data.index
        }
      }
    })

    this.onMessage("setArenaTeamPosition", async (client, data) => {
    const result = await setArenaTeamPosition(data.characterID, data.team, data.position);
    if (result) {
    for (let i = 0; i < this.state.characters.length; i++) {
      if (this.state.characters[i].id === data.characterID) {
        if (data.team === 'attack') {
          this.state.characters[i].arenaAttackPosition = data.position;
        } else if (data.team === 'defend') {
          this.state.characters[i].arenaDefendPosition = data.position;
        }
        break;
      }
    }
    }
    });

    this.onMessage("buyPotion", async (client, data) => {
      const result = await buyPotion(this.state.ethAddress,data.potion_uid,data.amount);
      if(result["amount"] > 0)
      {
        this.state.diamonds = result["diamond"]
        this.state.potions_inventory.push(result["potion"] as Potion_Inventory)
      }
    })

    this.onMessage("buyEquipment", async (client, data) => {
      const result = await buyEquipment(this.state.ethAddress,data.equipment_uid,data.amount);
      if(result["amount"] > 0)
      {
        this.state.diamonds = result["diamond"]
        //this.calculateEquipment()
        //this.state.equipments_inventory.push(result["equipment"] as Equipment_Inventory)
      }
    })

    this.onMessage("addSkillToCharacter", async (client, data) => {
      const result = await addSkillToCharacter(this.state.ethAddress,data.character_id,data.skill_uid);
      this.state.upgrade_ready = true
      const diamonds = await fetchDiamond(options.ethAddress)
      this.state.diamonds = diamonds;
    })

    this.onMessage("upgradeSkillToCharacter", async (client, data) => {
      const result = await upgradeSkillToCharacter(options.ethAddress,data.character_id,data.skill_uid,data.level);
      this.state.upgrade_ready = true
      const diamonds = await fetchDiamond(options.ethAddress)
      this.state.diamonds = diamonds;
    })

    this.onMessage("equipToCharacter", async (client, data) => {
    const result = await equipToCharacter(this.state.ethAddress,data.character_id,data.equipment_uid,data.slot_id);
    this.reload()

    setTimeout(() => {
      this.state.upgrade_ready = true
    }, 300)

    })

    this.onMessage("refine", async (client, data) => {
    this.state.refine_state = -1;
    this.state.refine_state = await refine(this.state.ethAddress,data.uid,data.from,data.to,data.mat,data.mat_amount);
    //console.log("Refine state" + this.state.refine_state)
    this.reload()

 

    })

    this.onMessage("refresh", async () => {
      const diamonds = await fetchDiamond(options.ethAddress)
      this.state.diamonds = diamonds;
    });

    this.onMessage("equipSkillToCharacter", async (client, data) => {
      const result = await equipSkill(this.state.ethAddress,data.character_id,data.skill_uid,data.slot_id);
      const characters = await fetchCharacters(this.state.ethAddress)
      this.state.characters = characters
    })

    this.onMessage("unEquipToCharacter", async (client, data) => {
    const result = await unEquipToCharacter(this.state.ethAddress,data.character_id,data.equipment_uid,data.slot_id);
    this.reload()

    setTimeout(() => {
      this.state.upgrade_ready = true
    }, 300)

    })

    this.onMessage("selectCharacter", async (client, data) => {
      this.state.current_selected_character = data.index
    })

    this.onMessage("updateStats", async (client, data) => {
      const result = await updateStats(this.state.ethAddress,data.characterID,data.points,data.stats);
      const characters = await fetchCharacters(options.ethAddress)
      this.state.characters = characters
    })

    this.onMessage("setUpgradeReady", async (client, data) => {
      this.state.upgrade_ready = data.ready
    })

    this.onMessage("enhanceCharacterStar", async (client, data) => {
      //console.log("Before " + this.state.characters.length)
      await enhanceCharacterStar(options.ethAddress,data.id1,data.id2,data.mode)
      const characters = await fetchCharacters(options.ethAddress)
      this.state.characters = characters
      //console.log("After " + this.state.characters.length)
    })

  }

  async reloadArena(options:any)
  {
    this.state.mypoint = await fetchBattlePoint(options.ethAddress);
    this.state.myrank = await fetchBattleRank(options.ethAddress);

let enemies_list = await fetchArenaEnemiesList(options.ethAddress,this.state.mypoint);
if (enemies_list !== null && enemies_list !== undefined) {
  
  //console.log(enemies_list)
  this.state.enemies1 = enemies_list.find((_, index) => index === 0);
  this.state.enemies2 = enemies_list.find((_, index) => index === 1);
  this.state.enemies3 = enemies_list.find((_, index) => index === 2);
  this.state.enemies4 = enemies_list.find((_, index) => index === 3);
  this.state.enemies5 = enemies_list.find((_, index) => index === 4);

  if(this.state.enemies1)
  {
    this.state.battlepoint1 = await fetchBattlePoint(this.state.enemies1[0].ethAddress);
    //console.log("BattlePoint 1 =" + this.state.battlepoint1);
  }

  if(this.state.enemies2)
  {
    this.state.battlepoint2 = await fetchBattlePoint(this.state.enemies2[0].ethAddress);
    //console.log("BattlePoint 2 =" + this.state.battlepoint2);
  }

  if(this.state.enemies3)
  {
    this.state.battlepoint3 = await fetchBattlePoint(this.state.enemies3[0].ethAddress);
    //console.log("BattlePoint 3 =" + this.state.battlepoint3);
  }

  if(this.state.enemies4)
  {
    this.state.battlepoint4 = await fetchBattlePoint(this.state.enemies4[0].ethAddress);
    //console.log("BattlePoint 4 =" + this.state.battlepoint4);
  }

  if(this.state.enemies5)
  {
    this.state.battlepoint5 = await fetchBattlePoint(this.state.enemies5[0].ethAddress);
    //console.log("BattlePoint 5 =" + this.state.battlepoint5);
  }

} else {
  // Handle the case where enemies_list is null
  // For example, set a default value or handle the absence of enemies_list
}

let topPlayer = await getTopPlayers();
this.state.battlepoints = [];
this.state.eths = [];
for(let i = 0 ; i < 5 ; i++)
{
  this.state.battlepoints.push(topPlayer[i].battlepoint);
  this.state.eths.push(topPlayer[i].eth);
}
  }

  async reload()
  {
      const characters = await fetchCharacters(this.state.ethAddress)
      this.state.characters = characters
      this.calculateEquipment()
  }

  async reloadCharacter()
  {
      const characters = await fetchCharacters(this.state.ethAddress)
      this.state.characters = characters
  }

  async calculateEquipment()
  {
    const equipments = await fetchEquipments()
    const equipments_inventory_uid = await fetchEquipmentsInventory(this.ethAddress)

    let equipments_inventory = new ArraySchema<Equipment_Inventory>()

    for(let i = 0 ; i < equipments.length ; i++)
    {
      for(let j = 0 ; j < equipments_inventory_uid.length ; j++)
      {
         if((equipments_inventory_uid[j])["uid"] === equipments[i].uid)
          {
            const e = new Equipment_Inventory()
            e.uid = equipments[i].uid
            e.amount = (equipments_inventory_uid[j])["amount"]
            e.enchantmentLevel = (equipments_inventory_uid[j])["enchantmentLevel"]
            equipments_inventory.push(e)
          }
      }
     
    }

    this.state.equipments_inventory = equipments_inventory;
    this.state.equipments = equipments;
  }

  async fetchBannedAddressesFromMongoDB(): Promise<string[]> {
    // Implement the logic to fetch banned Ethereum addresses from MongoDB
    const bannedAddressesQueryResult = await BannedUser.find();
    const bannedAddresses = bannedAddressesQueryResult.map(item => item.eth);
    return bannedAddresses;
  }

  async onLeave(client: Client, consented: boolean) {
    //this.broadcast("messages", `${ client.sessionId } left.`);
    console.log(client.sessionId, "left!");
    //this.state.characters.delete(client.sessionId);
    await userNonAuth(this.ethAddress)
    MenuRoom.existingRoomIds.delete(this.roomId);
    console.log("Have online " + MenuRoom.existingRoomIds.size)

  }

  onDispose() {
    //mongoose.connection.close()
    console.log("Dispose MenuRoom");
  }
}
