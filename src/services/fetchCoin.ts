import mongoose from 'mongoose';
import axios from 'axios';

export const userSchema = new mongoose.Schema({
      eth: String,
      doge: Number,
      bit: Number,
      coin: Number
      // other fields as required
    });

export async function fetchCoin(eth:string,type:number): Promise<any> {

    try {
    // Connect to MongoDB using your srv string
    //await mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
    // Define your user schema
    // Create a model from the schema

    let User: any;
    try {
      User =  mongoose.model('UserCoin');
    } catch (error) {
      User = mongoose.model('UserCoin', userSchema);
    }
    // Use the model to query for a user with a matching eth address
    let user = await User.findOne({ eth:eth });
    // If a user was found, return coupon
    if (user) {
    // Close the Mongoose connection
    if(type == 1)
    return user.bit;
    if(type == 2)
    return user.doge;
    if(type == 3)
    return user.coin;
    }else
    {
      //console.log("user not found " + eth)
      //mongoose.connection.close();
      return 0;
    }

  } catch (error) {
    mongoose.connection.close();
    console.log(error);
    return 0;
  }
  


  /*const doc = await db.collection('Wallet').doc(eth).get()

  if (doc.exists) {
    const diamond = doc.data()
    return diamond.diamond
  }*/
}