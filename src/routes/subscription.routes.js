import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
    toggleSubscription,
    getSubscriberCount,
    getallSubscribedchannel
} from "../controllers/subscriber.controller.js";

const router = Router();

// Apply requireAuth middleware to all subscription routes
router.use(requireAuth);

router
    .route("/c/:channelId")
    .post(toggleSubscription);



// Named helper endpoints
router.route("/count/:channelId").get(getSubscriberCount);
router.route("/channels/:channelId").get(getallSubscribedchannel);

export default router;

