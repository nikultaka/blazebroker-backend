const db = require("../models");
const Product = db.products;
const Op = db.Op;
const Checkout = db.checkouts;
const { Sequelize } = require("sequelize");
const config = require("../config/config.js");

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
  // Validate request
  const user_id = req.userId;
  console.log(user_id);
  if (!req.body.name) {
    res.status(400).send({
      message: "name can not be empty!"
    });
    return;
  }

  // Create a product
  const product = {
    seller_id : user_id, 
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


exports.findAll = (req, res) => {
  const title = req.query.name;
  let page = 0;
  let limit = 18;
  if(typeof req.query.page !=undefined && req.query.page!=null && req.query.page!='undefined') {
    page = req.query.page;
  }
  console.log("page:"+page);
  let offset = 0;
  if(page !=0) {
    offset = limit*page;
  }
  console.log(page);    
  var condition = title ? { name: { [Op.like]: `%${title}%` } } : null;

  Product.findAndCountAll({ where: condition,offset: offset, limit: limit, })
    .then(data => {
      //console.log(data);
      const response = {status: 1,data:data.rows,total:data.count}
      res.send(response);
    })
    .catch(err => {
      res.send({status:0,data:[]});
    });
};

exports.findAllSeller = (req, res) => {
  const title = req.query.name;
  const user_id = req.userId;
  let page = 0;
  let limit = 1800;
  if(typeof req.query.page !=undefined && req.query.page!=null && req.query.page!='undefined') {
    page = req.query.page;
  }
  console.log("page:"+page);
  let offset = 0;
  if(page !=0) {
    offset = limit*page;
  }
  console.log(page);    
  var condition = title ? { name: { [Op.like]: `%${title}%` }, seller_id:user_id } : {seller_id:user_id};

  Product.findAndCountAll({ where: condition,offset: offset, limit: limit, })
    .then(data => {
      //console.log(data);
      const response = {status: 1,data:data.rows,total:data.count}
      res.send(response);
    })
    .catch(err => {
      res.send({status:0,data:[]});
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



exports.orderlist = (req, res) => {
  const user_id = req.userId;
  var query  = 'select distinct c.id as order_id,p.* from  checkouts  as c inner join  items as i on i.checkout_id = c.id inner join  products as p on i.product_id = p.id where p.seller_id ='+user_id+' ';
  console.log(query);
  sequelize.query(query).then(function(rows) {
    res.json({ status : 1 ,data : rows});    
  });


};
