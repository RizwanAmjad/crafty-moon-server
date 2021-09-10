const express = require("express");
const { Category, validateCategoryJoi } = require("../models/categories");

const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

router.post("/", adminAuth, async (req, res) => {
  // validate the request body
  const error = validateCategoryJoi(req.body);
  if (error) return res.status(400).send(error);
  // create the category object
  const category = new Category(req.body);
  try {
    // save the category
    return res.send(await category.save());
  } catch (error) {
    return res.status(500).send(error);
  }
});

// route to get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    return res.send(categories);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// route to update the category
router.put("/:id", adminAuth, async (req, res) => {
  const { id } = req.params;
  // validate the request body
  const error = validateCategoryJoi(req.body);
  if (error) return res.status(400).send(error);
  // check to see if any document exists with the current id
  const doesExist = await Category.findById(id);
  if (!doesExist) return res.status(404).send("Category not found");
  try {
    const category = await Category.findByIdAndUpdate(id, req.body);
    return res.send(category);
  } catch (ex) {
    return res.status(500).send(ex);
  }
});

// TODO: implement a route to delete a particular category and all related paintings

module.exports = router;
