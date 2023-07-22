import { Room, Client } from "colyseus";
import { fetchCharacters } from "../services/fetchCharacters";
import { fetchCharactersOld } from "../services/fetchCharactersOld";
import { fetchCoupons } from "../services/fetchCoupons";
import { fetchPotions } from "../services/fetchPotions";
import { fetchPotionsInventory } from "../services/fetchPotionsInventory";
import { fetchMaterialsInventory } from "../services/fetchMaterialsInventory";
import { fetchEquipments } from "../services/fetchEquipments";
import { fetchEquipmentsInventory } from "../services/fetchEquipmentsInventory";
//import { fetchEquipments } from "../services/fetchEquipments";
import { fetchDiamond } from "../services/fetchDiamond";
import { fetchSkills } from "../services/fetchSkills";
import { initialize } from "../services/initialize";
import { summonHeroes } from "../services/summonHeroes";
import { buyPotion } from "../services/buyPotion";
import { buyEquipment } from "../services/buyEquipment";
import { addSkillToCharacter } from "../services/addSkillToCharacter";
import { upgradeSkillToCharacter } from "../services/upgradeSkillToCharacter";
import { equipSkill } from "../services/equipSkill";
import { equipToCharacter } from "../services/equipToCharacter";
import { unEquipToCharacter } from "../services/unEquipToCharacter";
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
import { setArenaTeamPosition } from '../services/setArenaTeamPosition';
import mongoose from 'mongoose';
export class MenuRoom extends Room<MenuState> {
  maxClients = 1;

  ethAddress : string
  static existingRoomIds: Set<string> = new Set();
  async onCreate(options:any) {

    await mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    
    this.setSeatReservationTime(100000) 
    this.roomId = "MenuRoom-"+ options.ethAddress;
    console.log("MenuRoom created!", options);
    this.ethAddress = options.ethAddress

    // Check if a room with the same name already exists
    if (MenuRoom.existingRoomIds.has(this.roomId)) {
      console.log("Room with the same name already exists. Cannot create a new one.");
      this.disconnect(); // Disconnect the client trying to create the room
      return;
    }

    // Add the room name to the existingRoomIds set
    MenuRoom.existingRoomIds.add(this.roomId);
    
    this.setState(new MenuState());

    await initialize(options.ethAddress);
     // Connect to MongoDB using your srv string

    //await fetchCharactersOld(options.ethAddress)
    //await createEquipment()
    const characters = await fetchCharacters(options.ethAddress)
    const potions = await fetchPotions()

    const exist = await checkUserExist(options.ethAddress)
    await userAuth(options.ethAddress)
    const coupons = await fetchCoupons(options.ethAddress)
    /*const potions_inventory_uid = await fetchPotionsInventory(options.ethAddress)
    let potions_inventory = new ArraySchema<Potion_Inventory>()

    for(let i = 0 ; i < potions.length ; i++)
    {
      for(let j = 0 ; j < potions_inventory_uid.length ; j++)
      {
         if((potions_inventory_uid[j])["uid"] === potions[i].uid)
          {
            const p = new Potion_Inventory()
            p.uid = potions[i].uid
            p.amount = (potions_inventory_uid[j])["amount"]
            potions_inventory.push(p)
          }
      }
     
    }*/

    const diamonds = await fetchDiamond(options.ethAddress)
    const skills = await fetchSkills()

    this.state.potions = potions;
    //this.state.potions_inventory = potions_inventory;
    this.state.coupons = coupons;
    this.state.characters = characters;
    this.state.ethAddress = options.ethAddress;

    this.state.diamonds = diamonds;
    this.state.current_selected_character = 0;
    this.state.skills = skills;


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
            equipments_inventory.push(e)
          }
      }
     
    }

    this.state.equipments_inventory = equipments_inventory;
    this.state.equipments = equipments;
  }

  async onLeave(client: Client, consented: boolean) {
    //this.broadcast("messages", `${ client.sessionId } left.`);
    console.log(client.sessionId, "left!");
    //this.state.characters.delete(client.sessionId);
    await userNonAuth(this.ethAddress)
    MenuRoom.existingRoomIds.delete(this.roomId);

  }

  onDispose() {
    mongoose.connection.close()
    console.log("Dispose MenuRoom");
  }
}
