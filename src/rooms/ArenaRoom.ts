import { Room, Client } from "colyseus";
import { fetchHeroesArena } from "../services/fetchHeroesArena";
import { fetchArenaEnemies } from "../services/fetchArenaEnemies";
import { addDiamond } from "../services/addDiamond";
import { usePotions } from "../services/usePotions";
import { ArenaState } from "./ArenaState";

fetchArenaEnemies


import mongoose from 'mongoose';

export class ArenaRoom extends Room<ArenaState> {
  maxClients = 1;

  async onCreate(options:any) {
    this.roomId = options.ethAddress;
    console.log("Arena created!", options);
    this.setState(new ArenaState());
    this.setSeatReservationTime(10000) 

    await mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));

    let characters = await fetchHeroesArena(options.ethAddress);
    let enemies = await fetchArenaEnemies(options.ethAddress);
    this.state.ethAddress = options.ethAddress;
    this.state.heroes = characters;
    this.state.enemies = enemies;
    console.log("enemies.length"+this.state.enemies.length)

    this.onMessage("finisArena", async () => {
      //const rewards = await finishDungeon(this.state.ethAddress, this.state.wave, this.state.dungeonId, this.state.map, this.state.heroes)
      //const rewardSchema = new RewardState_T()
      //rewardSchema.data = rewards
      //this.state.rewards = rewardSchema

      //this.clock.setTimeout(() => {
      //  this.disconnect()
      //}, 5000)
    })

    this.onMessage("usePotions", async (client, data) => {
      const result = await usePotions(data.eth,data.uid,data.amount);
    })
  }

  onJoin(client: Client) {
    this.broadcast("messages", `${client.sessionId} joined.`);

    console.log(client.sessionId, "joined!");
  }

  onLeave(client: Client, consented: boolean) {
    this.broadcast("messages", `${client.sessionId} left.`);
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("Dispose ArenaRoom");
  }
}
