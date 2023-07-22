import mongoose, { Schema, Document }  from 'mongoose';

export const userSchema = new mongoose.Schema({
      eth: String,
      doge: Number,
      bit: Number,
      coin: Number
      // other fields as required
    });


export async function addCoin(eth: string, type: string) {

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
        user.doge += 0.000001;
        state = 2;
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
