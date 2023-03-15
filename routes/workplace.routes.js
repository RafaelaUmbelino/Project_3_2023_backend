const router = require("express").Router();
const mongoose = require("mongoose");
// const axios = require("axios");

const Workplace = require("../models/Workplace.model")
const Comment = require("../models/Comment.model");
const User = require("../models/User.model");

const { isAuthenticated } = require("../middleware/jwt.middleware");

//CREATE ROUTES

// ********* require fileUploader in order to use it *********
const fileUploader = require("../config/cloudinary.config");

// POST "/api/upload" => Route that receives the image, sends it to Cloudinary via the fileUploader and returns the image URL
router.post("/upload", fileUploader.single("imageUrl"), (req, res, next) => {
  // console.log("file is: ", req.file)

  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }

  // Get the URL of the uploaded file and send it as a response.
  // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend

  res.json({ fileUrl: req.file.path });
});

//Create Workplace

router.post("/workplaces/new", isAuthenticated, async (req, res, next) => {
  const {
    name,
    address,
    link,
    typeOfPlace,
    rating,
    description,
    paid,
    imageUrl,
  } = req.body;
  const currentUser = req.payload._id;

  try {
    const workplace = await Workplace.create({
      name,
      address,
      link,
      typeOfPlace,
      rating,
      description,
      paid,
      imageUrl,
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


//Create Workplace
// -------- Working code
// router.post("/workplaces/new", isAuthenticated, async (req, res, next) => {
//   const { typeOfPlace, rating, description, paid } = req.body;
//   const currentUser = req.payload._id;

//   try {
//     const workplace = await Workplace.create({
//       typeOfPlace,
//       rating,
//       description,
//       paid,
//     });

//     const createdWorkplace = workplace._id;
//     const createdToUser = await User.findByIdAndUpdate(
//       currentUser,
//       {
//         $push: {
//           createdWorkplaces: createdWorkplace,
//         },
//       },
//       { new: true }
//     );

//     res.json(workplace);
//   } catch (error) {
//     res.json(error);
//   }
// });

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

router.put("/workplaces/:id", isAuthenticated, async (req, res, next) => {
  const { id } = req.params;
  const {
    name,
    address,
    link,
    typeOfPlace,
    rating,
    description,
    paid,
    imageUrl,
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.json("The provided workplace id is not valid");
  }

  try {
    const updatedWorkplace = await Workplace.findByIdAndUpdate(
      id,
      { name, address, link, typeOfPlace, rating, description, paid, imageUrl },
      { new: true }
    );

    res.json(updatedWorkplace);
  } catch (error) {
    res.json(error);
  }
});

// ------- Working code

// //Update

// router.put("/workplaces/:id", isAuthenticated, async (req, res, next) => {
//   const { id } = req.params;
//   const { typeOfPlace, comments, rating, description, paid } = req.body;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     res.json("The provided workplace id is not valid");
//   }

//   try {
//     const updatedWorkplace = await Workplace.findByIdAndUpdate(
//       id,
//       { typeOfPlace, comments, rating, description, paid },
//       { new: true }
//     );

//     res.json(updatedWorkplace);
//   } catch (error) {
//     res.json(error);
//   }
// });

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
