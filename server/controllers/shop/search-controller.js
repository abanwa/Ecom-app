
const Product = require("../../models/Product");

const searchProducts = async(req, res) => {
	try {

		const {keyword} = req.params;

		if (!keyword || typeof keyword !== 'string'){
			return res.status(400).json({
				success: false,
				message: "keyword is required and must be in string format"
			})
		}



		// using regular expression
		const regEx = new RegExp(keyword, 'i'); // the "i" is for case-sensitive
		const createSearchQuery = {
			$or : [
				{title: regEx},
				{description: regEx},
				{category: regEx},
				{brand: regEx},
			]
		}

		const searchResults = await Product.find(createSearchQuery);
		

		res.status(200).json({
			success: true,
			data: searchResults
		})

	} catch(err){
		console.log(
      "Error in searchProducts in shop/product-controller.js : ",
      err
    );
    console.log(
      "Error in searchProducts in shop/product-controller.js : ",
      err?.message
    );

    res.status(500).json({
      success: false,
      message: "Some error occured"
    });
	}
}


module.exports = {searchProducts};