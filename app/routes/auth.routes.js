const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");
const { authJwt } = require("../middlewares");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );

    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);
  app.post("/api/auth/resetpassword",[authJwt.verifyToken],controller.resetpassword);
  app.post("/api/auth/basicupdate",[authJwt.verifyToken],controller.basicupdate);
  app.get("/api/auth/user",[authJwt.verifyToken],controller.user);
  app.post("/api/auth/uploaddocument",controller.uploaddocument);
  app.post("/api/auth/forgotpassword",controller.forgotpassword);
  
};
