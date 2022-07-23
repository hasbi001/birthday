const axios = require('axios');
const https = require("https");

const db = require("../models");
const User = db.users;
const Message = db.messages;

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
      }
      const name = req.body.fullname;
      const birthday = new Date(req.body.birthdate);
      birthday.setHours(9);
      const data = new User({
        fullname: name,
        birthdate: birthday,
        phonenumber: req.body.phonenumber,
        address: req.body.address 
      });
      const dataMessage = new Message({
        message :"Hey "+name+", It's your birthday",
        duedate : birthday
      });
      User.create(data)
        .then(data => {
          // create data message

          Message.create(dataMessage).catch(err => {
            res.status(500).send({
              message:
                err.message
            });
          })

          res.send(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message
          });
        });
};

exports.findAll = (req, res) => {
    const fullname = req.query.fullname;
    var condition = fullname ? { fullname: { $regex: new RegExp(fullname), $options: "i" } } : {};
    User.find(condition)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message
        });
      });
};

exports.findOne = (req, res) => {
    const id = req.params.id;
  User.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found User with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving User with id=" + id });
    });
};

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
          message: "Data to update can not be empty!"
        });
    }
    const id = req.params.id;
    User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
        if (!data) {
        res.status(404).send({
            message: `Cannot update User with id=${id}. Maybe User was not found!`
        });
        } else res.send({ message: "User was updated successfully." });
    })
    .catch(err => {
        res.status(500).send({
        message: "Error updating User with id=" + id
        });
    });
};

exports.delete = (req, res) => {
    const id = req.params.id;
    User.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete User with id=${id}. Maybe User was not found!`
          });
        } else {
          res.send({
            message: "User was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete User with id=" + id
        });
      });
};

exports.deleteAll = (req, res) => {
    User.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Users were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Users."
      });
    });
};

exports.alertBirthday = async (req, res) => {
  const today = new Date();
  const datemonth = today.getDate()+'-'+today.getMonth(); 
  
  Message.find({status:0})
      .then(data => {
        data.forEach(function(value,index) {
          const execDate = value.duedate.getDate()+"-"+value.duedate.getMonth();
          if (today.getHours() > 0 && today.getMinutes() > 0) {
            console.log("happy yuyus");
            if (today.getDate() == value.duedate.getDate() && today.getMonth() == value.duedate.getMonth()) {
              console.log("happy yuyu");
              const data = JSON.stringify({
                message: value.message
              });
    
              const options = {
                hostname: "hookb.in",
                port: 443,
                path: "/RZJd01rzj9CNyj3N7NO9",
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Content-Length": data.length
                }
              }
  
              const request = https.request(options, (resp) => {
                console.log(`status: ${resp.statusCode}`);
              });
            
              request.write(data);
              request.end();

              Message.updateMany({id:{$eq:value.id}}, {status:1}, { useFindAndModify: false }).catch(err => {
                res.status(500).send({
                  message:
                    err.message
                });
              });
            }
          }                    
        });
        
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message
        });
      });

}