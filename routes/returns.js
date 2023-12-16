const Joi = require("joi");
const validate = require("../middleware/validate");
const { Rental } = require("../models/rental");
const { Movie } = require("../models/movie");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.post("/", [auth, validate(validateReturn)], async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

    if (!rental) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).send("Rental not found.");
    }

    if (rental.dateReturned) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send("Return already processed.");
    }

    rental.return();
    await rental.save({ session });

    const movie = await Movie.findByIdAndUpdate(
      rental.movie._id,
      { $inc: { numberInStock: 1 } },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.send(rental);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).send("Something failed: " + error.message);
  }
});

function validateReturn(req) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  };

  return Joi.validate(req, schema);
}

module.exports = router;
