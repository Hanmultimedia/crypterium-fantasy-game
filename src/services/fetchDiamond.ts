import mongoose from 'mongoose';
import axios from 'axios';

export const userSchema = new mongoose.Schema({
      eth: String,
      diamond: Number,
      coupon: Number,
      // other fields as required
    });

export async function fetchDiamond(eth:string): Promise<any> {

    try {
    // Connect to MongoDB using your srv string
    //await mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
    // Define your user schema
    console.log("Fetch Diamond")
    // Create a model from the schema

    let User: any;
    try {
      User =  mongoose.model('User');
    } catch (error) {
      User = mongoose.model('User', userSchema);
    }
    // Use the model to query for a user with a matching eth address
    let user = await User.findOne({ eth:eth });
    // If a user was found, return coupon
    if (user) {
    // Close the Mongoose connection
    const diamond = user.diamond
    //mongoose.connection.close();
    console.log("user have " + diamond + " diamond")
    return diamond;
    }else
    {
      console.log("user not found")
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