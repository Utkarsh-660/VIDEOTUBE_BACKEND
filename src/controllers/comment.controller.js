import mongoose from "mongoose";
import { Comment } from "../models/comment.models.js";
import { Video } from "../models/video.models.js";
import { Apierror } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asynchandler } from "../utils/asynchandler.js";

const addComment = asynchandler(async (req, res) => {
    const { VideoId } = req.params;
    const { content } = req.body;

    const video = await Video.findById(VideoId);
    if (!video) {
        throw new Apierror(404, "Video does not exist");
    }

   

    const comment = await Comment.create({
        commentbody: content,
        video: video._id,
        owner: req.session?.userId
    });

    return res.status(201).json(
        new ApiResponse(201, "Comment added successfully", comment)
    );
});

const updateComment = asynchandler(async (req, res) => {
    const { VideoId, commentId } = req.params;
    const { content } = req.body;

    const id = commentId || VideoId;
    const updatedComment = await Comment.findByIdAndUpdate(
        id,
        {
            $set: {
                commentbody: content
            }
        },
        { new: true }
    );

    if (!updatedComment) {
        throw new Apierror(404, "Comment does not exist");
    }

    return res.status(200).json(
        new ApiResponse(200, "Comment updated successfully", updatedComment)
    );
});

const DeleteComment = asynchandler(async (req, res) => {
    const { VideoId, commentId } = req.params;

    const video = await Video.findById(VideoId);
    if (!video) {
        throw new Apierror(404, "Video does not exist");
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new Apierror(404, "Comment does not exist");
    }

    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json(
        new ApiResponse(200, "Comment deleted successfully", {})
    );
});

const getVideoComments = asynchandler(async (req, res) => {
    const { VideoId, videoId } = req.params;
    const targetVideoId = VideoId || videoId;
    const { page = 1, limit = 10 } = req.query;

   

    const video = await Video.findById(targetVideoId);
    if (!video) {
        throw new Apierror(404, "Video not found");
    }

  

    const commentsAggregate = Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(targetVideoId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "comment",
                as: "likes"
            }
        },
        {
            $addFields: {
                likesCount: {
                    $size: "$likes"
                },
                owner: {
                    $first: "$owner"
                },
                isLiked: {
                    $cond: {
                        if: { $in: [currentUserId, "$likes.likedBy"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $project: {
                commentbody: 1,
                content: "$commentbody",
                createdAt: 1,
                likesCount: 1,
                owner: {
                    username: 1,
                    fullname: 1,
                    avatar: 1
                },
                isLiked: 1
            }
        }
    ]);

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    };

    const comments = await Comment.aggregatePaginate(commentsAggregate, options);

    return res.status(200).json(
        new ApiResponse(200, "Comments fetched successfully", comments)
    );
});

export {
    addComment,
    updateComment,
    DeleteComment,
    getVideoComments
};
