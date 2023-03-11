const router = require("express").Router();
const mongoose = require("mongoose");

const Workplace = require("../models/Workplace.model");
const Comment = require("../models/Comment.model");
const User = require("../models/User.model");

const { isAuthenticated } = require("../middleware/jwt.middleware");

//Add to favorites
router.post("/users/:userId/:workplaceId/favorites", async (req, res) => {
  const { userId, workplaceId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(user);

    const workplace = await Workplace.findById(workplaceId);
    console.log(workplace);
    const myUpdatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          favoriteWorkplaces: workplaceId,
        },
      },
      { new: true }
    );
    console.log(myUpdatedUser);
    // Check if the workplace is already in the user's favorites
    /* if (user.favoriteWorkplaces.includes(workplaceId)) {
        return res.status(400).json({ message: "Workplace already in favorites" });
      } */

    // Add the workplace to the user's favorites
    /* user.favoriteWorkplaces.push(workplaceId);
      await user.save();
   */
    res.status(201).json(myUpdatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//Delete a favorite

router.delete("/favorite/:id", async (req, res, next) => {
  let { id } = req.params;
  let currentUser = req.payload._id;

  try {
    const removeFavorite = await User.findByIdAndUpdate(
      { currentUser },
      { $pull: { favoriteWorkplaces: id } }
    );

    res.json({ message: `Favorite with the id ${id} deleted successfully` });
  } catch (error) {
    res.json(error);
  }
});

//show user profile - created and favorites

router.get("/user/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const userInfo = await User.findById(id)
      .populate("createdWorkplaces")
      .populate("favoriteWorkplaces");

    res.json(userInfo);
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
