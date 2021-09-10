const Joi = require("joi");
const mongoose = require("mongoose");

const Category = mongoose.model(
  "Category",
  mongoose.Schema({
    title: { type: String, required: true, unique: true },
    paintingsCount: { type: Number, default: 0, min: 0 },
  })
);

const validateCategoryJoi = (category) => {
  const schema = Joi.object({
    title: Joi.string().required().label("Title"),
  });
  const { error } = schema.validate(category);
  return error ? error.details[0].message : error;
};

module.exports = { Category, validateCategoryJoi };
