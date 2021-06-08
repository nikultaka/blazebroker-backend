const db = require("../models");
const ProductType = db.product_type;
const { Sequelize,Op  } = require("sequelize");
const config = require("../config/config.js");
const jwt = require("jsonwebtoken");
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

// Create and Save a new Book
exports.create = (req, res) => {
  const usertoken = req.headers["x-access-token"] || req.headers["Authorization"];
 const decoded = jwt.verify(usertoken, config.auth.secret);
  if(decoded.roles != config.role.admin){
    res.send({
      status : 0,
      message: 'You haven`t permission to access.!',
      data : []
    });
  }
  
  // Save product in database
  ProductType.create(req.body)
    .then(data => {
      res.send({status: 1,data:data,insertId : data.id});
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Product."
      });
    });
};


exports.findAll = async(req, res) => {
  
  
  ProductType.findAll()
    .then(data => {
      res.send({status:1,data:data});
    })
    .catch(err => {
      res.send({status:0,data:[]});
    });
  
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  ProductType.findByPk(id)
    .then(data => {
      res.send({status:1,data:data});
    })
    .catch(err => {
        res.send({status:0,data:[]});
    });
};


exports.update = (req, res) => {
  const usertoken = req.headers["x-access-token"] || req.headers["Authorization"];
 const decoded = jwt.verify(usertoken, config.auth.secret);
  if(decoded.roles != config.role.admin){
    res.send({
      status : 0,
      message: 'You haven`t permission to access.!',
      data : []
    });
  }
  const id = req.params.id;

  ProductType.update(req.body, {
      where: { id: id }
    })
      .then(num => {
      if (num == 1) {
        res.send({
          status : 1,
          message: "Product type was updated successfully."
        });
      } else {
        res.send({
          status : 0,
          message: `Cannot update Product type with id=${id}. Maybe Products type was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.send({
        status : 0,
        message: "Error updating Product type with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const usertoken = req.headers["x-access-token"] || req.headers["Authorization"];
 const decoded = jwt.verify(usertoken, config.auth.secret);
  if(decoded.roles != config.role.admin){
    res.send({
      status : 0,
      message: 'You haven`t permission to access.!',
      data : []
    });
  }
  const id = req.params.id;

  ProductType.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          status : 1,
          message: "Product type was deleted successfully!"
        });
      } else {
        res.send({
          status : 0,
          message: `Cannot delete Product type with id=${id}. Maybe Product type was not found!`
        });
      }
    })
    .catch(err => {
      res.send({
        status : 0,
        message: "Could not delete Product type with id=" + id
      });
    });
};
