import { catchError } from "../utils/error-response.js";

export const SelfAuthorGuard = (req, res, next) => {
  try {
    const user = req?.user;
    if (user || user.role === "superadmin" || user.role === "admin" || (user.role === "author" && user._id == req.params.id)) {
      return next();
    } else {
      return catchError(res, 403, "Forbiddin role");
    }
  } catch (error) {
    return catchError(res, 500, error.message);
  }
};
