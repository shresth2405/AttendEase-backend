import Router from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getSchedulefromDB, syncSchedule } from "../controllers/schedule.controller.js";

const router = Router();

router.route('/sync').post(verifyJWT,syncSchedule);
router.route('/getAll').get(verifyJWT,getSchedulefromDB);

export default router;