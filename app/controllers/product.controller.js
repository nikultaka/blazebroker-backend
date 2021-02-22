const db = require("../models");
const Product = db.products;
const Op = db.Op;

// Create and Save a new Book
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "name can not be empty!"
    });
    return;
  }

  // Create a product
  const product = {
    name: req.body.name,
    sativa: req.body.sativa,
    thc: req.body.thc,
    description: req.body.description,
    image: req.body.image,
    price: req.body.price,
    stock: req.body.stock,
  };

  console.log(product)

  // Save product in database
  Product.create(product)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Product."
      });
    });
};

// Retrieve all Books from the database.
exports.findAll = (req, res) => {
  const title = req.query.name;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
  const userID = req.userId;

  Product.findAll({ where: condition })
    .then(data => {
      const response = {status: 1,data:data,userID:userID}
      res.send(response);
    })
    .catch(err => {
      res.send(500).send({
        message: err.message || "Some error accurred while retrieving products."
      });
    });
};

// Find a single Book with an id
exports.findOne = (req, res) => {
  const userID = req.userId;
  const id = req.params.id;

  Book.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: `Error retrieving Book with id = ${id}`
      });
    });
};

// Update a Book by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Product.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Product was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Product with id=${id}. Maybe Products was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Product with id=" + id
      });
    });
};

// Delete a Book with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Product.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Product was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Product with id=${id}. Maybe Product was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Product with id=" + id
      });
    });
};
