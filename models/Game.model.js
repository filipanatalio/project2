const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const gameSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      // unique: true -> Ideally, should be unique, but its up to you
    },
    description: {
      type: String,
      trim: true,
    },
    numberOfPlayers: {
      type: String,
      required: true,
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
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Game = model("Game", gameSchema);

module.exports = Game;
