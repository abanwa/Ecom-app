
const mongoose = require("mongoose");

const ProductReviewSchema = new mongoose.Schema({
	productId: String,
	userId: String,
	userName: String,
	reviewMessage: String,
	reviewValue: Number
}, {
	timestamps: true
});

module.exports = mongoose.models.productReview || mongoose.model("ProductReview", ProductReviewSchema);