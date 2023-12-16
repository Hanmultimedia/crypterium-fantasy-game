import { Coupon } from "../rooms/MenuState";
import mongoose from 'mongoose';
import axios from 'axios';
import { UserModel } from './user.model';

export async function fetchStamina(eth:string): Promise<any> {
  

    try {

    // Use the model to query for a user with a matching eth address
    let user = await UserModel.findOne({ eth:eth });
    // If a user was found, return coupon
    if (user) {

      if(user.stamina)
      {
        return user.stamina;
      }
      else
      {
        return 0;
      }
    
    }else
    {
      user.stamina = 0;
     // mongoose.connection.close();
      return 0;
    }


  } catch (error) {
    console.log(error);
    return 0;
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