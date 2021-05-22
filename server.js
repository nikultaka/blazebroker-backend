const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./app/config/config.js");
const fileupload = require('express-fileupload');
const cart_item = require("./app/controllers/cart_item.controller.js");
const app = express();
var cron = require('node-cron');


const corsOptions = {
  origin: "http://192.163.31.3"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(fileupload());

app.use(express.static(__dirname + '/uploads'));
//app.use(express.static(__dirname + '/uploads/product'));

// database
const db = require("./app/models");
const Role = db.role;
const Country = db.country;
const State = db.state;
db.sequelize.sync().then(() => {
  initial(); // Just use it in development, at the first time execution!. Delete it in production
});

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Hi there, welcome to this tutorial." });
});

// api routes
require("./app/routes/book.routes")(app);
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/product.routes")(app);
require("./app/routes/cart_item.routes")(app);
require("./app/routes/state.routes")(app);



// set port, listen for requests
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Just use it in development, at the first time execution!. Delete it in production
function initial() {
  Role.create({
    id: 1,
    name: "user"
  });

  Role.create({
    id: 2,
    name: "moderator"
  });

  Role.create({
    id: 3,
    name: "admin"
  });
  Country.create({
    id: 1,
    name: "USA"
  });
  State.create({
    id:1,
    country_id:1,
    code:'AK',
    name : "Alaska"
  });
  State.create({
    id:2,
    country_id:1,
    code:'AZ',
    name : "Arizona"
  });
  State.create({
    id:3,
    country_id:1,
    code:'CA',
    name : "California"
  });
  State.create({
    id:4,
    country_id:1,
    code:'CO',
    name : "Colorado"
  });
  State.create({
    id:5,
    country_id:1,
    code:'IL',
    name : "Illinois"
  });
  State.create({
    id:6,
    country_id:1,
    code:'MA',
    name : "Massachusetts"
  });
  State.create({
    id:7,
    country_id:1,
    code:'ME',
    name : "Maine"
  });
  State.create({
    id:8,
    country_id:1,
    code:'MI',
    name : "Michigan"
  });
  State.create({
    id:9,
    country_id:1,
    code:'MT',
    name : "Montana"
  });

  State.create({
    id:10,
    country_id:1,
    code:'NJ',
    name : "New Jersey"
  });
  State.create({
    id:11,
    country_id:1,
    code:'NM',
    name : "New Mexico"
  });
  State.create({
    id:12,
    country_id:1,
    code:'NV',
    name : "Nevada"
  });
  State.create({
    id:13,
    country_id:1,
    code:'NY',
    name : "New York"
  });
  State.create({
    id:14,
    country_id:1,
    code:'OR',
    name : "Oregon"
  });
  State.create({
    id:15,
    country_id:1,
    code:'VA',
    name : "Virginia"
  });
  State.create({
    id:16,
    country_id:1,
    code:'VT',
    name : "Vermont"
  });
  State.create({
    id:17,
    country_id:1,
    code:'WA',
    name : "Washington"
  });
  
}

cron.schedule('*/2 * * * *', () => {
  cart_item.cartCron();
})
