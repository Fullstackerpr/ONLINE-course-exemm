import { Router } from "express";
import { UserController } from "../controller/user.controller.js";
import { JwtAuthGuard } from "../middleware/jwt.auth.guard.js";
import { SelfAdminGuard } from "../middleware/self.admin.guard.js";
import { SuperAdminGuard } from "../middleware/superadmin.guard";
import { SelfUserGuard } from "../middleware/self.user.guard.js";
import { SelfAuthorGuard } from "../middleware/self.author.guard.js";

const router = Router();
const controller = new UserController();

//TODO:User
router
  .post("/", JwtAuthGuard, SelfAdminGuard, controller.createUser)
  .post("/superadmin", controller.createSuperAdmin)
  .post("/admin", JwtAuthGuard, SuperAdminGuard, controller.createAdmin)
  .post("/author", JwtAuthGuard, SuperAdminGuard, controller.createAuthor)

  //TODO:Author

  .post("/signin", controller.signinUser)
  .post("/confirm", controller.confirmUser)
  .post("/signout", controller.signOutUser)
  .post("/token", controller.accessToken)

  //TODO:User
  .get("/user", JwtAuthGuard, SelfAdminGuard, controller.getAllUser)
  .get("/admin", JwtAuthGuard, SuperAdminGuard, controller.getAllAdmin)
  .get("/author", JwtAuthGuard, SelfAdminGuard, controller.getAllAuthor)
  .get("/:id", JwtAuthGuard, SelfUserGuard, controller.getByIdUser)

  //TODO:User
  .patch("/admin/:id", JwtAuthGuard, SelfAdminGuard, controller.updateUser)
  .patch(
    "/superadmin/:id",
    JwtAuthGuard,
    SuperAdminGuard,
    controller.updateUser
  )
  .patch("/user/:id", JwtAuthGuard, SelfUserGuard, controller.updateUser)
  .patch("/author/:id", JwtAuthGuard, SelfAuthorGuard, controller.updateUser)

  .delete("/:id", controller.deleteUser);

export default router;
