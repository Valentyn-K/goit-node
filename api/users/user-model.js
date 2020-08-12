const mongoose = require("mongoose");
const {
  Schema,
  Types: { ObjectId },
} = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free",
  },
  token: { type: String, required: false },
  contactsId: [{ type: ObjectId, ref: "Contact" }],
  verificationToken: { type: String, required: false },
  verificationStatus: {
    type: String,
    required: true,
    enum: ["Verified", "Created"],
    default: "Created",
  },
});
const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
