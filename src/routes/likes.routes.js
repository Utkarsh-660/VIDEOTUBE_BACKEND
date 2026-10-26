import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
    toggleVideoLike,
    toggleCommentLike,
    getLikedVideos
} from "../controllers/like.controller.js";

const router = Router();

// All like routes require authentication
router.use(requireAuth);

router.route("/toggle/v/:VideoId").post(toggleVideoLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike);
router.route("/videos").get(getLikedVideos);

export default router;

