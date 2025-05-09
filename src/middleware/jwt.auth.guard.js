import { catchError } from "../utils/error-response.js";
import jwt from "jsonwebtoken";

export const JwtAuthGuard = (req, res, next) => {
  try {
    const auth = req.headers?.authorization;
    if (!auth || !auth.startsWith("Bearer")) {
      return catchError(res, 401, "Aythorization error");
    }

    const token = auth.split(" ")[1];
    if (!token) {
      return catchError(res, 401, "Token not found");
    }
    const decodeData = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    if (!decodeData) {
      return catchError(res, 401, "Token expired");
    }
    req.user = decodeData;
    return next();
  } catch (error) {
    return catchError(res, 500, error.message);
  }
};
