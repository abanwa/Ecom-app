const Product = require("../../models/Product");

const getFilterProducts = async (req, res) => {
  try {
    // we will get the category and the brand from the query
    const { category = [], brand = [], sortBy = "price-lowtohigh" } = req.query;
    let filters = {};
    if (category.length) {
      // if there is a category, we will select the product base on that categories. that is the mongoDB code to use
      filters.category = { $in: category.split(",") };
    }

    if (brand.length) {
      // if there is a brand, we will select the product base on that brands. that is the mongoDB code to use
      filters.brand = { $in: brand.split(",") };
    }

    // we will select the product base on how we want to sort it
    let sort = {};
    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;
        break;

      case "price-hightolow":
        sort.price = -1;
        break;

      case "title-atoz":
        sort.title = 1;
        break;

      case "title-ztoa":
        sort.title = -1;
        break;

      default:
        sort.price = 1;
        break;
    }

    const products = await Product.find(filters).sort(sort);
    res.status(200).json({
      success: true,
      data: products
    });
  } catch (err) {
    console.log(
      "Error in getFilterProducts in shop/product-controller.js : ",
      err
    );
    console.log(
      "Error in getFilterProducts in shop/product-controller.js : ",
      err?.message
    );

    res.status(500).json({
      success: false,
      message: "Some error occured"
    });
  }
};

// GET A SINGLE PRODUCT DETAILS BY ID
const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID missing"
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (err) {
    console.log(
      "Error in getProductDetails in shop/product-controller.js : ",
      err
    );
    console.log(
      "Error in getProductDetails in shop/product-controller.js : ",
      err?.message
    );

    res.status(500).json({
      success: false,
      message: "Some error occured"
    });
  }
};

module.exports = { getFilterProducts, getProductDetails };
