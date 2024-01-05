"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuRoom = void 0;
const colyseus_1 = require("colyseus");
const fetchCharacters_1 = require("../services/fetchCharacters");
const fetchCoupons_1 = require("../services/fetchCoupons");
const fetchCoupons2_1 = require("../services/fetchCoupons2");
const fetchPotions_1 = require("../services/fetchPotions");
const fetchEquipments_1 = require("../services/fetchEquipments");
const fetchEquipmentsInventory_1 = require("../services/fetchEquipmentsInventory");
const setStamina_1 = require("../services/setStamina");
const setArenaStamina_1 = require("../services/setArenaStamina");
const fetchArenaStamina_1 = require("../services/fetchArenaStamina");
const fetchStamina_1 = require("../services/fetchStamina");
const fetchDiamond_1 = require("../services/fetchDiamond");
const fetchSkills_1 = require("../services/fetchSkills");
const initialize_1 = require("../services/initialize");
const summonHeroes_1 = require("../services/summonHeroes");
const summonHeroes2_1 = require("../services/summonHeroes2");
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
const enhanceCharacterStar_1 = require("../services/enhanceCharacterStar");
const setArenaTeamPosition_1 = require("../services/setArenaTeamPosition");
const fetchCoin_1 = require("../services/fetchCoin");
const refine_1 = require("../services/refine");
const fetchProfile_1 = require("../services/fetchProfile");
const setProfilepic_1 = require("../services/setProfilepic");
const BannedUser_1 = __importDefault(require("../services/BannedUser"));
const fetchArenaEnemiesList_1 = require("../services/fetchArenaEnemiesList");
const fetchBattlePoint_1 = require("../services/fetchBattlePoint");
const fetchBattleRank_1 = require("../services/fetchBattleRank");
const getTopPlayers_1 = require("../services/getTopPlayers");
const mongoose_1 = __importDefault(require("mongoose"));
class MenuRoom extends colyseus_1.Room {
    constructor() {
        super(...arguments);
        this.maxClients = 1;
        this.dbQueriesCount = 0; // Counter variable for database queries
        this.banList = []; // Initialize the ban list array
    }
    static { this.existingRoomIds = new Set(); }
    async onCreate(options) {
        await mongoose_1.default.connect('mongodb+srv://CPAY-CF-USER:CPh76oCwQsLELHBg@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
        const db = mongoose_1.default.connection;
        //db.on('error', console.error.bind(console, 'connection error:'));
        options.ethAddress = options.ethAddress.toLowerCase();
        //branch
        this.setSeatReservationTime(10000);
        const randomNum = Math.floor(Math.random() * 1001);
        this.roomId = `MenuRoom-${options.ethAddress}`;
        console.log("MenuRoom created!", options);
        this.ethAddress = options.ethAddress;
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
        console.log("Have online " + MenuRoom.existingRoomIds.size);
        this.setState(new MenuState_1.MenuState());
        await (0, initialize_1.initialize)(options.ethAddress);
        // Connect to MongoDB using your srv string
        //if(options.ethAddress == "0x8b320e54B34bc8c09A40E32C37fF8A294cE23768")
        //{
        //console.log("fetchCharactersOld")
        //await fetchCharactersOld(options.ethAddress)
        //}
        this.state.bit = await (0, fetchCoin_1.fetchCoin)(options.ethAddress, 1);
        this.state.doge = await (0, fetchCoin_1.fetchCoin)(options.ethAddress, 2);
        this.state.coin = await (0, fetchCoin_1.fetchCoin)(options.ethAddress, 3);
        this.state.stamina = await (0, fetchStamina_1.fetchStamina)(options.ethAddress);
        this.state.arenastamina = await (0, fetchArenaStamina_1.fetchArenaStamina)(options.ethAddress);
        this.state.profilename = await (0, fetchProfile_1.fetchProfile)(options.ethAddress, 1);
        // Generate a random number between 0 and 6 (inclusive)
        const randomProfilePic = Math.floor(Math.random() * 7); // Math.random() * (max - min + 1) + min
        this.state.profilepic = randomProfilePic;
        //this.state.profilepic = await fetchProfile(options.ethAddress,2) 
        //await fetchCharactersOld(options.ethAddress)
        //await createEquipment()
        //const characters_pre = await fetchCharacters(options.ethAddress)
        //await enhanceCharacterStar(options.ethAddress,characters_pre[0].id,characters_pre[1].id)
        const characters = await (0, fetchCharacters_1.fetchCharacters)(options.ethAddress);
        const potions = await (0, fetchPotions_1.fetchPotions)();
        const exist = await (0, checkUserExist_1.checkUserExist)(options.ethAddress);
        await (0, userAuth_1.userAuth)(options.ethAddress);
        const coupons = await (0, fetchCoupons_1.fetchCoupons)(options.ethAddress);
        const coupons2 = await (0, fetchCoupons2_1.fetchCoupons2)(options.ethAddress);
        const diamonds = await (0, fetchDiamond_1.fetchDiamond)(options.ethAddress);
        const skills = await (0, fetchSkills_1.fetchSkills)();
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
        this.onMessage("summonHeroes2", async (client, data) => {
            const summonList = await (0, summonHeroes2_1.summonHeroes2)(this.state.ethAddress, data.summon);
            const summonData = new MenuState_1.SummonData();
            summonData.data = summonList.map((s) => s.uid);
            this.state.summonData = summonData;
            const coupons2 = await (0, fetchCoupons2_1.fetchCoupons2)(options.ethAddress);
            this.state.coupons2 = coupons2;
            setTimeout(() => {
                this.reloadCharacter();
            }, 1000);
        });
        this.onMessage("clearState", async (client, data) => {
            //console.log("ClearState")
            this.state.summonData = new MenuState_1.SummonData();
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
        this.onMessage("setprofilepic", async (client, data) => {
            const result = await (0, setProfilepic_1.setProfilepic)(options.ethAddress, data.profilepic);
        });
        this.onMessage("setStamina", async (client, data) => {
            const result = await (0, setStamina_1.setStamina)(options.ethAddress);
            //this.state.stamina--
        });
        this.onMessage("setArenaStamina", async (client, data) => {
            const result = await (0, setArenaStamina_1.setArenaStamina)(options.ethAddress);
            this.reloadArena(options);
            //this.state.stamina--
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
        this.onMessage("refine", async (client, data) => {
            this.state.refine_state = -1;
            this.state.refine_state = await (0, refine_1.refine)(this.state.ethAddress, data.uid, data.from, data.to, data.mat, data.mat_amount);
            //console.log("Refine state" + this.state.refine_state)
            this.reload();
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
        this.onMessage("enhanceCharacterStar", async (client, data) => {
            //console.log("Before " + this.state.characters.length)
            await (0, enhanceCharacterStar_1.enhanceCharacterStar)(options.ethAddress, data.id1, data.id2, data.mode);
            const characters = await (0, fetchCharacters_1.fetchCharacters)(options.ethAddress);
            this.state.characters = characters;
            //console.log("After " + this.state.characters.length)
        });
    }
    async reloadArena(options) {
        this.state.mypoint = await (0, fetchBattlePoint_1.fetchBattlePoint)(options.ethAddress);
        this.state.myrank = await (0, fetchBattleRank_1.fetchBattleRank)(options.ethAddress);
        let enemies_list = await (0, fetchArenaEnemiesList_1.fetchArenaEnemiesList)(options.ethAddress, this.state.mypoint);
        if (enemies_list !== null && enemies_list !== undefined) {
            //console.log(enemies_list)
            this.state.enemies1 = enemies_list.find((_, index) => index === 0);
            this.state.enemies2 = enemies_list.find((_, index) => index === 1);
            this.state.enemies3 = enemies_list.find((_, index) => index === 2);
            this.state.enemies4 = enemies_list.find((_, index) => index === 3);
            this.state.enemies5 = enemies_list.find((_, index) => index === 4);
            if (this.state.enemies1) {
                this.state.battlepoint1 = await (0, fetchBattlePoint_1.fetchBattlePoint)(this.state.enemies1[0].ethAddress);
                //console.log("BattlePoint 1 =" + this.state.battlepoint1);
            }
            if (this.state.enemies2) {
                this.state.battlepoint2 = await (0, fetchBattlePoint_1.fetchBattlePoint)(this.state.enemies2[0].ethAddress);
                //console.log("BattlePoint 2 =" + this.state.battlepoint2);
            }
            if (this.state.enemies3) {
                this.state.battlepoint3 = await (0, fetchBattlePoint_1.fetchBattlePoint)(this.state.enemies3[0].ethAddress);
                //console.log("BattlePoint 3 =" + this.state.battlepoint3);
            }
            if (this.state.enemies4) {
                this.state.battlepoint4 = await (0, fetchBattlePoint_1.fetchBattlePoint)(this.state.enemies4[0].ethAddress);
                //console.log("BattlePoint 4 =" + this.state.battlepoint4);
            }
            if (this.state.enemies5) {
                this.state.battlepoint5 = await (0, fetchBattlePoint_1.fetchBattlePoint)(this.state.enemies5[0].ethAddress);
                //console.log("BattlePoint 5 =" + this.state.battlepoint5);
            }
        }
        else {
            // Handle the case where enemies_list is null
            // For example, set a default value or handle the absence of enemies_list
        }
        let topPlayer = await (0, getTopPlayers_1.getTopPlayers)();
        this.state.battlepoints = [];
        this.state.eths = [];
        for (let i = 0; i < 5; i++) {
            this.state.battlepoints.push(topPlayer[i].battlepoint);
            this.state.eths.push(topPlayer[i].eth);
        }
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
                    e.enchantmentLevel = (equipments_inventory_uid[j])["enchantmentLevel"];
                    equipments_inventory.push(e);
                }
            }
        }
        this.state.equipments_inventory = equipments_inventory;
        this.state.equipments = equipments;
    }
    async fetchBannedAddressesFromMongoDB() {
        // Implement the logic to fetch banned Ethereum addresses from MongoDB
        const bannedAddressesQueryResult = await BannedUser_1.default.find();
        const bannedAddresses = bannedAddressesQueryResult.map(item => item.eth);
        return bannedAddresses;
    }
    async onLeave(client, consented) {
        //this.broadcast("messages", `${ client.sessionId } left.`);
        console.log(client.sessionId, "left!");
        //this.state.characters.delete(client.sessionId);
        //await userNonAuth(this.ethAddress)
        MenuRoom.existingRoomIds.delete(this.roomId);
        //console.log("Have online " + MenuRoom.existingRoomIds.size)
    }
    onDispose() {
        //mongoose.connection.close()
        console.log("Dispose MenuRoom");
    }
}
exports.MenuRoom = MenuRoom;
