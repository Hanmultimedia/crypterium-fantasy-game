import { Coupon } from "../rooms/MenuState";
import mongoose from 'mongoose';
import axios from 'axios';
import { UserModel } from './user.model';

export async function fetchArenaStamina(eth:string): Promise<any> {
  

    try {

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

      if(user.arenastamina)
      {
        return user.arenastamina;
      }
      else
      {
        return 5;
      }
    
    }else
    {
      user.arenastamina = 0;
     // mongoose.connection.close();
      return 0;
    }


  } catch (error) {
    console.log(error);
    return 0;
  }
}