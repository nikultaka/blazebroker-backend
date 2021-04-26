const db = require("../models");
const Checkout = db.checkouts;
const Item = db.items;
const Op = db.Op;
const { Sequelize } = require("sequelize");
const config = require("../config/config.js");
const nodemailer = require("nodemailer");

const sequelize = new Sequelize(
  config.db.DB_NAME,
  config.db.DB_USER,
  config.db.DB_PASS,
  {
    host: config.db.DB_HOST,
    dialect: config.db.dialect,
    operatorsAliases: false,

    poll: {
      max: config.db.pool.max,
      min: config.db.pool.min,
      acquire: config.db.pool.acquire,
      idle: config.db.pool.idle
    }
  }
);

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
async function sendemail(email,subject,text) {
  console.log("sendmail");
  let transporter = await nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'palladiumhub17@gmail.com', 
      pass: 'Admin@123',
    },
  });

  console.log("transporter");
  console.log(email);
  console.log(subject);
  console.log(text);
  
  let info = await transporter.sendMail({
    from: '"Nikul Panchal 👻" <palladiumhub17@gmail.com>', 
    to: email, 
    subject: subject, 
    text: text, 
    html: text, 
  });
  console.log(info);
  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
exports.checkout = async (req, res) => {
  console.log(req.body);
    Checkout.create({
      email: req.body.email,
      mobile: req.body.mobile,
      subtotal: req.body.subtotal,
      total: req.body.total,
      transaction_id: req.body.transaction_id,
      transaction_response : req.body.transaction_response,
    })
    .then(async checkout => {
          var string = "<p>Hi </p>";
          string += "<p>We will send your Order details to Seller. Once seller approved details your order will confirm. </p>";
          
        await sendemail(req.body.email,"Thanks Order",string);
        if(req.body.items.length > 0) {
            for(var n=0; n<req.body.items.length; n++) {
              var productID  = req.body.items[n].product_id;
              Item.create({
                checkout_id: checkout.id,
                product_id: req.body.items[n].product_id,
                qty: req.body.items[n].qty
              })
              .then(async item => {
                
                //console.log(user);
                //console.log(productID);
                var query  = 'SELECT products.*,users.email FROM `products` left join users on users.id = products.seller_id where products.id = '+productID;
                
                await sequelize.query(query,{ type: sequelize.QueryTypes.SELECT}).then(async function(rows) {
                  if(rows[0]){
                    var order_string = "<p>Product Name  : " + rows[0].name + "</p>";
                      order_string += "<p>Stock : " + rows[0].remaining_stock + "</p>";
                      order_string += "<p>User Email : " + req.body.email + "</p>";
                      order_string += "<p>User Mobile : " + req.body.mobile + "</p>";
                      order_string += "<p>Transation Id : " + req.body.transaction_id + "</p>";
                      order_string += "<p><a href='"+config.SITE_URL+"/order-confirm/"+item.id+"'>confirm Order</a></p>";

                    await sendemail(rows[0].email,"New Order",order_string);
                  }
                  
                });
              })
              .catch(err => {
                res.send({ status : 0,message: "something went wrong"});
              });
            }
        }
        res.send({ status : 1,message: "checkout completed successfully!",id:checkout.id});
    }).bind(productID)
    .catch(err => {
      console.log("err");
      console.log(err);
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
