import { Coupon } from "../rooms/MenuState";
import mongoose from 'mongoose';
import axios from 'axios';

const userSchema = new mongoose.Schema({
  eth: String,
  diamond: Number,
  coupon: Number,
  coupon2: Number,
  profilename: String,
  profilepic:Number,
  stamina:Number,
  battlepoint: { type: Number, default: 0 }
  // other fields as required
});


export async function fetchCoupons(eth:string): Promise<any> {
  
    let array = []
    let c = new Coupon()
    c.uid = "100001"
    c.quantity = 0

    try {
    // Define your user schema
    console.log("Fetch Coupon")
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
    const coupon = user.coupon
    // Close the Mongoose connection
    //mongoose.connection.close();
    c.quantity = coupon
    array.push(c)
    console.log("user have " + coupon + " coupon")
    return array;
    }else
    {
      console.log("user not found")
     // mongoose.connection.close();
      array.push(c)
      return array;
    }


  } catch (error) {
    console.log(error);
    return array;
  }
}