const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
    },
    workplace: { type: Schema.Types.ObjectId, ref: "Workplace" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Comment = model("Comment", commentSchema);

module.exports = Comment;
