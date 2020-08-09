const path = require("path");
const Avatar = require("avatar-builder");
const multer = require("multer");
const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");
const { promises: fsPromise } = require("fs");

//////////////////////////////////////////////////////////////////////////
exports.avatarGenerator = async (email) => {
  const gitHubAvatar = Avatar.githubBuilder(128);
  console.log("gitHubAvatar", gitHubAvatar);
  const avatarPath = path.join(__dirname, "../../tmp");
  console.log("avatarPath", avatarPath);
  const avatarName = Date.now() + ".png";
  console.log("avatarName", avatarName);
  const avatar = await gitHubAvatar.create(email);
  console.log("avatar", avatar);
  await fsPromise.writeFile(avatarPath + "/" + avatarName, avatar);

  return `http://localhost:${process.env.PORT}/images/${avatarName}`;
};
////////////////////////////////////////////////////////////////////////
const storage = multer.diskStorage({
  destination: "public/images",
  filename: function (req, file, cb) {
    const extention = path.parse(file.originalname).ext;
    cb(null, Date.now() + extention);
  },
});
exports.upload = multer({ storage });

///////////////////////////////////////////////////////////////////////////
exports.minifyImage = async (imagePath) => {
  const MINIFIED_DIR = "public/images";
  console.log("imagePath", imagePath);
  const res = await imagemin([imagePath], {
    destination: MINIFIED_DIR,
    plugins: [
      imageminJpegtran(),
      imageminPngquant({
        quality: [0.6, 0.8],
      }),
    ],
  });
  console.log("res", res);
  return await fsPromise.unlink(imagePath);
};
