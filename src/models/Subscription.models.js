import mongoose ,{Schema} from "mongoose";
const SubscriptionSchema=new Schema({

Subscriber:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    //the user who subscribed

},
channel:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    //channel to which user has susbcribed
}

},
{
    timestamps:true,
})

export const Subscription=mongoose.model("Subscription",SubscriptionSchema);