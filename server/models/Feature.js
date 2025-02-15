
const mongoose = require("mongoose");

const FeatureSchema = new mongoose.Schema({
	image: String
}, {
	timestamps: true
});

module.exports = mongoose.models.feature || mongoose.model("Feature", FeatureSchema);