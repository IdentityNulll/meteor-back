const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String },
  isAdmin: { type: Boolean, default: false },
});

// Pre-save hook to set default profilePic
userSchema.pre("save", function (next) {
  if (!this.profilePic && this.username) {
    this.profilePic = this.username.charAt(0).toUpperCase();
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
