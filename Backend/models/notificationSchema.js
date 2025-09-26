import mongoose from "mongoose";

const { Schema, model, models, SchemaTypes } = mongoose;

const notificationSchema = new Schema({
    user: { type: SchemaTypes.ObjectId, ref: "User", required: true },
    task: { type: SchemaTypes.ObjectId, ref: "Task", required: true },
    type: { type: String, enum: ["assigned","updated","commented"], default: "commented" },
    text: { type: String, required: true },
    read: {type:Boolean,default:false},
},
     { timestamps: true });

const Notification = model("Notification", notificationSchema);
export default Notification
