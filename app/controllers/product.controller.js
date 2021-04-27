const db = require("../models");
const Product = db.products;
const Item = db.items;
const Op = db.Op;
const Checkout = db.checkouts;
const { Sequelize } = require("sequelize");
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
    remaining_stock: req.body.stock,

  };

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
  
  let offset = 0;
  if(page !=0) {
    offset = limit*page;
  }
  
  var condition = title ? { name: { [Op.like]: `%${title}%` } , status : 1 } : {status:1};

  //Product.findAndCountAll({ where: condition,offset: offset, limit: limit, })
  Product.findAndCountAll({ where: condition })
    .then(data => {
      
      const response = {status: 1,data:data.rows,total:data.count}
      res.send(response);
    })
    .catch(err => {
      res.send({status:0,data:[]});
    });
};
exports.getAll = async (req, res)=>{
  var query  = 'select p.*,u.name as seller_name,u.company_name as company_name from  products  as p left join  users as u on p.seller_id = u.id ';
  
  await sequelize.query(query,{ type: sequelize.QueryTypes.SELECT}).then(function(rows) {
    res.json({ status : 1 ,data : rows});    
  }).catch(err => {
    res.send({status:0,data:[]});
  });

}
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



exports.orderlist = async (req, res) => {
  const user_id = req.userId;
  var query  = 'select distinct c.id as order_id,i.id as item_id,i.qty as qty,i.created_at as order_date,i.is_confirm as is_confirm,p.* from  checkouts  as c inner join  items as i on i.checkout_id = c.id inner join  products as p on i.product_id = p.id where p.seller_id ='+user_id+' ';
  
  await sequelize.query(query,{ type: sequelize.QueryTypes.SELECT}).then(function(rows) {
    res.json({ status : 1 ,data : rows});    
  });
};


exports.orderconfirm = (req, res) => {
  const id = req.body.id;
  Item.update({is_confirm:1}, {
    where: { id: id}
  })
    .then(num => {
      if (num == 1) {
        const product_id =  req.body.product_id;
        const remaining_stock =  req.body.remaining_stock;
        Product.update({
          remaining_stock: remaining_stock
        }, {
          where: { id: product_id }
        })
          .then(num => {
            if (num == 1) {
              res.send({
                status : 1,
                message: "Order confirmed successfully."
              });
            }
          }).catch(err => {
            res.send({
              status : 0,
              message: "Error updating order with id=" + id
            });
          });
        
      } else {
        res.send({
          status : 0,
          message: `Cannot update order`
        });
      }
    })
    .catch(err => {
      res.send({
        status : 0,
        message: "Error updating order with id=" + id
      });
    });
};
exports.mailorderconfirm = async(req, res) => {
  const id = req.body.id;
  
 await Item.findByPk(id)
    .then(async productdata => {
      if(productdata.is_confirm == 1){
        res.send({
          status : 0,
          message: "Order already approved.!"
        });
      }
       await Product.findByPk(productdata.product_id)
        .then(async data => {
          
        await  Item.update({is_confirm:1}, {
            where: { id: id}
          })
            .then(async num => {
              if (num == 1) {
                const product_id =  productdata.product_id;
                const remaining_stock =  (data.remaining_stock - productdata.qty);
               await Product.update({
                  remaining_stock: remaining_stock
                }, {
                  where: { id: product_id }
                })
                  .then(num => {
                    if (num == 1) {
                      res.send({
                        status : 1,
                        message: "Order confirmed successfully."
                      });
                    }
                  }).catch(err => {
                    res.send({
                      status : 0,
                      message: "Error updating order with id=" + id
                    });
                  });
                
              } else {
                res.send({
                  status : 0,
                  message: `Cannot update order`
                });
              }
            })
            .catch(err => {
              res.send({
                status : 0,
                message: "Error updating order with id=" + id
              });
            });

          //res.send({status:1,data:data,qty:productdata.qty});
        })
        .catch(err => {
          res.send({
            status : 0,
            message: `Cannot update order`
          });
        });
    })
    .catch(err => {
      res.send({
        status : 0,
        message: `Cannot update order`
      });
    });

};
exports.changestatus = (req, res) => {
  const usertoken = req.headers["x-access-token"] || req.headers["Authorization"];
 const decoded = jwt.verify(usertoken, config.auth.secret);
  if(decoded.roles != config.role.admin){
    res.send({
      status : 0,
      message: 'You haven`t permission to access.!'
    });
  }
  const productsID = req.body.id;
  Product.update({
    status: req.body.status,
  },{where: { id: productsID }})
    .then(user => {
        res.send({ status : 1,message: "Status updated successfully!" });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.allorderlist = async (req, res) => {
  const usertoken = req.headers["x-access-token"] || req.headers["Authorization"];
 const decoded = jwt.verify(usertoken, config.auth.secret);
  if(decoded.roles != config.role.admin){
    res.send({
      status : 0,
      message: 'You haven`t permission to access.!',
      data : []
    });
  }
  var query  = 'select distinct c.id as order_id,u.name as seller_name,i.id as item_id,i.qty as qty,i.is_confirm as is_confirm,p.* from  checkouts  as c inner join  items as i on i.checkout_id = c.id inner join  products as p on i.product_id = p.id  left join users as u on u.id = p.seller_id';
  
  await sequelize.query(query,{ type: sequelize.QueryTypes.SELECT}).then(function(rows) {
    res.json({ status : 1 ,data : rows});    
  });
};