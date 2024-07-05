import { CLOUDINARY_CLOUDNAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from "./env";
import { v2 as cloudinary } from "cloudinary";

// Configuration Cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUDNAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});

export default cloudinary;