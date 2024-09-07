import app from "./app.js";
import cloudinary from "cloudinary"

cloudinary.v2.config({
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET_KEY: process.env.CLOUDINARY_API_SECRET_KEY,
});

app.listen(process.env.PORT, () => {
    console.log(`Server listening on Port ${process.env.PORT}`);
});
