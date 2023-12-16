const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Genre, validate } = require("../models/genre");

router.get("/", async (req, res) => {
  const genres = await Genre.find().select("-__v").sort("name");
  res.send(genres);
});

router.post("/", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({ name: req.body.name });
    genre = await genre.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.send(genre);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).send("Transaction aborted: " + error.message);
  }
});

router.put("/:id", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      {
        new: true,
        session,
      }
    );

    if (!genre)
      return res.status(404).send("The genre with the given ID was not found.");

    await session.commitTransaction();
    session.endSession();

    res.send(genre);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).send("Transaction aborted: " + error.message);
  }
});

router.delete("/:id", async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(genre);
});

router.get("/:id", async (req, res) => {
  const genre = await Genre.findById(req.params.id).select("-__v");

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(genre);
});

module.exports = router;
