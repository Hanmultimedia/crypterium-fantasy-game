"use strict";
//import { db } from "../arena.config";
//import { firestore } from "firebase-admin";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialize = void 0;
async function initialize(eth) {
    /*const ref:firestore.DocumentReference = db.collection('User').doc(eth)
    const doc = await ref.get()
    if (!doc.exists) {
      await initializeUser(ref)
      return;
    }
  
    const user = doc.data()
  
    if (!user.initialized) {
      await initializeUser(ref)
      return;
    }
  
  }
  
  async function initializeUser(ref:firestore.DocumentReference) {
    await ref.collection("Coupon").doc('100001').set({
      uid: '100001',
      quantity: 10
    })
  
    await ref.set({
      initialized: firestore.FieldValue.serverTimestamp()
    }, {merge: true})*/
}
exports.initialize = initialize;
