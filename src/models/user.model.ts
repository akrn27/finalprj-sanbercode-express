import mongoose from "mongoose";
import { encrypt } from "../utils/encryption";
import { SECRET } from "../utils/env";
import mail from '../utils/mail'

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: [
      {
        type: String,
        default: "user",
      },
    ],
    profilePicture: {
      type: String,
      default: "default.jpg",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;
  user.password = encrypt(SECRET, user.password);
  next();
});

userSchema.post("save", async function (doc, next) {
  const user = doc;

  // Send email
  console.log("Send Email to", user.email);

  const content = await mail.render('register-success.ejs', {
    username: user.username,
  })

  await mail.send({
    to: user.email,
    subject: "Registration Success",
    content
  })

  next();
})

userSchema.pre("updateOne", async function (next) {
  const user = (this as unknown as { _update: any })._update;
  user.password = encrypt(SECRET, user.password);
  next();
});

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const userModel = mongoose.model("User", userSchema);

export default userModel;
