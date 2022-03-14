const express = require("express");
const path = require("path");

const upload = require("express-fileupload");

const { Painting, validatePaintingJoi } = require("../models/paintings");
const { Category } = require("../models/categories");

const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

const { v4: uuidv4 } = require("uuid");

router.post("/", adminAuth, upload(), async (req, res) => {
  // validate the request body
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files uploaded");
  }

  const { images } = req.files;

  const error = validatePaintingJoi(req.body);
  if (error) return res.status(400).send(error);

  // check to see if category is valid and existing
  const isCategoryValid = await Category.findById(req.body.category);

  if (!isCategoryValid) return res.status(400).send("Invalid Category");

  const imageNames = images.map(async (image) => {
    const extension = path.extname(image.name);
    const name = `${uuidv4()}${extension}`;
    try {
      await image.mv(`${__basedir}/static/uploads/${name}`);
    } catch (e) {
      return res.status(500);
    }
    return name;
  });

  req.body.images = await Promise.all(imageNames);

  let painting = new Painting(req.body);
  try {
    painting = await painting.save();
    return res.send(painting);
  } catch (ex) {
    return res.status(500).send(ex);
  }
});

router.delete("/:id", adminAuth, async (req, res) => {
  const { id } = req.params;
  // delete the painting
  try {
    const painting = await Painting.findById(id);
    if (!painting) return res.status(404).send("Painting not Found!");
    return res.send(await painting.remove());
  } catch (ex) {
    return res.status(500).send("Server Error");
  }
});

router.put("/:id", adminAuth, async (req, res) => {
  const { id } = req.params;
  // validate the request body
  const error = validatePaintingJoi(req.body);
  if (error) return res.status(400).send(error);
  // check to see if any document exists with the current id
  const doesExist = await Painting.findById(id);
  if (!doesExist) return res.status(404).send("Painting not found");
  try {
    const painting = await Painting.findByIdAndUpdate(id, req.body);
    return res.send(painting);
  } catch (ex) {
    return res.status(500).send(ex);
  }
});

module.exports = router;
