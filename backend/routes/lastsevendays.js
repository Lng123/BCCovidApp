const router = require("express").Router();

let Data = require("../models/data.model");

function formatDate(date) {
    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    var yyyy = date.getFullYear();
    if (dd < 10) { dd = '0' + dd }
    if (mm < 10) { mm = '0' + mm }
    date = yyyy + '-' + mm + '-' + dd;
    return date
}

router.route("/").get(async (req, res) => {
    var date = new Date();
    date.setDate(date.getDate() - 9);
    date = formatDate(date);
    
    console.log(date);
  var data = await Data.Data.find({Reported_Date : {$gt:date}})
    .then(async (data) => {
      console.log(data);
      res.json(data);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
