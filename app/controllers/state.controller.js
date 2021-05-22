const db = require("../models");
const State = db.state;
const config = require("../config/config.js");

exports.findAll = async(req, res) => {
  
  
  State.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.send({status:0,data:[]});
    });
  
};

exports.findByCountry = (req, res) => {
  const id = req.params.id;
  
  State.findAll({where:{country_id:id}})
    .then(data => {
      res.send({status:1,data:data});
    })
    .catch(err => {
        res.send({status:0,data:[]});
    });
};
