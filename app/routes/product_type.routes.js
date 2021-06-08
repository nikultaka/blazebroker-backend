const { authJwt } = require("../middlewares");
module.exports = app => {
  const productTypeController = require("../controllers/product_type.controller.js");

  const router = require("express").Router();

  router.get("/list", productTypeController.findAllforAdmin); //,[authJwt.verifyToken]
  router.get("/", productTypeController.findAll); //,[authJwt.verifyToken]
  router.post("/",[authJwt.verifyToken], productTypeController.create);
  
  router.get("/:id", productTypeController.findOne); //,[authJwt.verifyToken]
  

  router.put("/:id",[authJwt.verifyToken], productTypeController.update);

  router.delete("/:id",[authJwt.verifyToken], productTypeController.delete);

  app.use("/api/product_type", router);
};
