import Course from "../model/course.model.js";
import Enrollment from "../model/enrollment.model.js";
import User from "../model/user.model.js";
import { catchError } from "../utils/error-response.js";
import { successRes } from "../utils/success-response.js";
import { enrollmentValidator } from "../validation/enrollment.validation.js";

export class EnrollmentController {
  async createEnrollment(req, res) {
    try {
      const { error, value } = enrollmentValidator(req.body);
      if (error) {
        return catchError(res, 400, error);
      }
      const { course_id, user_id } = value;

      const user = await User.findById(user_id);

      if (!user) {
        return catchError(res, 404, `user not found `);
      }

      const course = await Course.findById(course_id);
      if (!course) {
        return catchError(res, 404, `course not found `);
      }
      const enrollments = await Enrollment.create({
        course_id,
        user_id,
      });

      successRes(res, 201, "success", enrollments);
    } catch (error) {
      catchError(res, 500, error.message);
    }
  }

  async getAllEnrollment(_, res) {
    try {
      const enrollments = await Enrollment.find()
        .populate("course_id")
        .populate("user_id");

      successRes(res, 200, "success", enrollments);
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async getByIdEnrollment(req, res) {
    try {
      const id = req.params.id;
      const enrollment = await EnrollmentController.findById(res, id)
        .populate("course_id")
        .populate("user_id");
      successRes(res, 200, "success", enrollment);
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async updateEnrollment(req, res) {
    try {
      const id = req.params.id;
      await EnrollmentController.findById(res, id);
      if (req.body.enrollment_at) {
        const existenrollment_at = await Enrollment.findOne({
          enrollment_at: req.body.enrollment_at,
        });
        if (existenrollment_at && id != existenrollment_at._id) {
          return catchError(res, 409, "Enrollment_at already exists");
        }
      }
      const updateEnrollment = await Enrollment.findByIdAndUpdate(
        id,
        { ...req.body },
        { new: true }
      );
      successRes(res, 200, "success", updateEnrollment);
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async deleteEnrollment(req, res) {
    try {
      const id = req.params.id;
      await EnrollmentController.findById(res, id);
      await Enrollment.findByIdAndDelete(id);
      successRes(res, 200, "success", {});
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  static async findById(res, id) {
    try {
      const review = await Enrollment.findById(id);
      if (!review) {
        return catchError(res, 404, `Review id not found: ${id}`);
      }
      return review;
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }
}
