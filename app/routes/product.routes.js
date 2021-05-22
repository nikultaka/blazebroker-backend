const { authJwt } = require("../middlewares");
module.exports = app => {
  const productController = require("../controllers/product.controller.js");

  const router = require("express").Router();

/********* Admin Section API */
  router.put("/changestatus",[authJwt.verifyToken],productController.changestatus);
  router.get("/allorderlist", [authJwt.verifyToken], productController.allorderlist);
/*********End Admin Section API */

  router.post("/",[authJwt.verifyToken], productController.create);

  router.get("/", productController.findAll); //,[authJwt.verifyToken]
  router.get("/all", productController.getAll); //,[authJwt.verifyToken]
  router.get("/seller",[authJwt.verifyToken], productController.findAllSeller); //

  router.get("/orderlist", [authJwt.verifyToken], productController.orderlist);
  router.post("/orderconfirm", [authJwt.verifyToken], productController.orderconfirm);
  router.post("/importproduct", [authJwt.verifyToken], productController.importproduct); //
  router.post("/mailorderconfirm", productController.mailorderconfirm);
  

  //router.get("/:name", productController.search);

  router.get("/:id", productController.findOne); //,[authJwt.verifyToken]

  router.put("/:id",[authJwt.verifyToken], productController.update);

  router.delete("/:id",[authJwt.verifyToken], productController.delete);

  router.post("/image",[authJwt.verifyToken], productController.uploadimage);

  app.use("/api/products", router);
};
