import User from "../model/user.model.js";
import { catchError } from "../utils/error-response.js";
import { userValidator } from "../validation/user.validation.js";
import { encode, decode } from "../utils/bcrypt-encrypt.js";
import { successRes } from "../utils/success-response.js";
import { transporter } from "../utils/mailer.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generate-token.js";
import { getCache, setCache } from "../utils/cache.js";
import { refTokenCookie } from "../utils/write-cookie.js";
import { otpGenerator } from "../utils/otp-generator.js";

export class UserController {
  async createUser(req, res) {
    try {
      const { error, value } = userValidator(req.body);
      if (error) {
        return catchError(res, 400, error);
      }
      const { fullName, email, password } = value;

      const hashedPassword = await encode(password, 7);
      const user = await User.create({
        fullName,
        email,
        hashedPassword,
        role: "user",
      });
      successRes(res, 201, "success", user);
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async createSuperAdmin(req, res) {
    try {
      const { error, value } = userValidator(req.body);
      if (error) {
        return catchError(res, 400, error);
      }
      const { fullName, email, password } = value;
      const checkSuperAdmin = await User.findOne({ role: "superadmin" });
      if (checkSuperAdmin) {
        return catchError(res, 409, "Superadmin already exists");
      }
      const hashedPassword = await encode(password, 7);
      const superadmin = await User.create({
        fullName,
        email,
        hashedPassword,
        role: "superadmin",
      });

      successRes(res, 201, "success", superadmin);
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async createAdmin(req, res) {
    try {
      const { error, value } = userValidator(req.body);
      if (error) {
        return catchError(res, 400, error);
      }
      const { fullName, email, password } = value;
      const hashedPassword = await encode(password, 7);
      const admin = await User.create({
        fullName,
        email,
        hashedPassword,
        role: "admin",
      });
      successRes(res, 201, "success", admin);
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async createAuthor(req, res) {
    try {
      const { error, value } = userValidator(req.body);
      if (error) {
        return catchError(res, 400, error);
      }
      const { fullName, email, password } = value;
      const hashedPassword = await encode(password, 7);
      const author = await User.create({
        fullName,
        email,
        hashedPassword,
        role: "author",
      });
      successRes(res, 201, "success", author);
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async signinUser(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return catchError(res, 404, "Email not found");
      }

      const isMatch = await decode(password, user.hashedPassword);
      if (!isMatch) {
        return catchError(res, 400, "Invalid password");
      }
      const otp = otpGenerator();
      const mailMessage = {
        from: process.env.SMTP_USER,
        to: "bahodirnabijanov782@gmail.com",
        subject: "online-course",
        text: otp,
      };
      transporter.sendMail(mailMessage, function (err, info) {
        if (err) {
          console.log(`Error on sending to email: ${err}`);
          return catchError(res, 400, err);
        } else {
          console.log(info);
          setCache(user.email, otp);
        }
      });
      successRes(res, 200, "success");
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async confirmUser(req, res) {
    try {
      const { email, otp } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return catchError(res, 404, "User not found");
      }

      const otpCache = getCache(email);
      if (!otpCache || otp != otpCache) {
        return catchError(res, 400, "Otp expired");
      }
      const payload = { id: user._id, is_user: true };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);
      refTokenCookie(res, "refreshTokenUser", refreshToken);
      successRes(res, 200, "success", accessToken);
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async accessToken(req, res) {
    try {
      const refreshToken = req.cookies.refreshTokenUser;
      if (!refreshToken) {
        return catchError(res, 401, "Refresh token not found");
      }
      const decodeToken = JwtAuthGuard.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_KEY
      );
      if (decodeToken) {
        return catchError(res, 401, "Refresh token expired");
      }
      const payload = { id: decodeToken._id, role: decodeToken.role };
      const accessToken = generateAccessToken(payload);
      successRes(res, 200, "success", accessToken);
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async signOutUser(req, res) {
    try {
      const refreshToken = req.cookies.refreshTokenUser;
      if (!refreshToken) {
        return catchError(res, 401, "Refresh token not found");
      }
      const decodeToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_KEY
      );
      if (!decodeToken) {
        return catchError(res, 401, "refresh token expired");
      }
      res.clearCookie("refreshTokenUser");
      successRes(res, 200, "success", {});
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async getAllUser(_, res) {
    try {
      const users = await User.find()
        // .populate("enrollment")
        .populate("course")
        // .populate("review")
      successRes(res, 200, "success", users);
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async getAllAdmin(_, res) {
    try {
      const admins = await User.find();
      successRes(res, 200, "success", admins);
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async getAllAuthor(_, res) {
    try {
      const authors = await User.find();
      successRes(res, 200, "success", authors);
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async getByIdUser(req, res) {
    try {
      const user = await UserController.findById(res, req.params.id)
        .populate("enrollment")
        .populate("course")
        .populate("review");

      successRes(res, 200, "success", user);
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async updateUser(req, res) {
    try {
      const id = req.params.id;
      const user = await UserController.findById(res, id);
      if (req.body.fullName) {
        const existfullName = await User.findOne({
          fullName: req.body.fullName,
        });
        if (existfullName && id !== existfullName._id) {
          return catchError(res, 409, "FullName already exist");
        }
      }
      let hashedPassword = user.hashedPassword;
      if (req.body.password) {
        hashedPassword = encode(req.body.password, 7);
        delete req.body.password;
      }
      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          ...req.body,
          hashedPassword,
        },
        {
          new: true,
        }
      );
      successRes(res, 200, "success", updatedUser);
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async deleteUser(req, res) {
    try {
      const id = req.params.id;
      await UserController.findById(res, id);
      await User.findByIdAndDelete(id);
      successRes(res, 200, "success", {});
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  static async findById(res, id) {
    try {
      const user = await User.findById(id);
      if (!user) {
        return catchError(res, 404, `User not found by id: ${id}`);
      }
      return user;
    } catch (error) {
      catchError(res, 500, error.message);
    }
  }
}
