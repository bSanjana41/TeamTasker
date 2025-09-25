import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const projectSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, default: "" }

}, { timestamps: true })

const Project = model("Project", projectSchema);
export default Project