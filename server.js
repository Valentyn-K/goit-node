const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const contactRouter = require("./api/contacts/contacts-routs.js");

module.exports = class Server {
  constructor() {
    this.server = null;
  }

  start() {
    this.initServer();
    this.initMiddleware();
    this.initRouts();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddleware() {
    this.server.use(express.json());
    this.server.use(cors({ origin: "http://localhost:3000" }));
    this.server.use(morgan());
    // this.server.use((err, req, res, next) => {
    //   delete err.stack;
    //   next(err);
    // });
  }

  initRouts() {
    this.server.use("/api/contacts", contactRouter);
  }

  startListening() {
    this.server.listen(process.env.PORT, () => {
      console.log("Server started listening port", process.env.PORT);
    });
  }
};
