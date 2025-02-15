const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const AuthRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");

const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");

const commonFeatureRouter = require("./routes/common/feature-routes");


// create a database connection -> u can also create a separate file for this and then import /use that file
mongoose
  .connect(
    `mongodb+srv://abanwachinaza:fom6b6qYYjBJy2Ox@ecomcluster.41iyy.mongodb.net/`
  )
  .then(() => console.log("Database mongoDB connected"))
  .catch((err) => console.log("DATABASE ERROR : ", err));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: `http://localhost:5173`,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma"
    ],
    credentials: true
  })
);

app.use(cookieParser());
app.use(express.json());

// API
app.use("/api/auth", AuthRouter);

app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);

app.use("/api/common/feature", commonFeatureRouter);



// run our server
app.listen(PORT, () => {
  console.log(`Server is now running on port : ${PORT}`);
});
