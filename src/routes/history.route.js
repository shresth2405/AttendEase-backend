import Router from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getHistoryfromDB, syncHistory } from "../controllers/history.controller.js";

const router = Router();

router.route('/sync').post(verifyJWT,syncHistory);
router.route('/getAll').get(verifyJWT,getHistoryfromDB);

export default router;