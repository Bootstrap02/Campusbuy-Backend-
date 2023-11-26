// Require the cloudinary library
const cloudinary = require('cloudinary').v2;

// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true
});

// Log the configuration
console.log(cloudinary.config());


/////////////////////////
// Uploads an image file
/////////////////////////
const uploadImage = async (imagePath) => {

    // Use the uploaded file's name as the asset's public ID and 
    // allow overwriting the asset with new versions
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    try {
      // Upload the image
      const result = await cloudinary.uploader.upload(imagePath, options);
      console.log(result);
      return{url: result.secure_url,
            public_id: result.public_id,
            asset_id: result.asset_id,};
    } catch (error) {
      console.error(error);
    }
};


const deleteImage = (image) => {
    // Delete an image
     cloudinary.uploader.destroy(image).then((result) => console.log(result));
};


const deleteOldImages = async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // Fetch images older than 30 days
  const olderImages = await cloudinary.search
      .expression(`uploaded_at < ${thirtyDaysAgo.toISOString()}`)
      .max_results(100)  // Adjust max_results as needed
      .execute();

  // Delete each older image
  for (const image of olderImages.resources) {
      await deleteImage(image);
      // Add a delay to avoid rate limiting (adjust as needed)
      await setTimeoutPromise(1000);
  }
};

module.exports = { uploadImage, deleteImage, deleteOldImages };