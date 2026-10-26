import mongoose from "mongoose";
import { Likes } from "../models/like.models.js";
import { Apierror } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asynchandler } from "../utils/asynchandler.js";

const toggleVideoLike = asynchandler(async (req, res) => {
    const { VideoId, videoId } = req.params;
    const targetVideoId = VideoId || videoId;
    const userId = req.session.userId;

    const alreadyLiked = await Likes.findOne({
        video: targetVideoId,
        likedBy: userId
    });

    if (alreadyLiked) {
        await Likes.findByIdAndDelete(alreadyLiked._id);
        return res.status(200).json(
            new ApiResponse(200, "Unliked video successfully", { isLiked: false })
        );
    }

    const newLike = await Likes.create({
        video: targetVideoId,
        likedBy: userId
    });

    return res.status(200).json(
        new ApiResponse(200, "Liked video successfully", { isLiked: true, like: newLike })
    );
});

const toggleCommentLike = asynchandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.session.userId;

    const alreadyLiked = await Likes.findOne({
        comment: commentId,
        likedBy: userId
    });

    if (alreadyLiked) {
        await Likes.findByIdAndDelete(alreadyLiked._id);
        return res.status(200).json(
            new ApiResponse(200, "Unliked comment successfully", { isLiked: false })
        );
    }

    const newLike = await Likes.create({
        comment: commentId,
        likedBy: userId
    });

    return res.status(200).json(
        new ApiResponse(200, "Liked comment successfully", { isLiked: true, like: newLike })
    );
});

const getLikedVideos = asynchandler(async (req, res) => {
    const userId = req.session.userId;

    const likedVideos = await Likes.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(userId),
                video: { $exists: true, $ne: null }
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullname: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$video"
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $project: {
                _id: 1,
                video: 1,
                createdAt: 1
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, "Liked videos fetched successfully", likedVideos)
    );
});

export {
    toggleVideoLike,
    toggleCommentLike,
    getLikedVideos
};
