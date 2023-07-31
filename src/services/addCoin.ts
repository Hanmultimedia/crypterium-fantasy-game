import mongoose, { Schema, Document }  from 'mongoose';
import { TreasureRoom } from "../rooms/TreasureRoom";

export const userSchema = new mongoose.Schema({
      eth: String,
      doge: Number,
      bit: Number,
      coin: Number
      // other fields as required
    });


export async function addCoin(eth: string, type: string , scene : TreasureRoom) {

  let state = 0;
  try {
    let User:any;
    try {
      User = mongoose.model('UserCoin');
    } catch (error) {
      User = mongoose.model('UserCoin', userSchema);
    }

    // Use the model to query for a user with a matching eth address
    let user:any = await User.findOne({ eth });
    if (!user) {
      user = new User({
        eth,
        doge: 0,
        bit: 0,
        coin: 0
      });
    }

    if (type === "boss") {

      if (Math.random() < 0.01) {
        user.bit += 0.000001;
        state = 1;
      }else if (Math.random() < 0.01) {
        user.doge += 0.01;
        state = 2;
      }

    } else if(type === "chest1"){

      const random = Math.random();

      if (random < 0.02) {
        const doge = (Math.random() * (1 - 0.5) + 0.5).toFixed(6);
        user.doge += parseFloat(doge);
        state = parseFloat(doge);
      }else if(random < 0.12)
      {
        const coin = (Math.random() * (1 - 0.5) + 0.5).toFixed(6);
        user.coin += parseFloat(coin);
        state = parseFloat(coin);
      }

    } else if(type === "chest2"){
      const random = Math.random();
      if (random < 0.005) {
        const bit = (Math.random() * (1 - 0.5) + 0.5).toFixed(6);
        user.bit += parseFloat(bit);
        state = parseFloat(bit);
      }else if(random < 0.005 + 0.05)
      {
        const doge = (Math.random() * (1 - 0.5) + 0.5).toFixed(6);
        user.doge += parseFloat(doge);
        state = parseFloat(doge);
      }else if(random < 0.005 + 0.05 + 0.015)
      {
        const coin = (Math.random() * (1 - 0.5) + 0.5).toFixed(6);
        user.coin += parseFloat(coin);
        state = parseFloat(coin);
      }
    }
     else if(type === "chest3"){
      const random = Math.random();
      if (random < 0.001) {
        const bit = (Math.random() * (1 - 0.5) + 0.5).toFixed(6);
        user.bit += parseFloat(bit);
        state = parseFloat(bit);
      }else if(random < 0.001 + 0.01)
      {
        const doge = (Math.random() * (1 - 0.5) + 0.5).toFixed(6);
        user.doge += parseFloat(doge);
        state = parseFloat(doge);
      }else if(random < 0.001 + 0.01 + 0.015 )
      {
        const coin = (Math.random() * (1 - 0.5) + 0.5).toFixed(6);
        user.coin += parseFloat(coin);
        state = parseFloat(coin);
      }
    } else {
      if (Math.random() < 0.05) {
        const coin = (Math.random() * (1 - 0.5) + 0.5).toFixed(6);
        user.coin += parseFloat(coin);
        state = parseFloat(coin);
      }
    }

    await user.save();
    return state;

  } catch (error) {
    console.log(error);
    return state;
  }
}
