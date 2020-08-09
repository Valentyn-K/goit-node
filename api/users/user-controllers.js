const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// const imagemin = require("imagemin");
// const imageminJpegtran = require("imagemin-jpegtran");
// const imageminPngquant = require("imagemin-pngquant");

const userModel = require("./user-model.js");
const contactModel = require("../contacts/contact.model.js");
const { prepareUserResponse } = require("../helpers/prepareUserResponse.js");
const { avatarGenerator, minifyImage } = require("./user-avatars.js");

const registerUser = async (req, res, next) => {
  try {
    const { email, subscription, password, avatarURL } = req.body;
    const costFactor = 8;
    const hashedPassword = await bcryptjs.hash(password, costFactor);
    const existingUser = await userModel.findOne({ email });
    const generatedAvatarURL = await avatarGenerator(req.body.email);

    if (existingUser) {
      return res.status(409).json({
        message: "Email in use",
      });
    }
    const newUser = await userModel.create({
      email,
      subscription,
      password: hashedPassword,
      avatarURL: generatedAvatarURL,
    });

    return res.status(200).json(prepareUserResponse([newUser]));
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    // const img = await minifyImage(req.file.path);
    // console.log("img", img);
    console.log("req.file.path", req.file.path);
    const path = `http://localhost:${process.env.PORT}/images/${req.file.filename}`;
    console.log("path", path);
    const authorizationHeader = req.get("Authorization") || "";
    const token = authorizationHeader.replace("Bearer ", "");
    const userId = await jwt.verify(token, process.env.JWT_SECRET).id;
    await userModel.findByIdAndUpdate(userId, { $set: { avatarURL: path } });

    res.status(200).send({ avatarURL: path });
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const findedUser = await userModel.findOne({ email });

    const isPasswordValid = await bcryptjs.compare(
      password,
      findedUser.password
    );

    if (!findedUser || !isPasswordValid) {
      return res.status(201).send("Email or password is wrong");
    }

    const token = jwt.sign({ id: findedUser._id }, process.env.JWT_SECRET, {
      expiresIn: 2 * 24 * 60 * 60,
    });

    await userModel.findByIdAndUpdate(findedUser._id, { token });

    return res.status(200).json(prepareUserResponse([findedUser]));
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    const user = req.user;

    await userModel.findByIdAndUpdate(user._id, { token: null });

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const checkToken = async (req, res, next) => {
  try {
    const authorizationHeader = req.get("Authorization") || "";

    const token = authorizationHeader.replace("Bearer ", "");

    const userId = await jwt.verify(token, process.env.JWT_SECRET).id;

    const user = await userModel.findById(userId);

    if (!user || !user.token) {
      return res.status(401).send({
        message: "Not authorized",
      });
    }
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  console.log("req", req);
  const userForResponse = await prepareUserResponse([req.user]);
  if (!userForResponse) {
    return res.status(401).send({
      message: "Not authorized",
    });
  }
  return res.status(200).json(userForResponse);
};

const updateSubscription = async (req, res, next) => {
  try {
    console.log("req.body", req.body);
    const updatedUser = await userModel.findByIdAndUpdate(
      req.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const addContactForUser = async (req, res, next) => {
  try {
    const contsctId = req.params.id;
    console.log("req.params.id", req.params.id);
    const contact = await contactModel.findById(contsctId);

    if (!contact) {
      return res.status(404).send("Film does not exist!");
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { contactId: contsctId },
      },
      { new: true }
    );

    const [updatedUserForResponse] = prepareUsersResponse([updatedUser]);

    return res.status(200).json(updatedUserForResponse);
    next();
  } catch (error) {
    next(error);
  }
};

const deleteContactForUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedUser = await userModel
      .findByIdAndUpdate(
        req.user._id,
        {
          contacts: { $pull: { _id: req.body.id } },
        },
        { new: true }
      )
      .populate("contsctId");
    return res.status(200).json(prepareUsersResponse(updatedUser));
  } catch (error) {
    next(error);
  }
};
module.exports = {
  registerUser,
  loginUser,
  checkToken,
  logoutUser,
  getCurrentUser,
  updateSubscription,
  addContactForUser,
  deleteContactForUser,
  updateAvatar,
};
