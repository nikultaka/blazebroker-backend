const db = require("../models");
const Product = db.products;
const Item = db.items;
const CartItem = db.cart_items;
const Op = db.Op;
const Checkout = db.checkouts;
const ProductType = db.product_type;
const sharp = require('sharp');
const uuid  = require('uuid'); 
const { Sequelize } = require("sequelize");
const config = require("../config/config.js");
const jwt = require("jsonwebtoken");
const csv = require('csv-parser');
var fs = require('fs');
const { Console } = require("console");
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
    product_type : req.body.product_type,
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


exports.findAll = async(req, res) => {
  sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


  const title = req.query.name;

var condition_string = '';
  var query  = 'select p.*,u.name as seller_name,u.company_name as company_name from  products  as p left join  users as u on p.seller_id = u.id where u.status= 1 AND p.status = 1';
  if(title != ''){
    condition_string = " AND (p.name LIKE '"+`%${title}%`+"'";
    condition_string += " OR p.description LIKE '"+`%${title}%`+"')";
  }

  //console.log(condition_string);
  
  //query.concat(condition_string);

  query+=condition_string;

  console.log(query);

  await sequelize.query(query,{ type: sequelize.QueryTypes.SELECT}).then(function(rows) {
    res.json({ status : 1 ,data : rows ,total:rows.count});    
  }).catch(err => {
    res.send({status:0,data:[]});
  });

  // let page = 0;
  // let limit = 18;
  // if(typeof req.query.page !=undefined && req.query.page!=null && req.query.page!='undefined') {
  //   page = req.query.page;
  // }
  
  // let offset = 0;
  // if(page !=0) {
  //   offset = limit*page;
  // }
  
  // var condition = title ? { name: { [Op.like]: `%${title}%` } , status : 1 } : {status:1};

  // //Product.findAndCountAll({ where: condition,offset: offset, limit: limit, })
  // Product.findAndCountAll({ where: condition })
  //   .then(data => {
      
  //     const response = {status: 1,data:data.rows,total:data.count}
  //     res.send(response);
  //   })
  //   .catch(err => {
  //     res.send({status:0,data:[]});
  //   });
};
exports.getAll = async (req, res)=>{
  //var query  = 'select p.*,u.name as seller_name,u.company_name as company_name from  products  as p left join  users as u on p.seller_id = u.id ';
  var query  = 'select p.*,u.name as seller_name,u.company_name as company_name,IF(sum(CONCAT(ci.qty)) IS NOT null , sum(CONCAT(ci.qty)),0) as total_product_in_cart from  products  as p   left join  users as u on p.seller_id = u.id   left JOIN cart_items as ci on ci.product_id = p.id  GROUP by p.id';
  
  await sequelize.query(query,{ type: sequelize.QueryTypes.SELECT}).then(function(rows) {
    res.json({ status : 1 ,data : rows});    
  }).catch(err => {
    res.send({status:0,data:[]});
  });

}
exports.findAllSeller = async(req, res) => {
  const title = req.query.name;
  const user_id = req.userId;

  var query  = 'SELECT p.*,IF(sum(CONCAT(ci.qty)) IS NOT null , sum(CONCAT(ci.qty)),0) as total_product_in_cart FROM `products` as p left JOIN cart_items as ci on ci.product_id = p.id  where p.seller_id = '+user_id+'  GROUP by p.id';
  
  
  await sequelize.query(query,{ type: sequelize.QueryTypes.SELECT}).then(function(rows) {
    res.json({ status : 1 ,data : rows ,total:rows.count});    
  }).catch(err => {
    res.send({status:0,data:[]});
  });

  
  // let page = 0;
  // let limit = 1800;
  // if(typeof req.query.page !=undefined && req.query.page!=null && req.query.page!='undefined') {
  //   page = req.query.page;
  // }
  // console.log("page:"+page);
  // let offset = 0;
  // if(page !=0) {
  //   offset = limit*page;
  // }
  // console.log(page);    
  // var condition = title ? { name: { [Op.like]: `%${title}%` }, seller_id:user_id } : {seller_id:user_id};

  // Product.findAndCountAll({ where: condition,offset: offset, limit: limit, })
  //   .then(data => {
  //     //console.log(data);
  //     const response = {status: 1,data:data.rows,total:data.count}
  //     res.send(response);
  //   })
  //   .catch(err => {
  //     res.send({status:0,data:[]});
  //   });
};


