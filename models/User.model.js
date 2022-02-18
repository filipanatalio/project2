const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      // unique: true -> Ideally, should be unique, but its up to you
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
    },
    age: {
      type: Number,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    discord: {
      type: String,
      trim: true,
      lowercase: true,
    },
    gamesOwned: {
      type: [String],
    },
    gamesWant: {
      type: [String],
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
