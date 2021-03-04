const { authJwt } = require("../middlewares");
module.exports = app => {
  const productController = require("../controllers/product.controller.js");

  const router = require("express").Router();

  router.post("/",[authJwt.verifyToken], productController.create);

  router.get("/", productController.findAll); //,[authJwt.verifyToken]
  router.get("/seller",[authJwt.verifyToken], productController.findAllSeller); //

  router.get("/orderlist", [authJwt.verifyToken], productController.orderlist);
  router.post("/orderconfirm", [authJwt.verifyToken], productController.orderconfirm);
  

  //router.get("/:name", productController.search);

  router.get("/:id", productController.findOne); //,[authJwt.verifyToken]

  router.put("/:id",[authJwt.verifyToken], productController.update);

  router.delete("/:id",[authJwt.verifyToken], productController.delete);

  router.post("/image",[authJwt.verifyToken], productController.uploadimage);

  app.use("/api/products", router);
};
