const authRouter = require("./Auth");

const setupRoutes = (app) => {
  app.use("/auth", authRouter);
};

module.exports = { setupRoutes };
