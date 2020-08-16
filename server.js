const express = require("express");
require("dotenv").config();
const app = express();
const bodyParser = require("body-parser");
const { Parser } = require("json2csv");
const fs = require("fs");
const cors = require("cors");
const mongoose = require("mongoose");
const inventory_routes = express.Router();
const PORT = process.env.PORT || 4000;
let Inventory = require("./inventory.model");
let PurchaseOrders = require("./purchase-orders.model");
const stripe = require("stripe")(process.env.STRPE_KEY);

app.use(cors());
app.use(bodyParser.json());
app.use("/inventory", inventory_routes);

// mongoose.connect("mongodb://127.0.0.1:27017/inventory_mst", {
//   useNewUrlParser: true,
// });
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", function () {
  console.log("MongoDB database connection established successfully");
});
app.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});
inventory_routes.route("/").get(function (req, res) {
      res.json(mst);
    
  });
});
// csv download of master

inventory_routes.route("/downloadmst/:option").get(function (req, res) {
  let option = req.params.option;
  let currentTable = Inventory;
  let filename = "";
  let fields = [];
  if (option == 1) {
    currentTable = Inventory;
    fields = [
      "product_id",
      "brand_id",
      "name",
      "desciption",
      "category",
      "per_quanitity_price",
      "current_stock",
      "required_stock",
    ];
    filename = "InventoryMaster.csv";
  } else {
    fields = [
      "product_id",
      "order_status",
      "order_quantity",
      "total_price",
      "payment_status",
      "order_date",
    ];
    currentTable = PurchaseOrders;
    filename = "PurchaseOrdersMaster.csv";
  }
  currentTable.find(function (err, mst) {
    if (err) {
      console.log(err);
    } else {
      const options = { fields };
      const parser = new Parser(options);
      const csv = parser.parse(mst);
      res.attachment(filename);
      res.status(200).send(csv);
    }
  });
});
function csvDownload(mst, filename) {
  const fields = [
    "product_id",
    "brand_id",
    "name",
    "desciption",
    "category",
    "per_quanitity_price",
    "current_stock",
    "required_stock",
  ];
  const ops = { fields };
  const parser = new Parser(ops);
  const csv = parser.parse(mst);
  fs.writeFileSync(filename, csv);
}
// Payment checkout

inventory_routes.route("/checkout").post(function (req, res) {
  let payment_order = new PurchaseOrders({
    product_id: req.body.product_id,
    payment_status: req.body.payment_status,
    order_status: req.body.order_status,
    total_price: req.body.total_price,
    order_quantity: req.body.order_quantity,
    order_date: req.body.order_date,
  });
  payment_order
    .save()
    .then((inventory_item) => {
      res.status(200).json({ mst: "success" });
    })
    .catch((err) => {
      res.status(400).send("failed");
    });
});

// Get All Items

inventory_routes.route("/").get(function (req, res) {
  Inventory.find(function (err, mst) {
    if (err) {
      console.log(err);
    } else {
      res.json(mst);
    }
  });
});

inventory_routes.route("/purchaseorders").get(function (req, res) {
  PurchaseOrders.find(function (err, mst) {
    if (err) {
      console.log(err);
    } else {
      res.json(mst);
    }
  });
});

// Get an Item By _ID

inventory_routes.route("/:id").get(function (req, res) {
  let id = req.params.id;
  Inventory.findById(id, function (err, mst) {
    res.json(mst);
  });
});

// Get an Item By Product ID

inventory_routes.route("/product_id/:product_id").get(function (req, res) {
  let id = req.params.product_id;
  Inventory.find({ product_id: id }, function (err, mst) {
    res.json(mst);
  });
});

// Add Operation

inventory_routes.route("/add").post(function (req, res) {
  let inventory_item = new Inventory(req.body);
  inventory_item
    .save()
    .then((inventory_item) => {
      res.status(200).json({ mst: "mst item added successfully" });
    })
    .catch((err) => {
      res.status(400).send("adding new mst item failed");
    });
});

inventory_routes.route("/purchaseorders/add").post(function (req, res) {
  let purchase_order = new PurchaseOrders(req.body);
  purchase_order
    .save()
    .then((inventory_item) => {
      res.status(200).json({ mst: "purchase order created successfully!" });
    })
    .catch((err) => {
      res.status(400).send("purchase could not be created");
    });
});

// Update Operation

inventory_routes.route("/update/:id").post(function (req, res) {
  Inventory.findById(req.params.id, function (err, mst) {
    if (!mst) res.status(404).send("mst item is not found");
    else mst.product_id = req.body.product_id;
    mst.brand_id = req.body.brand_id;
    mst.name = req.body.name;
    mst.description = req.body.description;
    mst.quantity = req.body.quantity;
    mst.per_quanitity_price = req.body.per_quanitity_price;
    mst.sum_quantity_price = req.body.sum_quantity_price;
    mst.current_stock = req.body.current_stock;
    mst.category = req.body.category;
    mst.required_stock = req.body.required_stock;
    mst
      .save()
      .then((mst) => {
        res.json("mst item updated!");
      })
      .catch((err) => {
        res.status(400).send("mst item Update not possible");
      });
  });
});

// Delete Operation

inventory_routes.route("/delete/:id").get(function (req, res) {
  let id = req.params.id;
  Inventory.deleteOne({ _id: id }, function (err, mst) {
    res.json("Deleted the record");
  });
});
