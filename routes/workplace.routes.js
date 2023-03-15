const router = require("express").Router();
const mongoose = require("mongoose");
// const axios = require("axios");

const Workplace = require("../models/Workplace.model");
const Comment = require("../models/Comment.model");
const User = require("../models/User.model");

const { isAuthenticated } = require("../middleware/jwt.middleware");

//CREATE ROUTES

//Create Workplace
router.post("/workplaces/new", isAuthenticated, async (req, res, next) => {
  const { typeOfPlace, rating, description, paid } = req.body;
  const currentUser = req.payload._id;

  try {
    const workplace = await Workplace.create({
      typeOfPlace,
      rating,
      description,
      paid,
    });

    const createdWorkplace = workplace._id;
    const createdToUser = await User.findByIdAndUpdate(
      currentUser,
      {
        $push: {
          createdWorkplaces: createdWorkplace,
        },
      },
      { new: true }
    );

    res.json(workplace);
  } catch (error) {
    res.json(error);
  }
});

//Create Comment
router.post("/comment/:id", isAuthenticated, async (req, res, next) => {
  const { id } = req.params;
  const { description } = req.body;
  const currentUser = req.payload._id;

  try {
    const comment = await Comment.create({
      description,
    });

    const createdComment = comment._id;

    //Push to Workplace and User
    const userToComment = await Comment.findByIdAndUpdate(createdComment, {
      $push: { user: currentUser },
    });
    const commentToWorkplace = await Workplace.findByIdAndUpdate(id, {
      $push: { comments: createdComment },
    });
    const commentToUser = await User.findByIdAndUpdate(currentUser, {
      $push: { userComments: createdComment },
    });

    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

//Read (all)

router.get("/workplaces", async (req, res, next) => {
  try {
    const workplaces = await Workplace.find();
    res.json(workplaces);
  } catch (error) {
    res.json(error);
  }
});

//Read (by id)

router.get("/workplaces/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const workplace = await Workplace.findById(id)
      .populate("comments")
      .populate({
        path: "comments",
        populate: { path: "user", model: "User" },
      });

    res.json(workplace);
  } catch (error) {
    res.json(error);
  }
});

//Update

router.put("/workplaces/:id", isAuthenticated, async (req, res, next) => {
  const { id } = req.params;
  const { typeOfPlace, comments, rating, description, paid } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.json("The provided workplace id is not valid");
  }

  try {
    const updatedWorkplace = await Workplace.findByIdAndUpdate(
      id,
      { typeOfPlace, comments, rating, description, paid },
      { new: true }
    );

    res.json(updatedWorkplace);
  } catch (error) {
    res.json(error);
  }
});

//Delete

router.delete("/workplaces/:id", async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.json("The provided workplace id is not valid");
  }

  try {
    //remove the tasks of the workplace
    const workplace = await Workplace.findById(id);
    await Comment.deleteMany({ _id: workplace.comments });

    //remove the workplace
    await Workplace.findByIdAndRemove(id);

    res.json({ message: `Workplace with the id ${id} deleted successfully` });
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;

// const response = await axios.get(
//   `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${PT}&key=${PLACES_API_KEY}`
// );
// const placeData = response.data.results[0];

// const workplace = await Workplace.create({
//   typeOfPlace,
//   rating,
//   description,
//   paid,
//   address: placeData.formatted_address,
//   website: placeData.website,
//   name: placeData.name,
//   photo: placeData.photos,
// });
