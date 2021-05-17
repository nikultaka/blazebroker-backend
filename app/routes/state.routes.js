module.exports = app => {
  const state = require("../controllers/state.controller.js");

  const router = require("express").Router();


  router.post("/list", state.findAll); //,[authJwt.verifyToken]
  router.get("/:id", state.findByCountry); //,[authJwt.verifyToken]
  
  app.use("/api/state", router);
};
