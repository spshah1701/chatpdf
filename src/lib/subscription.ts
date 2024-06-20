import { auth } from "@clerk/nextjs/server"
import { userSubscriptions } from "./db/schema"
import { eq } from "drizzle-orm"
import { db } from "./db"

export const checkSubscription = async () => {
  const {userId} = await auth()
  if(!userId){
    return false
  }


  const _userSubscriptions = await db.select().from(userSubscriptions).where(eq(userSubscriptions.userId, userId))

  if(!_userSubscriptions[0]) {
    // User is not subscribed
    return false
  }


  const userSubscription = _userSubscriptions[0]

  const DAY_IN_MS = 24 * 3600
  
  const isValid = userSubscription.stripePriceId && userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS >Date.now()

  return !!isValid

}