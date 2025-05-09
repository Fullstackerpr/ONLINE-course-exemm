import Category from "../model/category.model.js";
import { catchError } from "../utils/error-response.js";
import { successRes } from "../utils/success-response.js";
import { categoryValidator } from "../validation/category.validation.js";

export class CategoryController {
  async createCategory(req, res) {
    try {
      const { error, value } = categoryValidator(req.body);
      if (error) {
        return catchError(req, 400, error);
      }

      const { name, description } = value;
      const category = await Category.create({
        name,
        description,
      });
      successRes(res, 200, "success", category);
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async getAllCategory(_, res) {
    try {
      const categories = await Category.find().populate("course");
      successRes(res, 200, "success", categories);
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async getByIdCategory(req, res) {
    try {
      const id = req.params.id;
      const category = await CategoryController.findById(res, id).populate(
        "course"
      );
      successRes(res, 200, "success", category);
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async updateCategory(req, res) {
    try {
      const id = req.params.id;
      await CategoryController.findById(res, id);
      if (req.body.name) {
        const existName = await Category.findOne({
          name: req.body.name,
        });
        if (existName && id != existName._id) {
          return catchError(res, 409, "Name already exists");
        }
        const updateCategory = await Category.findByIdAndUpdate(
          id,
          { ...req.body },
          { new: true }
        );
        successRes(res, 200, "success", updateCategory);
      }
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async deleteCategory(req, res) {
    try {
      const id = req.params.id;
      await CategoryController.findById(res, id);
      await Category.findByIdAndDelete(id);
      successRes(res, 200, "success", {});
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  static async findById(res, id) {
    try {
      const category = await Category.findById(id);
      if (!category) {
        return catchError(res, 404, `Category id not found: ${id}`);
      }
      return category;
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }
}
