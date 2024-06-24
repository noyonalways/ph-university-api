import { v2 as cloudinary } from "cloudinary";

// Configuration
cloudinary.config({
  cloud_name: "",
  api_key: "",
  api_secret: "",
});

const sendImageToCloudinary = async () => {
  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(
      "https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg",
      {
        public_id: "shoes",
      },
    )
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error);
    });

  // eslint-disable-next-line no-console
  console.log(uploadResult);
};

export default sendImageToCloudinary;
