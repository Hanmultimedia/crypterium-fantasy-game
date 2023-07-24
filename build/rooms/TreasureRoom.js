"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreasureRoom = void 0;
const colyseus_1 = require("colyseus");
const fetchHeroesTreasure_1 = require("../services/fetchHeroesTreasure");
const fetchWaveMonsters_1 = require("../services/fetchWaveMonsters");
const fetchRandomMonster_1 = require("../services/fetchRandomMonster");
const fetchRandomBoss_1 = require("../services/fetchRandomBoss");
const fetchRandomChest_1 = require("../services/fetchRandomChest");
const addExpToHero_1 = require("../services/addExpToHero");
const addDiamond_1 = require("../services/addDiamond");
const addCoin_1 = require("../services/addCoin");
const addPotion_1 = require("../services/addPotion");
const usePotions_1 = require("../services/usePotions");
const DungeonState_1 = require("./DungeonState");
const mongoose_1 = __importDefault(require("mongoose"));
const fetchDiamond_1 = require("../services/fetchDiamond");
const fetchCoin_1 = require("../services/fetchCoin");
class TreasureRoom extends colyseus_1.Room {
    constructor() {
        super(...arguments);
        this.maxClients = 1;
    }
    async onCreate(options) {
        this.roomId = options.ethAddress;
        //console.log("Treasure created!", options);
        this.setState(new DungeonState_1.DungeonState());
        this.setSeatReservationTime(100000);
        await mongoose_1.default.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
        const db = mongoose_1.default.connection;
        //db.on('error', console.error.bind(console, 'connection error:'));
        let characters = await (0, fetchHeroesTreasure_1.fetchHeroesTreasure)(options.ethAddress);
        const monsters = await (0, fetchWaveMonsters_1.fetchWaveMonsters)(options.map, 1);
        //const dungeonId = await createDungeonRecord(options.ethAddress, characters, options.map)
        this.state.wave = 1;
        this.state.ethAddress = options.ethAddress;
        this.state.map = options.map;
        this.state.dungeonId = options.ethAddress;
        this.state.heroes = characters;
        this.state.drop = 0.0;
        this.state.diamond = await (0, fetchDiamond_1.fetchDiamond)(options.ethAddress);
        this.state.bit = await (0, fetchCoin_1.fetchCoin)(options.ethAddress, 1);
        this.state.doge = await (0, fetchCoin_1.fetchCoin)(options.ethAddress, 2);
        this.state.coin = await (0, fetchCoin_1.fetchCoin)(options.ethAddress, 3);
        //this.state.monsters = monsters;
        for (let i = 0; i < 7; i++) {
            this.state.spawners_monsters.push(new DungeonState_1.Character_Array());
        }
        for (let i = 0; i < 7; i++) {
            this.state.spawners_chests.push(new DungeonState_1.Character_Array());
        }
        for (let i = 0; i < 1; i++) {
            this.state.spawners_boss.push(new DungeonState_1.Character_Array());
        }
        this.onMessage("spawnMonster", async (client, data) => {
            const monster = await (0, fetchRandomMonster_1.fetchRandomMonster)(options.map, this.state.wave);
            this.state.spawners_monsters[data.index].character.length = 0;
            this.state.spawners_monsters[data.index].character.push(monster);
        });
        this.onMessage("spawnBoss", async (client, data) => {
            const monster = await (0, fetchRandomBoss_1.fetchRandomBoss)(options.map, this.state.wave);
            this.state.spawners_boss[data.index].character.length = 0;
            this.state.spawners_boss[data.index].character.push(monster);
        });
        this.onMessage("spawnChest", async (client, data) => {
            const chest = await (0, fetchRandomChest_1.fetchRandomChest)(options.map, this.state.wave);
            this.state.spawners_chests[data.index].character.length = 0;
            this.state.spawners_chests[data.index].character.push(chest);
            //console.log("Spawn chest ")
            // console.log(chest)
        });
        this.onMessage("recieveExp", async (client, data) => {
            const hero = this.state.heroes.find(c => c.id == data.character_id);
            //console.log("recieveExp")
            if (hero) {
                //console.log("found hero " + hero.id)
                let result = await (0, addExpToHero_1.addExpToHero)(this.state.ethAddress, hero, data.exp);
                characters = await (0, fetchHeroesTreasure_1.fetchHeroesTreasure)(options.ethAddress);
                this.state.heroes = characters;
            }
        });
        this.onMessage("recieveDiamond", async (client, data) => {
            //console.log(data.eth +" recieveDiamond")
            let result = await (0, addDiamond_1.addDiamond)(this.state.ethAddress, data.diamond);
            this.state.diamond = await (0, fetchDiamond_1.fetchDiamond)(options.ethAddress);
        });
        this.onMessage("recieveCoin", async (client, data) => {
            let coin = await (0, addCoin_1.addCoin)(this.state.ethAddress, data.type);
            console.log("drop state is " + coin);
            this.state.drop = coin;
            this.state.bit = await (0, fetchCoin_1.fetchCoin)(options.ethAddress, 1);
            this.state.doge = await (0, fetchCoin_1.fetchCoin)(options.ethAddress, 2);
            this.state.coin = await (0, fetchCoin_1.fetchCoin)(options.ethAddress, 3);
        });
        this.onMessage("recievePotion", async (client, data) => {
            console.log("Add potion!");
            let result = await (0, addPotion_1.addPotion)(this.state.ethAddress, data.amount);
        });
        this.onMessage("finishDungeon", async () => {
            //const rewards = await finishDungeon(this.state.ethAddress, this.state.wave, this.state.dungeonId, this.state.map, this.state.heroes)
            //const rewardSchema = new RewardState_T()
            //rewardSchema.data = rewards
            //this.state.rewards = rewardSchema
            //this.clock.setTimeout(() => {
            //  this.disconnect()
            //}, 5000)
        });
        this.onMessage("usePotions", async (client, data) => {
            const result = await (0, usePotions_1.usePotions)(data.eth, data.uid, data.amount);
        });
    }
    onJoin(client) {
        this.broadcast("messages", `${client.sessionId} joined.`);
        console.log(client.sessionId, "joined!");
    }
    onLeave(client, consented) {
        this.broadcast("messages", `${client.sessionId} left.`);
        console.log(client.sessionId, "left!");
        //this.state.characters.delete(client.sessionId);
    }
    onDispose() {
        console.log("Dispose Huntroom");
    }
}
exports.TreasureRoom = TreasureRoom;
