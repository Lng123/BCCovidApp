const router = require("express").Router();

let Data = require("../models/data.model");

router.route("/").get(async (req, res) => {
  var data = await Data.Data.aggregate([
    {$group : { _id : '$Sex', count : {$sum : 1}}},{$sort: {_id: 1}}]
 )
    .then(async (data) => {
      console.log(data);
      res.json(data);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
