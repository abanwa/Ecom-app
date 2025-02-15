const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided"
      });
    }

    // find the product base on the product id
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // we will check if the user already has an existing cart
    let cart = await Cart.findOne({ userId });

    // if there is no cart, we will create a new cart
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // find the current product index in the cart to know whether the product is already in the cart
    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item?.productId.toString() === productId
    );

    // if the currentproductIndex is -1, it means sthe product is not in the cart
    if (findCurrentProductIndex === -1) {
      cart.items.push({ productId, quantity });
    } else {
      // if the product already exist, we will increase the product quantity
      cart.items[findCurrentProductIndex].quantity += quantity;
    }

    // we will save he cart item
    await cart.save();
    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (err) {
    console.log("Error in addToCart in shop/cart-controller.js : ", err);
    console.log(
      "Error in addToCart in shop/cart-controller.js : ",
      err?.message
    );

    res.status(500).json({
      success: false,
      message: "Some error occured"
    });
  }
};

const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User Id is mandatory"
      });
    }

    // image title price salePrice are the things we want to select from each of the products when we find any or more
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "_id image title price salePrice"
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    // we will check if this cart items are still in our database
    const validItems = cart.items.filter(
      (productItem) => productItem?.productId
    );

    // if the length of validaItem that we check is less than the original length of the user cart items, it means that a product that the user wanted to buy has been deleted from the database
    // we will then save the most recent cart that are still valid/intact in the database for the user
    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    // the _id, image, title, price and salePrice are coming from the cart product id we populated for each of the products found
    const populateCartItems = validItems.map((item) => ({
      productId: item?.productId ? item?.productId?._id : null,
      image: item.productId ? item.productId?.image : null,
      title: item.productId ? item.productId?.title : "Product not found",
      price: item.productId ? item.productId?.price : null,
      salePrice: item.productId ? item.productId?.salePrice : null,
      quantity: item.quantity
    }));

    res.status(200).json({
      success: true,
      data: { ...cart?._doc, items: populateCartItems }
    });
  } catch (err) {
    console.log("Error in fetchCartItems in shop/cart-controller.js : ", err);
    console.log(
      "Error in fetchCartItems in shop/cart-controller.js : ",
      err?.message
    );

    res.status(500).json({
      success: false,
      message: "Some error occured"
    });
  }
};

const updateCartItemQty = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided"
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    // we will find the productIndex of the product in the cart we want to update
    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item?.productId.toString() === productId
    );

    // if the currentProductIndex is -1, then the product is not in the cart
    if (findCurrentProductIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "cart item not present"
      });
    }

    // we will update the quantity of the cart
    cart.items[findCurrentProductIndex].quantity = quantity;
    // save the cart
    await cart.save();

    // we will select the product in the cart using the productId and populate the product
    await cart.populate({
      path: "items.productId",
      select: "_id image title price salePrice"
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart?._doc,
        items: populateCartItems
      }
    });
  } catch (err) {
    console.log(
      "Error in updateCartItemQty in shop/cart-controller.js : ",
      err
    );
    console.log(
      "Error in updateCartItemQty in shop/cart-controller.js : ",
      err?.message
    );

    res.status(500).json({
      success: false,
      message: "Some error occured"
    });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided"
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "_id image title price salePrice"
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    cart.items = cart.items.filter(
      (item) => item?.productId?._id.toString() !== productId
    );

    await cart.save();

    // we will populate the cart that we deleted a product from
    await cart.populate({
      path: "items.productId",
      select: "_id image title price salePrice"
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart?._doc,
        items: populateCartItems
      }
    });
  } catch (err) {
    console.log("Error in deleteCartItem in shop/cart-controller.js : ", err);
    console.log(
      "Error in deleteCartItem in shop/cart-controller.js : ",
      err?.message
    );

    res.status(500).json({
      success: false,
      message: "Some error occured"
    });
  }
};

module.exports = {
  addToCart,
  fetchCartItems,
  updateCartItemQty,
  deleteCartItem
};
