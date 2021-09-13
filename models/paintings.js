const Joi = require("joi");
const mongoose = require("mongoose");

const { Category } = require("./categories");

const PaintingSchema = mongoose.Schema({
  title: { type: String, required: true },
  caption: { type: String },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  images: {
    type: [{ type: String, required: true }],
    validate: [
      function (images) {
        return images.length > 0;
      },
      "Select atleast 1 image",
    ],
  },
  price: { type: Number, required: true, min: 0 },
});

PaintingSchema.pre("save", async function (next) {
  const category = await Category.findById(this.category);
  category.paintingsCount += 1;
  category.save();
  next();
});

PaintingSchema.pre("remove", async function (next) {
  const category = await Category.findById(this.category);
  category.paintingsCount -= 1;
  category.save();
  next();
});

const Painting = mongoose.model("Painting", PaintingSchema);

const validatePaintingJoi = (painting) => {
  const schema = Joi.object({
    title: Joi.string().required().label("Title"),
    caption: Joi.string().label("Caption"),
    category: Joi.string().required().label("Category"),
    images: Joi.array()
      .items(Joi.string().required())
      .required()
      .label("Images"),
    price: Joi.number().min(0).required().label("Price"),
  });
  const { error } = schema.validate(painting);
  return error ? error.details[0].message : error;
};

module.exports = { Painting, validatePaintingJoi };
