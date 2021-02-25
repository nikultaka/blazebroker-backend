const config = require("../config/config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../models");
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' })
const User = db.user;
const Role = db.role;
const Op = db.Op;
const nodemailer = require("nodemailer");


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
  
  let info = await transporter.sendMail({
    from: '"Nikul Panchal 👻" <palladiumhub17@gmail.com>', 
    to: email, 
    subject: subject, 
    text: text, 
    html: text, 
  });
  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

exports.signup = async(req, res) => {
  // Save user to database
  User.create({
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
            sendemail(req.body.email,"Welcome Blazebroker","You have successfully registered");
            res.send({ status: 1,message: "User was registered successfully!" });
          });
        });
      } else {
        // User role 1
        user.setRoles([1]).then(() => {
          sendemail(req.body.email,"Welcome Blazebroker","You have successfully registered");
          res.send({ status: 1,message: "User was registered successfully!" });
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
        return res.status(404).send({ status: 0,message: "User Not found." });
      }

      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          status: 0,
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
          status: 1,
          id: user.id,
          username: user.username,
          name: user.name,
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
exports.user = (req,res) => {
  const id = req.userId;
  

  User.findByPk(id)
    .then(data => {
      res.send({status:1,data:data});
    })
    .catch(err => {
        res.send({status:0,data:[]});
    });
}
exports.uploaddocument = (req, res) => {
  
  const email = req.body.email;
  let filename = req.files.signupdocument.name;
  filename = filename.split(" ").join("_");
  req.files.signupdocument.mv('./uploads/'+filename, function(err, result) {
      if(err) 
        throw err;
      User.update({
        document: filename
      },{where: { email: email }})
      res.send({
        status : 1,  
        success: true,
        message: "document uploaded successfully!"
      });
   });
  
};


exports.forgotpassword = (req, res) => {
  const email = req.body.email;
  User.findOne({
    where: {
      email: email
    }
  }).then(user => {
      if(user) {
        const encodedEmail = Buffer.from(email).toString('base64');
        sendemail(req.body.email,"Forgot Password - Blazebroker","Please click <a href='http://localhost/resetpassword/?id="+encodedEmail+"'>here</a> to reset password");
        res.send({ status : 1,message: "Reset password link sent successfully!"});
      } else {
        res.send({ status : 0,message: "Email not found"});
      }
  });

  
};