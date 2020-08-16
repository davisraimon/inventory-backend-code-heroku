const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let inventory_mst = new Schema({
  product_id: {
    type: String,
  },
  brand_id: {
    type: String,
  },
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
  },
  per_quanitity_price: {
    type: String,
  },
  current_stock: {
    type: String,
  },
  required_stock: {
    type: String,
  },
});
module.exports = mongoose.model("inventory_mst", inventory_mst);
