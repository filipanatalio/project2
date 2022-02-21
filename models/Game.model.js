const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const gameSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      // unique: true -> Ideally, should be unique, but its up to you
    },
    description: {
      type: String,
      trim: true,
    },
    numberOfPlayers: {
      type: String,
      trim: true,
    },
    mechanics: {
        type: [String],
        default: undefined
    },
    age: {
        type: Number,
        trim: true,
      },
    playtime: {
        type: String,
        trim: true,
    },
    complexity: {
        type: Number,
        trim: true,
      },
    id: {
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
