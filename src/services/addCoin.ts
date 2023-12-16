import mongoose, { Schema, Document }  from 'mongoose';
import { TreasureRoom } from "../rooms/TreasureRoom";

export const userSchema = new mongoose.Schema({
      eth: String,
      doge: Number,
      bit: Number,
      coin: Number
      // other fields as required
    });


export async function addCoin(eth: string, type: string , scene : TreasureRoom ) {

  let state = 0;
  let ExtraDoge = 0;
  let ExtraBit = 0;
  if(scene.state.characterBuff1)
  {
    ExtraDoge += 0.05;
  }

  if(scene.state.characterBuff2)
  {
    ExtraDoge += 0.10;
    ExtraBit += 0.01;
  }

  if(scene.state.star == 2)
  {
    ExtraDoge += 0.05;
  }

  if(scene.state.star == 3)
  {
    ExtraDoge += 0.05;
    ExtraBit += 0.01;
  }

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

      if (Math.random() < 0.01+ExtraBit) {
        user.bit += 0.000001;
        state = 1;
      }else if (Math.random() < 0.01+ExtraDoge) {
        user.doge += 0.01;
        state = 2;
      }

    } else if(type === "chest1"){

      const random = Math.random();

      if (random < 0.02 + ExtraDoge) {
        const doge = 0.01;
        user.doge += doge;
        state = doge;
      }else if(random < 0.02 + 0.20 + ExtraDoge)
      {
        const coin = (Math.random() * (0.4 - 0.7) + 0.7).toFixed(6);
        user.coin += parseFloat(coin)*2;
        state = parseFloat(coin)*2;
      }

    } else if(type === "chest2"){
      const random = Math.random();
      if (random < 0.005 + ExtraBit) {
        const bit = 0.000001;
        user.bit += bit;
        state = bit;
      }else if(random < 0.005 + 0.05 + ExtraDoge + ExtraBit)
      {
        const doge = 0.01;
        user.doge += doge;
        state = doge;
      }else if(random < 0.005 + 0.05 + 0.030 + ExtraDoge + ExtraBit)
      {
        const coin = (Math.random() * (0.6 - 0.9) + 0.9).toFixed(6);
        user.coin += parseFloat(coin)*2;
        state = parseFloat(coin)*2;
      }
    }
     else if(type === "chest3"){
      const random = Math.random();
      if (random < 0.01 + ExtraBit) {
        const bit = 0.000001;
        user.bit += bit;
        state = bit;
      }else if(random < 0.01 + 0.1 + ExtraBit + ExtraDoge)
      {
        const doge = 0.01;
        user.doge += doge;
        state = doge;
      }else if(random < 0.001 + 0.01 + 0.040 + ExtraBit + ExtraDoge)
      {
        const coin = (Math.random() * (1.5 - 1) + 1).toFixed(6);
        user.coin += parseFloat(coin)*2;
        state = parseFloat(coin)*2;
      }
    } else {
      if (Math.random() < 0.05) {
        const coin = (Math.random() * (15 - 10 + 1) + 10).toFixed(6);
        user.coin += parseFloat(coin)*2;
        state = parseFloat(coin)*2;
      }
    }

    await user.save();
    return state;

  } catch (error) {
    console.log(error);
    return state;
  }
}
