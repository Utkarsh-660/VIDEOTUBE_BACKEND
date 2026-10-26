import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import validate from "../middleware/validator.middleware.js";
import { addCommentValidator, updateCommentValidator } from "../validator/index.js";
import {
    addComment,
    updateComment,
    DeleteComment,
    getVideoComments
} from "../controllers/comment.controller.js";

const router = Router();

router.route("/:VideoId")
    .get(getVideoComments)
    .post(requireAuth, addCommentValidator(), validate, addComment);

router.route("/:VideoId/:commentId")
    .patch(requireAuth, updateCommentValidator(), validate, updateComment)
    .delete(requireAuth, DeleteComment);

export default router;
