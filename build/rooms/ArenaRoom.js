"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArenaRoom = void 0;
const colyseus_1 = require("colyseus");
const fetchHeroesArena_1 = require("../services/fetchHeroesArena");
const fetchArenaEnemies_1 = require("../services/fetchArenaEnemies");
const usePotions_1 = require("../services/usePotions");
const ArenaState_1 = require("./ArenaState");
fetchArenaEnemies_1.fetchArenaEnemies;
const mongoose_1 = __importDefault(require("mongoose"));
class ArenaRoom extends colyseus_1.Room {
    constructor() {
        super(...arguments);
        this.maxClients = 1;
    }
    async onCreate(options) {
        this.roomId = options.ethAddress;
        console.log("Arena created!", options);
        this.setState(new ArenaState_1.ArenaState());
        this.setSeatReservationTime(10000);
        await mongoose_1.default.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
        const db = mongoose_1.default.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        let characters = await (0, fetchHeroesArena_1.fetchHeroesArena)(options.ethAddress);
        let enemies = await (0, fetchArenaEnemies_1.fetchArenaEnemies)(options.ethAddress);
        this.state.ethAddress = options.ethAddress;
        this.state.heroes = characters;
        this.state.enemies = enemies;
        console.log("enemies.length" + this.state.enemies.length);
        this.onMessage("finisArena", async () => {
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
    }
    onDispose() {
        console.log("Dispose ArenaRoom");
    }
}
exports.ArenaRoom = ArenaRoom;
