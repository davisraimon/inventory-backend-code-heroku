const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let purchase_orders = new Schema({
  product_id: {
    type: String,
  },
  order_status: {
    type: Number,
  },
  order_quantity: {
    type: String,
  },
  total_price: {
    type: String,
  },
  payment_status: {
    type: String,
  },
  total_amount_to_be_paid: {
    type: String,
  },
  order_date: {
    type: Date,
  },
});
module.exports = mongoose.model("purchase_orders", purchase_orders);
