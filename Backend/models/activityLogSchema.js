import mongoose from "mongoose";

const { Schema, model, models, SchemaTypes } = mongoose;

const activityLogSchema = new Schema({
    user: { type: SchemaTypes.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    metadata: { type: Object }
}, { timestamps: true });

const activityLog = model("ActivityLog", activityLogSchema);
export default activityLog
