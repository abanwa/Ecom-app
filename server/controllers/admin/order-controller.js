const Order = require("../../models/Order");
const UserModel = require("../../models/User");

const getAllOrdersOfAllUsers = async (req, res) => {
  try {
    const orders = await Order.find({});

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
      "Error in getAllOrdersOfAllUsers in admin/order-controller.js : ",
      err
    );
    console.log(
      "Error in getAllOrdersOfAllUsers in admin/order-controller.js : ",
      err?.message
    );

    res.status(500).json({
      success: false,
      message: "Some error occured"
    });
  }
};

const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    let order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Convert the Mongoose document to a plain JavaScript object
    let orderObject = order.toObject();

    const userId = orderObject?.userId?.toString();
    // get the username of the buyer base on the userId
    const userDetails = await UserModel.findById(userId);
    orderObject.buyer = userDetails?.userName || "";

    res.status(200).json({
      success: true,
      data: orderObject
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

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    await Order.findByIdAndUpdate(id, { orderStatus });
    res.status(200).json({
      success: true,
      message: "Order status updated successfully"
    });
  } catch (err) {
    console.log(
      "Error in updateOrderStatus in shop/order-controller.js : ",
      err
    );
    console.log(
      "Error in updateOrderStatus in shop/order-controller.js : ",
      err?.message
    );

    res.status(500).json({
      success: false,
      message: "Some error occured"
    });
  }
};

module.exports = {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus
};
