const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const workplaceSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    address: {
      type: String,
      trim: true,
      required: true,
    },
    link: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    typeOfPlace: {
      type: [String],
      enum: ["coffee shop", "cowork space", "library/bookstore"],
    },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    paid: {
      type: [String],
      enum: ["yes", "no", "order something"],
    },

    rating: {
      type: [Number],
      enum: [1, 2, 3, 4, 5],
    },
    imageUrl: String,
  },
  {
    timestamps: true,
  }
);

const Workplace = model("Workplace", workplaceSchema);

module.exports = Workplace;
