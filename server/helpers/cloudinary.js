const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: "do6ksl4ly",
  api_key: "241222224879882",
  api_secret: "jM_2w8H43Z87KAwo-UjaNR0Jf0M"
});

// since we are using a memoryStoarge, we can access the image later and make changes before saving because the image is 
// stored in memory
const storage = new multer.memoryStorage();

async function imageUploadUtil(file) {
  const result = await cloudinary.uploader.upload(file, {
    resource_type: "auto"
  });

  return result;
}


const upload = multer({ storage });

module.exports = { upload, imageUploadUtil };
