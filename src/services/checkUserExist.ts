import mongoose from 'mongoose';
import axios from 'axios';

import { UserModel } from './user.model';

export async function checkUserExist(eth: string): Promise<any> {
  try {
    // Connect to MongoDB using your srv string
    //await mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
    // Define your user schema

    // Create a model from the schema

    // Use the model to query for a user with a matching eth address
    let user = await UserModel.findOne({ eth });
    // Close the Mongoose connection
    // If a user was found, return true
    if (user) {
      console.log(eth + " Exist" )

    //mongoose.connection.close();
      return true;
    }else{
    // If no user was found, return false
    console.log(eth + " Not Exist" )
    user = new UserModel({ eth:eth,diamond:2000,coupon:10 });
    await user.save();

    const totalUsers = await UserModel.countDocuments();
    //mongoose.connection.close();

    const response = await axios.post('https://support-api.crypterium.game/webhook/new-user-connect', {
        walletAddress: eth,
        totalUser: totalUsers
    });
    return false;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
}