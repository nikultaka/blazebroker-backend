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
      res.send({status: 1,data:data});
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Product."
      });
    });
};

// Retrieve all Books from the database.
exports.findAll = (req, res) => {
  console.log("test 123");
  const title = req.query.name;
  console.log(title);
  var condition = title ? { name: { [Op.like]: `%${title}%` } } : null;

  Product.findAll({ where: condition })
    .then(data => {
      const response = {status: 1,data:data}
      res.send(response);
    })
    .catch(err => {
      res.send(500).send({
        message: err.message || "Some error accurred while retrieving products."
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Product.findByPk(id)
    .then(data => {
      res.send({status:1,data:data});
    })
    .catch(err => {
        res.send({status:0,data:[]});
    });
};


exports.update = (req, res) => {
  const id = req.params.id;

  Product.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          status : 1,
          message: "Product was updated successfully."
        });
      } else {
        res.send({
          status : 0,
          message: `Cannot update Product with id=${id}. Maybe Products was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.send({
        status : 0,
        message: "Error updating Product with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Product.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          status : 1,
          message: "Product was deleted successfully!"
        });
      } else {
        res.send({
          status : 0,
          message: `Cannot delete Product with id=${id}. Maybe Product was not found!`
        });
      }
    })
    .catch(err => {
      res.send({
        status : 0,
        message: "Could not delete Product with id=" + id
      });
    });
};


exports.uploadimage = (req, res) => {
  
  const id = req.body.id;
  let filename = req.files.productimage.name;
  filename = filename.split(" ").join("_");
  req.files.productimage.mv('./uploads/product/'+filename, function(err, result) {
      if(err) 
        throw err;

      Product.update({
        image: filename
      },{where: { id: id }})        
      res.send({
        status : 1,  
        message: "image uploaded successfully!"
      });

   });
  
};
