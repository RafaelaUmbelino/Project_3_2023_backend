const { Schema, model } = require("mongoose");

const workplaceSchema = new Schema(
  {
      // place_id: String,
      // name: String,
      // photos: String,
      // url: String,
      // formatted_address: String,
      // website: String,

    description: {
      type: String,
      trim: true,
    },
      typeOfPlace: {
        type: [String],
        enum: ["coffee shop", "cowork space", "library/bookstore"],
      },
      comments: [{type: Schema.Types.ObjectId, ref:'Comment'}],
      paid: {
        type: [String],
        enum: ["yes", "no"],
      },

      rating: {
        type: [Number],
        enum: [1, 2, 3, 4, 5],
      }, 
  },
  {
    timestamps: true,
  }
);



const Workplace = model("Workplace", workplaceSchema);

module.exports = Workplace;
