const config = require("../config/config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../models");
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' })
const User = db.user;
const Role = db.role;
const Op = db.Op;

exports.signup = (req, res) => {
  // Save user to database

  console.log(req.body);

  User.create({
    //username: req.body.username,
    email: req.body.email,
    name: req.body.name,
    contact: req.body.contact,
    title: req.body.title,
    zip: req.body.zip,
    company_name: req.body.company_name,
    document: req.body.document,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User was registered successfully!" });
          });
        });
      } else {
        // User role 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User was registered successfully!" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      let token = jwt.sign({ id: user.id }, config.auth.secret, {
        expiresIn: 86400 // 24 hours
      });

      let authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }

        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};


exports.resetpassword = (req, res) => {
  // Save user to database
  console.log(req.body);
  const userID = req.userId;
  User.update({
    password: bcrypt.hashSync(req.body.password, 8)
  },{where: { id: userID }})
    .then(user => {
        res.send({ message: "password reset successfully!",userID:userID });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.basicupdate = (req, res) => {
  // Save user to database
  console.log(req.body);
  const userID = req.userId;
  User.update({
    name: req.body.name,
    contact: req.body.contact,
    shop_name: req.body.shop_name,
    phone: req.body.phone,
    address: req.body.address,
    province: req.body.province,
    city: req.body.city,
    area: req.body.area,
  },{where: { id: userID }})
    .then(user => {
        res.send({ message: "basic information updated successfully!",userID:userID });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};