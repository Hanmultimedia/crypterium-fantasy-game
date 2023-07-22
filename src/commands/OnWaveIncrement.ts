import { Command } from "@colyseus/command";
import { Room } from "colyseus";
import { DungeonRoom } from "../rooms/DungeonRoom";

export class OnWaveIncrement extends Command<DungeonRoom> {
  execute() {
    this.state.wave++;
  }
}