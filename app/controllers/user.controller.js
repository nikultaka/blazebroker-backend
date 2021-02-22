const db = require("../models");
const Checkout = db.checkouts;
const Item = db.items;
const Op = db.Op;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.checkout = (req, res) => {
  console.log(req.body);
    Checkout.create({
      email: req.body.email,
      mobile: req.body.mobile,
      subtotal: req.body.subtotal,
      total: req.body.total
    })
    .then(user => {
        res.send({ message: "checkout completed successfully!"});
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.item = (req, res) => {
  console.log(req.body);
    Item.create({
      checkout_id: req.body.checkout_id,
      product_id: req.body.product_id,
      qty: req.body.qty
    })
    .then(user => {
        res.send({ message: "Item completed successfully!"});
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
