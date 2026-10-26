import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const VideoSchema = new Schema({
owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
},
title: {
    type: String,
    required: true,
},
description: {
    type: String,
    required: true,
},
VideoFile: {
    type: String,
    required: true // cloudinary url
},
ThumbnailFile: {
    type: String,
    required: true,
},
VideoDuration: {
    type: Number, // yeh toh cloudinary he de dega
    required: true,
},
Views: {
    type: Number,
    default: 0
},
isPublished: {
    type: Boolean,
    default: true
}

}, {
    timestamps: true
});

VideoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", VideoSchema);