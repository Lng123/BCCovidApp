const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const dataSchema = new Schema({
  Reported_Date: { type: String },
  HA: { type: String },
  Sex: { type: String },
  Age_Group: { type: String },
  Classification_Reported: { type: String },
});

const Data = mongoose.model("Data", dataSchema, "Data");
module.exports = {
  Data,
};
