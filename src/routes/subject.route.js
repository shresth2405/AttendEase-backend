import Router from "express";
import { getSubjectsfromDB, syncSubject } from "../controllers/subject.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/sync').post(verifyJWT,syncSubject);
router.route('/getAll').get(verifyJWT,getSubjectsfromDB);

export default router;