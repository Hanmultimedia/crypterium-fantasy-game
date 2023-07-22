"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuRoom = void 0;
const colyseus_1 = require("colyseus");
const fetchCharacters_1 = require("../services/fetchCharacters");
const fetchCoupons_1 = require("../services/fetchCoupons");
const fetchPotions_1 = require("../services/fetchPotions");
const fetchEquipments_1 = require("../services/fetchEquipments");
const fetchEquipmentsInventory_1 = require("../services/fetchEquipmentsInventory");
//import { fetchEquipments } from "../services/fetchEquipments";
const fetchDiamond_1 = require("../services/fetchDiamond");
const fetchSkills_1 = require("../services/fetchSkills");
const initialize_1 = require("../services/initialize");
const summonHeroes_1 = require("../services/summonHeroes");
const buyPotion_1 = require("../services/buyPotion");
const buyEquipment_1 = require("../services/buyEquipment");
const addSkillToCharacter_1 = require("../services/addSkillToCharacter");
const upgradeSkillToCharacter_1 = require("../services/upgradeSkillToCharacter");
const equipSkill_1 = require("../services/equipSkill");
const equipToCharacter_1 = require("../services/equipToCharacter");
const unEquipToCharacter_1 = require("../services/unEquipToCharacter");
const MenuState_1 = require("./MenuState");
const settingTeams_1 = require("../services/settingTeams");
const settingTeams_2 = require("../services/settingTeams");
const userAuth_1 = require("../services/userAuth");
const checkUserExist_1 = require("../services/checkUserExist");
const updateStats_1 = require("../services/updateStats");
const schema_1 = require("@colyseus/schema");
const setArenaTeamPosition_1 = require("../services/setArenaTeamPosition");
const mongoose_1 = __importDefault(require("mongoose"));
class MenuRoom extends colyseus_1.Room {
    constructor() {
        super(...arguments);
        this.maxClients = 1;
    }
    static { this.existingRoomIds = new Set(); }
    async onCreate(options) {
        await mongoose_1.default.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
        const db = mongoose_1.default.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        this.setSeatReservationTime(100000);
        this.roomId = "MenuRoom-" + options.ethAddress;
        console.log("MenuRoom created!", options);
        this.ethAddress = options.ethAddress;
        // Check if a room with the same name already exists
        if (MenuRoom.existingRoomIds.has(this.roomId)) {
            console.log("Room with the same name already exists. Cannot create a new one.");
            this.disconnect(); // Disconnect the client trying to create the room
            return;
        }
        // Add the room name to the existingRoomIds set
        MenuRoom.existingRoomIds.add(this.roomId);
        this.setState(new MenuState_1.MenuState());
        await (0, initialize_1.initialize)(options.ethAddress);
        // Connect to MongoDB using your srv string
        //await fetchCharactersOld(options.ethAddress)
        //await createEquipment()
        const characters = await (0, fetchCharacters_1.fetchCharacters)(options.ethAddress);
        const potions = await (0, fetchPotions_1.fetchPotions)();
        const exist = await (0, checkUserExist_1.checkUserExist)(options.ethAddress);
        await (0, userAuth_1.userAuth)(options.ethAddress);
        const coupons = await (0, fetchCoupons_1.fetchCoupons)(options.ethAddress);
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
        const diamonds = await (0, fetchDiamond_1.fetchDiamond)(options.ethAddress);
        const skills = await (0, fetchSkills_1.fetchSkills)();
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
            const summonList = await (0, summonHeroes_1.summonHeroes)(this.state.ethAddress, data.summon);
            const summonData = new MenuState_1.SummonData();
            summonData.data = summonList.map((s) => s.uid);
            this.state.summonData = summonData;
            const coupons = await (0, fetchCoupons_1.fetchCoupons)(options.ethAddress);
            this.state.coupons = coupons;
            setTimeout(() => {
                this.reloadCharacter();
            }, 1000);
        });
        this.onMessage("settingTeams", async (client, data) => {
            const result = await (0, settingTeams_1.settingTeams)(data.characterID, data.index);
            for (let i = 0; i < this.state.characters.length; i++) {
                //console.log(this.state.characters[i].id + " " +data.characterID)
                if (this.state.characters[i].id == data.characterID) {
                    //console.log("update character team")
                    this.state.characters[i].team1 = data.index;
                }
            }
        });
        this.onMessage("settingTeamsTreasure1", async (client, data) => {
            const result = await (0, settingTeams_2.settingTeamsTreasure)(data.characterID, data.index, 1);
            for (let i = 0; i < this.state.characters.length; i++) {
                if (this.state.characters[i].id == data.characterID) {
                    this.state.characters[i].treasure1 = data.index;
                    this.state.characters[i].treasure2 = -1;
                    this.state.characters[i].treasure3 = -1;
                }
            }
        });
        this.onMessage("settingTeamsTreasure2", async (client, data) => {
            const result = await (0, settingTeams_2.settingTeamsTreasure)(data.characterID, data.index, 2);
            for (let i = 0; i < this.state.characters.length; i++) {
                if (this.state.characters[i].id == data.characterID) {
                    this.state.characters[i].treasure1 = -1;
                    this.state.characters[i].treasure2 = data.index;
                    this.state.characters[i].treasure3 = -1;
                }
            }
        });
        this.onMessage("settingTeamsTreasure3", async (client, data) => {
            const result = await (0, settingTeams_2.settingTeamsTreasure)(data.characterID, data.index, 3);
            for (let i = 0; i < this.state.characters.length; i++) {
                if (this.state.characters[i].id == data.characterID) {
                    this.state.characters[i].treasure1 = -1;
                    this.state.characters[i].treasure2 = -1;
                    this.state.characters[i].treasure3 = data.index;
                }
            }
        });
        this.onMessage("setArenaTeamPosition", async (client, data) => {
            const result = await (0, setArenaTeamPosition_1.setArenaTeamPosition)(data.characterID, data.team, data.position);
            if (result) {
                for (let i = 0; i < this.state.characters.length; i++) {
                    if (this.state.characters[i].id === data.characterID) {
                        if (data.team === 'attack') {
                            this.state.characters[i].arenaAttackPosition = data.position;
                        }
                        else if (data.team === 'defend') {
                            this.state.characters[i].arenaDefendPosition = data.position;
                        }
                        break;
                    }
                }
            }
        });
        this.onMessage("buyPotion", async (client, data) => {
            const result = await (0, buyPotion_1.buyPotion)(this.state.ethAddress, data.potion_uid, data.amount);
            if (result["amount"] > 0) {
                this.state.diamonds = result["diamond"];
                this.state.potions_inventory.push(result["potion"]);
            }
        });
        this.onMessage("buyEquipment", async (client, data) => {
            const result = await (0, buyEquipment_1.buyEquipment)(this.state.ethAddress, data.equipment_uid, data.amount);
            if (result["amount"] > 0) {
                this.state.diamonds = result["diamond"];
                //this.calculateEquipment()
                //this.state.equipments_inventory.push(result["equipment"] as Equipment_Inventory)
            }
        });
        this.onMessage("addSkillToCharacter", async (client, data) => {
            const result = await (0, addSkillToCharacter_1.addSkillToCharacter)(this.state.ethAddress, data.character_id, data.skill_uid);
            this.state.upgrade_ready = true;
            const diamonds = await (0, fetchDiamond_1.fetchDiamond)(options.ethAddress);
            this.state.diamonds = diamonds;
        });
        this.onMessage("upgradeSkillToCharacter", async (client, data) => {
            const result = await (0, upgradeSkillToCharacter_1.upgradeSkillToCharacter)(options.ethAddress, data.character_id, data.skill_uid, data.level);
            this.state.upgrade_ready = true;
            const diamonds = await (0, fetchDiamond_1.fetchDiamond)(options.ethAddress);
            this.state.diamonds = diamonds;
        });
        this.onMessage("equipToCharacter", async (client, data) => {
            const result = await (0, equipToCharacter_1.equipToCharacter)(this.state.ethAddress, data.character_id, data.equipment_uid, data.slot_id);
            this.reload();
            setTimeout(() => {
                this.state.upgrade_ready = true;
            }, 300);
        });
        this.onMessage("refresh", async () => {
            const diamonds = await (0, fetchDiamond_1.fetchDiamond)(options.ethAddress);
            this.state.diamonds = diamonds;
        });
        this.onMessage("equipSkillToCharacter", async (client, data) => {
            const result = await (0, equipSkill_1.equipSkill)(this.state.ethAddress, data.character_id, data.skill_uid, data.slot_id);
            const characters = await (0, fetchCharacters_1.fetchCharacters)(this.state.ethAddress);
            this.state.characters = characters;
        });
        this.onMessage("unEquipToCharacter", async (client, data) => {
            const result = await (0, unEquipToCharacter_1.unEquipToCharacter)(this.state.ethAddress, data.character_id, data.equipment_uid, data.slot_id);
            this.reload();
            setTimeout(() => {
                this.state.upgrade_ready = true;
            }, 300);
        });
        this.onMessage("selectCharacter", async (client, data) => {
            this.state.current_selected_character = data.index;
        });
        this.onMessage("updateStats", async (client, data) => {
            const result = await (0, updateStats_1.updateStats)(this.state.ethAddress, data.characterID, data.points, data.stats);
            const characters = await (0, fetchCharacters_1.fetchCharacters)(options.ethAddress);
            this.state.characters = characters;
        });
        this.onMessage("setUpgradeReady", async (client, data) => {
            this.state.upgrade_ready = data.ready;
        });
    }
    async reload() {
        const characters = await (0, fetchCharacters_1.fetchCharacters)(this.state.ethAddress);
        this.state.characters = characters;
        this.calculateEquipment();
    }
    async reloadCharacter() {
        const characters = await (0, fetchCharacters_1.fetchCharacters)(this.state.ethAddress);
        this.state.characters = characters;
    }
    async calculateEquipment() {
        const equipments = await (0, fetchEquipments_1.fetchEquipments)();
        const equipments_inventory_uid = await (0, fetchEquipmentsInventory_1.fetchEquipmentsInventory)(this.ethAddress);
        let equipments_inventory = new schema_1.ArraySchema();
        for (let i = 0; i < equipments.length; i++) {
            for (let j = 0; j < equipments_inventory_uid.length; j++) {
                if ((equipments_inventory_uid[j])["uid"] === equipments[i].uid) {
                    const e = new MenuState_1.Equipment_Inventory();
                    e.uid = equipments[i].uid;
                    e.amount = (equipments_inventory_uid[j])["amount"];
                    equipments_inventory.push(e);
                }
            }
        }
        this.state.equipments_inventory = equipments_inventory;
        this.state.equipments = equipments;
    }
    async onLeave(client, consented) {
        //this.broadcast("messages", `${ client.sessionId } left.`);
        console.log(client.sessionId, "left!");
        //this.state.characters.delete(client.sessionId);
        await (0, userAuth_1.userNonAuth)(this.ethAddress);
        MenuRoom.existingRoomIds.delete(this.roomId);
    }
    onDispose() {
        mongoose_1.default.connection.close();
        console.log("Dispose MenuRoom");
    }
}
exports.MenuRoom = MenuRoom;
