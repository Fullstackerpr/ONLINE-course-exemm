import { Router } from "express";
import { ReviewController } from "../controller/review.controller.js";
import { JwtAuthGuard } from "../middleware/jwt.auth.guard.js";
import { SelfAdminGuard } from "../middleware/self.admin.guard.js";

const router = Router();
const controller = new ReviewController();


router
    .post('/',JwtAuthGuard, controller.createReview)
    .get('/',JwtAuthGuard,SelfAdminGuard, controller.getAllReview)
    .get('/',JwtAuthGuard, controller.getByIdReview)
    .patch('/',JwtAuthGuard, controller.updateReview)
    .delete('/',JwtAuthGuard, controller.deleteReview)


export default router;