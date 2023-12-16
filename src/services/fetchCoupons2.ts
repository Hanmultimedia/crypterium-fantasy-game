import { Coupon } from "../rooms/MenuState";
import mongoose from 'mongoose';
import axios from 'axios';

export const userSchema = new mongoose.Schema({
      eth: String,
      diamond: Number,
      coupon: Number,
      coupon2: Number
      // other fields as required
    });


export async function fetchCoupons2(eth:string): Promise<any> {
  
    let array = []
    let c = new Coupon()
    c.uid = "200001"
    c.quantity = 0

    try {
    // Connect to MongoDB using your srv string
    //await mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
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
    let coupon = user.coupon2

    if(!coupon)
    {
      coupon = 0
    }
    // Close the Mongoose connection
    //mongoose.connection.close();
    c.quantity = coupon
    array.push(c)
    console.log("Coupon2 user have " + coupon + " coupon")
    return array;
    }else
    {
      console.log("user not found")
     // mongoose.connection.close();
      array.push(c)
      return array;
    }


  } catch (error) {
    mongoose.connection.close();
    console.log(error);
    return array;
  }

  /*const snapshot = await db.collection('User').doc(eth).collection('Coupon').get()
  const coupons:any[] = []
  snapshot.forEach((doc) => {
    const data:any = doc.data()
    const coupon = new Coupon()
    coupon.uid = data.uid
    coupon.quantity = data.quantity
    if(!data.quantity)
    {
      coupon.quantity = 0
    }
    coupons.push(coupon)
  });
  return coupons*/
}