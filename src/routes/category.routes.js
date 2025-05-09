import { Router } from "express";
import { CategoryController } from "../controller/category.controller.js";
import { JwtAuthGuard } from "../middleware/jwt.auth.guard.js";
import { SelfAdminGuard } from "../middleware/self.admin.guard.js";

const controller = new CategoryController();
const router = Router();

router
  .post("/", JwtAuthGuard, SelfAdminGuard, controller.createCategory)
  .get("/", JwtAuthGuard, controller.getAllCategory)
  .get("/:id", JwtAuthGuard, controller.getByIdCategory)
  .patch("/:id", JwtAuthGuard, SelfAdminGuard, controller.updateCategory)
  .delete("/:id", JwtAuthGuard, SelfAdminGuard, controller.deleteCategory);

export default router;
