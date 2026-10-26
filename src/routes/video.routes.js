import { Router } from "express";
import upload from "../middleware/multer.middleware.js";
import { requireAuth, authorizeVideoOwner } from "../middleware/auth.middleware.js";
import validate from "../middleware/validator.middleware.js";
import { PublishVideoValidator } from "../validator/index.js";
import {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    StreamVideo
} from "../controllers/video.controller.js";

const router = Router();

router.route("/")
    .get(getAllVideos)
    .post(
        requireAuth,
        upload.fields([
            {
                name: "VideoFile",
                maxCount: 1
            },
            {
                name: "thumbnailfile",
                maxCount: 1
            }
        ]),
        PublishVideoValidator(),
        validate,
        publishAVideo
    );

router.route("/:VideoId")
    .get(getVideoById)
    .patch(
        requireAuth,
        authorizeVideoOwner,
        upload.single("thumbnailfile"),
        updateVideo
    )
    .delete(
        requireAuth,
        authorizeVideoOwner,
        deleteVideo
    );

    router.route("/stream/:VideoId").get(StreamVideo);

export default router;

