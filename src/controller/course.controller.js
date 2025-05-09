import Category from "../model/category.model.js";
import Course from "../model/course.model.js";
import User from "../model/user.model.js";
import { catchError } from "../utils/error-response.js";
import { successRes } from "../utils/success-response.js";
import { courseValidator } from "../validation/course.validation.js";

export class CourseController {
  async createCourse(req, res) {
    try {
      const { error, value } = courseValidator(req.body);
      if (error) {
        return catchError(res, 400, error);
      }
      const { title, description, price, author_id, category_id } = value;
      const user = await User.findById(author_id);

      if (!user) {
        return catchError(res, 404, `author not found `);
      }

      if (user.role != "author") {
        return catchError(res, 403, `role is not author`);
      }

      const category = await Category.findById(category_id);
      if (!category) {
        return catchError(res, 404, `category not found `);
      }

      const course = await Course.create({
        title,
        description,
        price,
        author_id,
        category_id,
      });
      successRes(res, 201, "success", course);
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async getAllCourse(req, res) {
    try {
      const { category, price_lte } = req.query;

      let filter = {};

      if (category) {
        const categoryDoc = await Category.findOne({ name: category });

        if (!categoryDoc) {
          return successRes(res, 200, `No courses found`, []);
        }
        filter.category_id = categoryDoc._id;
      }

      if (price_lte) {
        filter.price = { $lte: parseFloat(price_lte) };
      }

      const courses = await Course.find(filter)
        .populate("author_id")
        .populate("category_id");
      if (!courses) {
        return catchError(res, 404, "Course not found");
      }
      successRes(res, 200, "success", courses);
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async getByIdCourse(req, res) {
    try {
      const id = req.params.id;
      const course = await CourseController.findById(res, id)
        .populate("author_id")
        .populate("category_id_id")
        .populate("enrollment");
      successRes(res, 200, "success", course);
    } catch (error) {
      catchError(res, 500, error.message);
    }
  }

  async updateCourse(req, res) {
    try {
      const id = req.params.id;
      await CourseController.findById(res, id);
      if (req.body.title) {
        const existTitle = await Course.findOne({
          title: req.body.title,
        });
        if (existTitle && id !== existTitle._id) {
          return catchError(res, 409, "Title already exists");
        }
      }

      const updateCourse = await Course.findByIdAndUpdate(
        id,
        { ...req.body },
        { new: true }
      );
      successRes(res, 200, "success", updateCourse);
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async deleteCourse(req, res) {
    try {
      const id = req.params.id;
      await CourseController.findById(res, id);
      await Course.findByIdAndDelete(id);
      successRes(res, 200, "success", {});
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  static async findById(res, id) {
    try {
      const course = await Course.findById(id);
      if (!course) {
        return catchError(res, 404, `Course id not found: ${id}`);
      }
      return course;
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }
}
