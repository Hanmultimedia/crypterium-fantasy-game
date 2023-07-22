import { Room, Client } from "colyseus";
import { Character, HuntState } from "./HuntState";

const keys = ['1001', '1002', '1003', '1004']

export default class HuntRoom extends Room<HuntState> {
    maxClients = 1;

    onCreate (options) {
        console.log("Huntroom created!", options);
        this.setState(new HuntState())

        this.state.mapWidth = 800
        this.state.mapHeight = 600
    }

    onJoin (client) {
        this.broadcast("messages", `${ client.sessionId } joined.`);

        console.log(client.sessionId, "joined!");

        // create character at random position.

        for(let i=0;i<1;i++) {
          const character = new Character();
          //character.x = Math.random() * this.state.mapWidth;
          // character.y = Math.random() * this.state.mapHeight;
          
          character.x = 300
          character.y = 800

          const rnd = Math.floor(Math.random() * keys.length)
          character.uid = keys[rnd]

          this.state.characters.push(character);

        }

        for(let i=0; i<3; i++) {
            const character = new Character();
            character.x = 500 * (i+1)
            character.y = (Math.random() * 300) + 200

            const rnd = Math.floor(Math.random() * keys.length)
            character.uid = keys[rnd]

            this.state.enemies.push(character);
        }
        
    }

    onLeave (client: Client, consented: boolean) {
        this.broadcast("messages", `${ client.sessionId } left.`);
        console.log(client.sessionId, "left!");
        //this.state.characters.delete(client.sessionId);
    }

    onDispose () {
        console.log("Dispose Huntroom");
    }

}