// const paypal = require("../../helpers/paypal");
const { paypal, client } = require("../../helpers/paypal");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

// here, we will save order into database
const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId
    } = req.body;

    // we will create a payment json that this payment json will help us to create paypal payment instance
    const create_payment_json = {
      intent: "CAPTURE",
      payer: {
        payment_method: "paypal"
      },
      /*
      redirect_urls: {
        return_url: "http://localhost:5173/shop/paypal-return",
        cancel_url: "http://localhost:5173/shop/paypal-cancel"
      },
      */
      // we will create these two pages for paypal success and failure payment
      application_context: {
        return_url: `${process.env.FRONTENDURL}/shop/paypal-return`,
        cancel_url: `${process.env.FRONTENDURL}/shop/paypal-cancel`
      },
      purchase_units: [
        {
          reference_id: "default", // Optional, but can be useful for tracking
          item_list: {
            items: cartItems.map((item) => ({
              name: item?.title || "Item Name",
              sku: item?.productId || "SKU",
              unit_amount: {
                currency_code: "USD",
                value: item?.price.toFixed(2)
              },
              quantity: item?.quantity || 1
            }))
          },
          amount: {
            currency_code: "USD",
            value: totalAmount.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: totalAmount.toFixed(2)
              }
            }
          },
          description: "Description for payment made via paypal"
        }
      ]
    };

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody(create_payment_json);

    // Call API with your client and get a response for your call
    //const order = await paypal.execute(request);
    const order = await client.execute(request);
    const approvalURL = order.result.links.find(
      (link) => link.rel === "approve"
    ).href;

    // Create a new order in your database
    //  order.result.id,  // Assuming paymentId is the order id in your model
    const newlyCreatedOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId
    });

    await newlyCreatedOrder.save();

    res.status(201).json({
      success: true,
      approvalURL,
      orderId: newlyCreatedOrder?._id
    });
  } catch (err) {
    console.log("Error in createOrder in shop/order-controller.js : ", err);
    console.log(
      "Error in createOrder in shop/order-controller.js : ",
      err?.message
    );

    res.status(500).json({
      success: false,
      message: "Some error occured"
    });
  }
};

// Capture payment
// here, we will check whether the order/payment is successful or not base on the paypal payment info
const capturePayment = async (req, res) => {
  try {
    const { token, payerId, orderId } = req.body;

    // find the order in our database
    let order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found"
      });
    }

    const request = new paypal.orders.OrdersCaptureRequest(token);
    request.requestBody({}); // No body needed for capture

    // Execute the request
    const response = await client.execute(request);
    const captureDetails = response.result;

    // console.log("captureDetails : ", captureDetails);

    // we will get the products that are bought so that we will reduce the quantities
    for (let item of order.cartItems){
      let product = await product.findById(item.productId);

      if (!product){
        return res.status(404).json({
          success: false,
          message: `Not enough stock for this product ${product?.title}`
        })

        product.totalStock -= item.quantity;
        await product.save();
      }
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = captureDetails?.id;
    order.payerId = payerId;

    // we will get the cartItem that was bought
    const getCartId = order.cartId;
    // we will delete the cart items from the cart table that was bought/ordered
    await Cart.findByIdAndDelete(getCartId);

    // we will save the order
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order
    });
  } catch (err) {
    console.log("Error in capturePayment in shop/order-controller.js : ", err);
    console.log(
      "Error in capturePayment in shop/order-controller.js : ",
      err?.message
    );

    res.status(500).json({
      success: false,
      message: "Some error occured"
    });
  }
};

const getAllOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found"
      });
    }

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (err) {
    console.log(
      "Error in getAllOrdersByUserId in shop/order-controller.js : ",
      err
    );
    console.log(
      "Error in getAllOrdersByUserId in shop/order-controller.js : ",
      err?.message
    );

    res.status(500).json({
      success: false,
      message: "Some error occured"
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (err) {
    console.log("Error in getOrderDetails in shop/order-controller.js : ", err);
    console.log(
      "Error in getOrderDetails in shop/order-controller.js : ",
      err?.message
    );

    res.status(500).json({
      success: false,
      message: "Some error occured"
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUserId,
  getOrderDetails
};
