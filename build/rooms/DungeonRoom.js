"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DungeonRoom = void 0;
const colyseus_1 = require("colyseus");
const fetchHeroes_1 = require("../services/fetchHeroes");
const addMaterials_1 = require("../services/addMaterials");
const fetchWaveMonsters_1 = require("../services/fetchWaveMonsters");
const usePotions_1 = require("../services/usePotions");
const makeDungeonRecord_1 = require("../services/makeDungeonRecord");
const DungeonState_1 = require("./DungeonState");
class DungeonRoom extends colyseus_1.Room {
    constructor() {
        super(...arguments);
        this.maxClients = 1;
    }
    async onCreate(options) {
        this.roomId = options.ethAddress;
        console.log("Dungeon created!", options);
        this.setState(new DungeonState_1.DungeonState());
        this.setSeatReservationTime(100000);
        const characters = await (0, fetchHeroes_1.fetchHeroes)(options.ethAddress);
        console.log("fetchWaveMonsters");
        const monsters = await (0, fetchWaveMonsters_1.fetchWaveMonsters)(options.map, 1);
        const dungeonId = await (0, makeDungeonRecord_1.createDungeonRecord)(options.ethAddress, characters, options.map);
        this.state.wave = 1;
        this.state.ethAddress = options.ethAddress;
        this.state.map = options.map;
        this.state.dungeonId = dungeonId;
        this.state.heroes = characters;
        this.state.monsters = monsters;
        this.onMessage("incrementWave", (client, data) => {
            this.state.wave++;
            this.state.heroes.forEach((hero) => {
                hero.hp = data[hero.id].hp;
                hero.sp = data[hero.id].sp;
                if (hero.hp > 0) {
                    hero.lastWave = this.state.wave - 1;
                }
            });
            (0, makeDungeonRecord_1.updateDungeonRecord)(this.state.ethAddress, this.state.heroes, this.state.wave, this.state.dungeonId);
        });
        this.onMessage("respawnMonsters", async () => {
            const monsters = await (0, fetchWaveMonsters_1.fetchWaveMonsters)(options.map, this.state.wave);
            this.state.monsters = monsters;
        });
        this.onMessage("finishDungeon", async () => {
            const rewards = await (0, makeDungeonRecord_1.finishDungeon)(this.state.ethAddress, this.state.wave, this.state.dungeonId, this.state.map, this.state.heroes);
            const rewardSchema = new DungeonState_1.RewardState();
            rewardSchema.data = rewards;
            this.state.rewards = rewardSchema;
            this.clock.setTimeout(() => {
                this.disconnect();
            }, 5000);
        });
        this.onMessage("usePotions", async (client, data) => {
            const result = await (0, usePotions_1.usePotions)(data.eth, data.uid, data.amount);
        });
        this.onMessage("addMaterials", async (client, data) => {
            const result = await (0, addMaterials_1.addMaterials)(this.state.ethAddress, data.mat_uid, data.amount);
            if (result) {
                //this.state.diamonds = result["diamond"]
                //this.state.potions_inventory.push(result["potion"] as Potion_Inventory)
            }
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
exports.DungeonRoom = DungeonRoom;
