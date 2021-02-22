const { authJwt } = require("../middlewares");
module.exports = app => {
  const productController = require("../controllers/product.controller.js");

  const router = require("express").Router();

  router.post("/",[authJwt.verifyToken], productController.create);

  router.get("/",[authJwt.verifyToken], productController.findAll);

  router.get("/:id",[authJwt.verifyToken], productController.findOne);

  router.put("/:id",[authJwt.verifyToken], productController.update);

  router.delete("/:id",[authJwt.verifyToken], productController.delete);

  app.use("/api/products", router);
};
