import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({

    fileName:String,

    status:String,

    anomalyTime:String,

    confidence:Number,

    framePath:{
        type:String
    },

    createdAt:{
        type:Date,
        default:Date.now
    }
});

export const Video =
mongoose.model(
    "Video",
    videoSchema
);