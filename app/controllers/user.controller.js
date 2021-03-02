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
      total: req.body.total,
      transaction_id: req.body.transaction_id,
      transaction_response : req.body.transaction_response,
    })
    .then(checkout => {
        console.log("items length");
        console.log(req.body.items.length);
        if(req.body.items.length > 0) {
            for(var n=0; n<req.body.items.length; n++) {
              Item.create({
                checkout_id: checkout.id,
                product_id: req.body.items[n].product_id,
                qty: req.body.items[n].qty
              })
              .then(user => {
                
              })
              .catch(err => {
                res.send({ status : 0,message: "something went wrong"});
              });
            }
        }
        res.send({ status : 1,message: "checkout completed successfully!",id:checkout.id});
    })
    .catch(err => {
      res.send({ status : 0,message: "something went wrong"});
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
