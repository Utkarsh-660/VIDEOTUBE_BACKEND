import mongoose from "mongoose";
import { asynchandler } from "../utils/asynchandler.js";
import { Subscription } from "../models/Subscription.models.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/api-response.js";
import { Apierror } from "../utils/api-error.js";

const toggleSubscription = asynchandler(async (req, res) => {
    const { channelId } = req.params;

    const channel = await User.findById(channelId);
    if (!channel) {
        throw new Apierror(404, "Channel does not exist");
    }

    const subscriberId = req.session.userId;

    const existingSubscription = await Subscription.findOne({
        channel: channelId,
        Subscriber: subscriberId
    });

    if (existingSubscription) {
        await Subscription.findByIdAndDelete(existingSubscription._id);
        return res.status(200).json(
            new ApiResponse(200, "Successfully unsubscribed", { isSubscribed: false })
        );
    }

    const newSubscription = await Subscription.create({
        channel: channelId,
        Subscriber: subscriberId
    });

    return res.status(200).json(
        new ApiResponse(200, "Successfully subscribed", { isSubscribed: true, subscription: newSubscription })
    );
});

const getSubscriberCount = asynchandler(async (req, res) => {
    const { channelId } = req.params;

    if (!channelId || !mongoose.Types.ObjectId.isValid(channelId)) {
        throw new Apierror(400, "Invalid channel ID");
    }

    const channel = await User.findById(channelId);
    if (!channel) {
        throw new Apierror(404, "Channel does not exist");
    }

    const subscriberData = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "Subscriber",
                foreignField: "_id",
                as: "subscriber",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullname: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $group: {
                _id: "$channel",
                subscribers: { $push: { $first: "$subscriber" } },
                subscriberCount: { $sum: 1 }
            }
        },
        {
            $addFields: {
                subscriberCount: "$subscriberCount"
            }
        }
    ]);

    const result = subscriberData[0] || {
        _id: channelId,
        subscriberCount: 0,
        subscribers: []
    };

    return res.status(200).json(
        new ApiResponse(200, "Subscriber count fetched successfully", result)
    );
});

const getallSubscribedchannel = asynchandler(async (req, res) => {
    const { channelId } = req.params;

    const channel = await User.findById(channelId);
    if (!channel) {
        throw new Apierror(404, "Channel does not exist");
    }

    const subscribedChannels = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "Subscriber",
                foreignField: "_id",
                as: "subscriber",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullname: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                subscriber: {
                    $first: "$subscriber"
                }
            }
        },
        {
            $project: {
                _id: 1,
                subscriber: 1,
                createdAt: 1
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, "Subscribed channels fetched successfully", subscribedChannels)
    );
});

export {
    toggleSubscription,
    getSubscriberCount,
    getallSubscribedchannel
};