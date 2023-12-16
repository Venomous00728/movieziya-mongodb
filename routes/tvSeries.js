const { TvSerial, validate } = require("../models/tvSerial");
const { Genre } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const moment = require("moment");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const series = await TvSerial.find().select("-__v").sort("name");
  res.send(series);
});

router.post("/", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  const serial = new TvSerial({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
    publishDate: moment().toJSON(),
  });
  await movie.save();

  res.send(serial);
});

router.put("/:id", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  const serial = await TvSerial.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    { new: true }
  );

  if (!serial)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(serial);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const serial = await TvSerial.findByIdAndRemove(req.params.id);

  if (!serial)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(serial);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const serial = await TvSerial.findById(req.params.id).select("-__v");

  if (!serial)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(serial);
});

module.exports = router;
