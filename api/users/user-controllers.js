require("dotenv").config();
const sgMail = require("@sendgrid/mail");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
// var sgMail = require("sendgrid");

const uuid = require("uuid");

const userModel = require("./user-model.js");
const contactModel = require("../contacts/contact.model.js");
const { prepareUserResponse } = require("../helpers/prepareUserResponse.js");
const { findByIdAndUpdate, findOne } = require("./user-model.js");

const createVarificationToken = (userId, varificationToken) => {
  return userModel.findByIdAndUpdate(
    userId,
    { varificationToken },
    { new: true }
  );
};

const sendVarificationEmail = async (newUser) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log("process.env.SENDGRID_API_KEY", process.env.SENDGRID_API_KEY);
  const verificationToken = uuid.v4();
  await createVarificationToken(newUser._id, verificationToken);
  await sgMail.send({
    to: newUser.email,
    from: "valentyn.k.911@gmail.com",
    subject: "Sending with Twilio SendGrid is Fun",
    text: "and easy to do anywhere, even with Node.js",
    html: `<a href="http://localhost:3000/user/auth/verify/${verificationToken}">Verify registration</a>`,
  });
};

const verifiEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const userToVerify = await userModel.findOne({ verificationToken });
    if (!userToVerify) {
      res.status(404).send("Not found");
    }
    await userModel.findByIdAndUpdate(
      userToVerify._id,
      { status: "Verified", varificationToken: null },
      { new: true }
    );
    res.status(200).send("You are successfully verified");
  } catch (error) {
    next(error);
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { email, subscription, password } = req.body;
    const costFactor = 8;
    const hashedPassword = await bcryptjs.hash(password, costFactor);
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "Email in use",
      });
    }
    const newUser = await userModel.create({
      email,
      subscription,
      password: hashedPassword,
    });

    await sendVarificationEmail(newUser);

    return res.status(200).json(prepareUserResponse([newUser]));
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password, status } = req.body;

    const findedUser = await userModel.findOne({ email });

    const isPasswordValid = await bcryptjs.compare(
      password,
      findedUser.password
    );

    if (!findedUser || !isPasswordValid || status !== "Verified") {
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
  verifiEmail,
};
