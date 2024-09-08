import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";

export const register = async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Profile Imege Required.", 400));
  }

  const { profileImage } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(profileImage.mimetype)) {
    return next(new ErrorHandler("File format not supported.", 400));
  }

  const {
    userName,
    Password,
    email,
    address,
    phoneNo,
    role,
    bankAccountNumber,
    bankAccountName,
    bankName,
    upi_id,
    paypalEmail,
  } = req.body;

  if (
    !userName ||
    !email ||
    !Password ||
    !address ||
    !phoneNo ||
    !role
  ) {
    return next(new ErrorHandler("Please fill full form.", 400));
  }
  if (role === "Auctioneer") {
    if (!bankAccountNumber || !bankAccountName || !bankName) {
      return next(new ErrorHandler("Please provide full Bank details.", 400));
    }
    if (!upi_id) {
      return next(new ErrorHandler("Please provide your UPI ID.", 400));
    }
    if (!paypalEmail) {
      return next(new ErrorHandler("Please provide your Paypal Email.", 400));
    }
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("User already registered.", 400));
  }

  const cloudinaryResponse = await cloudinary.uploader.upload(
    profileImage.tempFilePath,
    {
      folder: "AUCTION_PLATFORM_USERS",
    }
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown cloudinary error."
    );
  }
  return next(
    new ErrorHandler("Failed to upload profile image to cloudinary.", 500)
    );
    
    const user = await User.create({
      userName,
      email,
      Password,
      phoneNo,
      address,
      role,
      profileImage: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
      paymentMethods: {
        bankTransfer: {
          bankAccountNumber,
          bankAccountName,
          bankName,
        },
        UPI: {
          upi_id,
        },
        paypal: {
          paypalEmail,
        },
      },
    });

    res.status(201).json({
        success: true,
        message: "User Registered.",
    })
};
