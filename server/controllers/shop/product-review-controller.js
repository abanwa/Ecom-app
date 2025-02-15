
const Order = require("../../models/Order");
const Product = require("../../models/Product");
const ProductReview = require("../../models/Review");

const addProductReview = async(req, res) => {
	try {

		const {productId, userId, userName, reviewMessage, reviewValue} = req.body;

		if (!productId || !userId || !userName || !reviewMessage || !reviewValue){
			return res.status(400).json({
				success: false,
				message: "Invalid request"
			})
		}

		// we will find the order because we want the user to review only the products the user bought
		// and we will also check if the order is confirmed or not. if the order is not confirmed (that is payment is not confiirmed),
		// the user can not add the review
		const order = await Order.findOne({
			userId, 
			"cartItems.productId": productId,
			orderStatus: "confirmed"
		});

		// console.log("ORDER VALUE : ", order);

		if (!order){
			return res.status(403).json({
				success: false,
				message: "You need to purchase product to review it."
			})
		}

		// we will check if there is any existing review on this product / if user has already review the product
		const checkExistingReview = await ProductReview.findOne({productId, userId});

		if (checkExistingReview){
			return res.status(400).json({
				success: false,
				message: "You already reviewed this product"
			})
		}

		const newReview = new ProductReview({
			productId, 
			userId, 
			userName, 
			reviewMessage, 
			reviewValue
		});

		await newReview.save();

		// we will calculate the average review for the product
		const reviews = await ProductReview.find({productId});
		const totalReviewsLength = reviews.length;
		const averageReview = reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) / totalReviewsLength;

		// we will update the average review for that product in the product table
		await Product.findByIdAndUpdate(productId, {averageReview});

		res.status(201).json({
			success: true,
			data: newReview
		})

	}catch(err){
		console.log(
      "Error in addProductReview in shop/product-review-controller.js : ",
      err
    );
    console.log(
      "Error in addProductReview in shop/product-review-controller.js : ",
      err?.message
    );

    res.status(500).json({
      success: false,
      message: "Some error occured"
    });
	}
}



const getProductReviews = async(req, res) => {
	try {

		const {productId} = req.params;

		if (!productId){
			return res.status(400).json({
				success: false,
				message: "Parameters missing"
			})
		}

		const review = await ProductReview.find({productId});

		if (!review){
			return res.status(404).json({
				success: false,
				message: "Review not found"
			})
		}

		res.status(200).json({
			success: true,
			data: review
		})

	}catch(err){
		console.log(
      "Error in getProductReviews in shop/product-review-controller.js : ",
      err
    );
    console.log(
      "Error in getProductReviews in shop/product-review-controller.js : ",
      err?.message
    );

    res.status(500).json({
      success: false,
      message: "Some error occured"
    });
	}
}

module.exports = {addProductReview, getProductReviews};