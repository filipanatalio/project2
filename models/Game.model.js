const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const gameSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    minPlayer: {
      type: Number,
      trim: true,
      required: true,
    },
    maxPlayer: {
      type: Number,
      trim: true,
      required: true,
    },
    rulesUrl: {
      type: String,
      default: undefined,
    },
    minAge: {
      type: Number,
      trim: true,
      required: true,
      },
    maxPlay: {
      type: Number,
      trim: true,
    },
    thumb_url: {
      type: String,
      trim: true,
    },
    apiID: {
      type: String,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Game = model("Game", gameSchema);

module.exports = Game;
