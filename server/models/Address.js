const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    userId: String,
    address: String,
    city: String,
    pincode: String,
    phone: String,
    notes: String
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.address || mongoose.model("Address", AddressSchema);
