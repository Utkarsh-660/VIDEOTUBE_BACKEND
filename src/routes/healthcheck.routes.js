import { Router } from "express";
import { healthCheck,instagramcontroller } from "../controllers/healthcheck.controller.js";
const router=Router();

router.route('/').get(healthCheck);
router.route('/insta').get(instagramcontroller);
export default router;