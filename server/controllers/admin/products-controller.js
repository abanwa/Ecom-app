const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");

const handleImageUpload = async (req, res) => {
  try {
    // console.log("Request file:", req.file);
    // console.log("Request :", req);
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }
    // convert the image to base64. we could use Buffer.from() because we stored the image in memory storage.memory()
    // then we will convert it to base64 image url
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = `data:${req.file.mimetype};base64,${b64}`;
    const result = await imageUploadUtil(url);

    res.json({
      success: true,
      result
    });
  } catch (err) {
    console.log("Error in handleImageUpload in product-controller.js : ", err);
    console.log(
      "Error in handleImageUpload in product-controller.js : ",
      err?.message
    );

    res.json({
      success: false,
      message: "Error occured"
    });
  }
};

// Add a new Product
const addProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock
    } = req.body;
    const newlyCreatedProduct = new Product({
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock
    });

    await newlyCreatedProduct.save();
    res.status(201).json({
      success: true,
      data: newlyCreatedProduct
    });
  } catch (err) {
    console.log("Error in addProduct in product-controller.js : ", err);
    console.log(
      "Error in addProduct in product-controller.js : ",
      err?.message
    );

    res.json({
      success: false,
      message: "Error occured"
    });
  }
};

// Fetch all Products
const fetchAllProducts = async (req, res) => {
  try {
    const listOfProducts = await Product.find({});
    res.status(200).json({
      success: true,
      data: listOfProducts
    });
  } catch (err) {
    console.log("Error in fetchAllProducts in product-controller.js : ", err);
    console.log(
      "Error in fetchAllProducts in product-controller.js : ",
      err?.message
    );

    res.json({
      success: false,
      message: "Error occured"
    });
  }
};

// Edit a Product
const editProduct = async (req, res) => {
  try {
    // we will edit the product base on the product id
    const { id } = req.params;
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock
    } = req.body;

    let findProduct = await Product.findById(id);
    if (!findProduct)
      return res.status(401).json({
        success: false,
        message: "Product not found"
      });

    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    findProduct.brand = brand || findProduct.brand;
    findProduct.price = price === "" ? 0 : price || findProduct.price;
    findProduct.salePrice =
      salePrice === "" ? 0 : salePrice || findProduct.salePrice;
    findProduct.totalStock = totalStock || findProduct.totalStock;
    findProduct.image = image || findProduct.image;

    await findProduct.save();
    res.json({
      success: true,
      data: findProduct
    });
  } catch (err) {
    console.log("Error in editProduct in product-controller.js : ", err);
    console.log(
      "Error in editProduct in product-controller.js : ",
      err?.message
    );

    res.json({
      success: false,
      message: "Error occured"
    });
  }
};

// Delete a Product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product id missing"
      });
    }

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(401).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (err) {
    console.log("Error in deleteProduct in product-controller.js : ", err);
    console.log(
      "Error in deleteProduct in product-controller.js : ",
      err?.message
    );

    res.json({
      success: false,
      message: "Error occured"
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct
};