exports.findOne = (req, res) => {
  const id = req.params.id;

  Product.findByPk(id)
    .then(async data => {
      
      var query  = 'select SUM(ci.qty) as pending_qty from cart_items  as ci where ci.product_id = '+data.id+' LIMIT 1';
 
        await sequelize.query(query,{ type: sequelize.QueryTypes.SELECT}).then(function([rows]) {
          data.remaining_stock = (data.remaining_stock - rows.pending_qty);
          res.json({ status : 1 ,data : data });    
        }).catch(err => {
          res.send({status:0,data:[]});
        });

      //res.send({status:1,data:data});
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
  var filename = uuid.v1()+'.jpg';
  //let filename = req.files.productimage.name;
  //filename = filename.split(" ").join("_");
  
  req.files.productimage.mv('./uploads/product/'+filename, function(err, result) {
      if(err) 
        throw err;

    sharp('./uploads/product/'+filename).resize({ height:100, width:100}).toFile('./uploads/product/resize/'+filename)
    .then(function(newFileInfo){
      Product.update({
        image: filename
      },{where: { id: id }})        
      res.send({
        status : 1,  
        message: "image uploaded successfully!"
      });

    })
    .catch(function(err){
      res.send({
        status : 1,  
        message: "image uploaded Fail.!"
      });

    });
    
   });
  
};

exports.importproduct = async (req, res) => {
  
  const user_id = req.userId;
  
  var filename = uuid.v1()+'.csv';
  var dir = './uploads/product_import/'+user_id;

  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  }
  var finaldata=[];
  await req.files.productimport.mv(dir+'/'+filename).then(async (response) => {
    var successfully = 0;
    var notsuccessfully = 0;
     fs.createReadStream(dir+'/'+filename)
      .pipe(csv())
      .on('data', async(row) => {
         // Create a product
         
         var error = 0;
         const product={};
         if((typeof row.name !== 'undefined' && row.name)  && (typeof row.description !== 'undefined' && row.description)){
          if(row.name == '' && row.description == '' ){

          }else{
             if(row.name == ''){
               error++;
             }else{
              product.seller_id = user_id;
              product.name = row.name;
             }
             if(row.sativa == '' || row.sativa < 0){
              //row.sativa = '0';
              product.sativa = 0;
               //error++;
             }else{
              product.sativa = row.sativa;
             }
             if(row.thc == ''){
              //row.thc = "";
               //error++;
             }else{
              product.thc = row.thc;
             }
             if(row.description == '' || row.description.length > 400){
               error++;
             }else{
              product.description = row.description;
             }
             if(row.price == '' || row.price <= 0){
              product.price = 0;
              // error++;
             }else{
              product.price = row.price;
             }
             if(row.stock == '' || row.stock <= 0){
              product.stock = 0;
              product.remaining_stock = 0;
               //error++;
             }else{
              product.stock = row.stock;
              product.remaining_stock = row.stock;
             }
             if(row.product_type == ''){
              //row.product_type = ""
               //error++;
             }else{
              product.product_type = row.product_type;
             }
             
             if(error == 0){
               // await getproducttype(row.product_type)
               // .then(async (producttypedetails) => {
                 
                //  const product = {
                //    seller_id : user_id, 
                //    name: row.name,
                //    sativa: row.sativa,
                //    thc: row.thc,
                //    description: row.description,
                //    price: row.price,
                //    stock: row.stock,
                //    remaining_stock: row.stock,
                //    product_type : row.product_type
         
                //  };
                 
                 finaldata.push(product)
               //   successfully++;
               //   // Save product in database
               // await Product.create(product)
               //     .then(data => {
                     
               //     })
               //     .catch(err => {
               //       console.log(err)
               //       notsuccessfully++;
               //       res.status(500).send({
               //         message: err.message || "Some error occurred while creating the Product."
               //       });
               //     });
               // })
               // .catch(err => {
               //   console.log(successfully)
               //   notsuccessfully++;
               // });
 
               
             }else{
               notsuccessfully++;
             }
          }
          
         }else{
           console.log(row)
         }
         
        
       
      })
      .on('end', async() => {
        var i;
        
        var totaldata = finaldata.length-1;
        
        for (i = 0; i < finaldata.length; i++) { 
          if(finaldata[i].product_type){
            await ProductType.findOne({where: { name: { [Op.like]: finaldata[i].product_type }}}).then(async (producttypedetails) => {
              var producttypedetailsid = '';
              var product;
              if(producttypedetails){
                var producttypedetailsid = producttypedetails.id;
                finaldata[i].product_type = producttypedetailsid;
                
              }
                
                
                await Product.create(finaldata[i])
                    .then(data => {
                      successfully++;
                      if(i == totaldata){
                        
                        var errorstr = '';
                        if(notsuccessfully > 0){
                          errorstr = "<br/><span  style='color:#fa7814 !important'>Total "+notsuccessfully+" Product Not Imported.!</span>";
                        }
                        console.log(successfully);
                        res.send({
                          status : 1,  
                          message: "<span style='color:#009600 !important'>Total "+successfully+" Product imported Successfully.!</span>"+errorstr
                        });
                      }
                    }).catch(err => {
                      notsuccessfully++;
                      if(i == totaldata){
                        
                        var errorstr = '';
                        if(notsuccessfully > 0){
                          errorstr = "<br/><span  style='color:#fa7814 !important'>Total "+notsuccessfully+" Product Not Imported.!</span>";
                        }
                        console.log(successfully);
                        res.send({
                          status : 1,  
                          message: "<span style='color:#009600 !important'>Total "+successfully+" Product imported Successfully.!</span>"+errorstr
                        });
                      }
                });
            });
          }else{
            await Product.create(finaldata[i])
                    .then(data => {
                      successfully++;
                      if(i == totaldata){
                        
                        var errorstr = '';
                        if(notsuccessfully > 0){
                          errorstr = "<br/><span  style='color:#fa7814 !important'>Total "+notsuccessfully+" Product Not Imported.!</span>";
                        }
                        console.log(successfully);
                        res.send({
                          status : 1,  
                          message: "<span style='color:#009600 !important'>Total "+successfully+" Product imported Successfully.!</span>"+errorstr
                        });
                      }
                    }).catch(err => {
                      notsuccessfully++;
                      if(i == totaldata){
                        
                        var errorstr = '';
                        if(notsuccessfully > 0){
                          errorstr = "<br/><span  style='color:#fa7814 !important'>Total "+notsuccessfully+" Product Not Imported.!</span>";
                        }
                        console.log(successfully);
                        res.send({
                          status : 1,  
                          message: "<span style='color:#009600 !important'>Total "+successfully+" Product imported Successfully.!</span>"+errorstr
                        });
                      }
                });
          }
          
        }
        if(finaldata.length == 0){
          var errorstr = '';
          if(notsuccessfully > 0){
            errorstr = "<br/><span  style='color:#fa7814 !important'>Total "+notsuccessfully+" Product Not Imported.!</span>";
          }
          
          res.send({
            status : 1,  
            message: "<span style='color:#009600 !important'>Total "+successfully+" Product imported Successfully.!</span>"+errorstr
          });
        }
      });
  })

};

exports.orderlist = async (req, res) => {
  const user_id = req.userId;
  var query  = 'select distinct c.id as order_id,c.email as user_email,c.mobile as user_mobile,i.id as item_id,i.qty as qty,i.created_at as order_date,i.is_confirm as is_confirm,p.* from  checkouts  as c inner join  items as i on i.checkout_id = c.id inner join  products as p on i.product_id = p.id where p.seller_id ='+user_id+' ORDER BY i.is_confirm ASC';
  
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
        // const product_id =  req.body.product_id;
        // const remaining_stock =  req.body.remaining_stock;
        // Product.update({
        //   remaining_stock: remaining_stock
        // }, {
        //   where: { id: product_id }
        // })
        //   .then(num => {
        //     if (num == 1) {
        //       res.send({
        //         status : 1,
        //         message: "Order confirmed successfully."
        //       });
        //     }
        //   }).catch(err => {
        //     res.send({
        //       status : 0,
        //       message: "Error updating order with id=" + id
        //     });
        //   });
       
          res.send({
            status : 1,
            message: "Order confirmed successfully."
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
              //   const product_id =  productdata.product_id;
              //   const remaining_stock =  (data.remaining_stock - productdata.qty);
              //  await Product.update({
              //     remaining_stock: remaining_stock
              //   }, {
              //     where: { id: product_id }
              //   })
              //     .then(num => {
              //       if (num == 1) {
              //         res.send({
              //           status : 1,
              //           message: "Order confirmed successfully."
              //         });
              //       }
              //     }).catch(err => {
              //       res.send({
              //         status : 0,
              //         message: "Error updating order with id=" + id
              //       });
              //     });
                  res.send({
                    status : 1,
                    message: "Order confirmed successfully."
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
  var query  = 'select distinct c.id as order_id,c.email as user_email,c.mobile as user_mobile,u.name as seller_name,i.id as item_id,i.qty as qty,i.is_confirm as is_confirm,p.* from  checkouts  as c inner join  items as i on i.checkout_id = c.id inner join  products as p on i.product_id = p.id  left join users as u on u.id = p.seller_id ORDER BY i.is_confirm ASC';
  
  await sequelize.query(query,{ type: sequelize.QueryTypes.SELECT}).then(function(rows) {
    res.json({ status : 1 ,data : rows});    
  });
};