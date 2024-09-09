import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    minLength: [3, "Username must contain atleast 3 characters."],
    maxLength: [40, "Username cannot exceed 40 characters."],
  },
  Password: {
    type: String,
    selected: false,
    minLength: [8, "Password must contain atleast 8 characters."],
    maxLength: [32, "Password cannot exceed 32 characters."],
  },
  email: String,
  address: String,
  phoneNo: {
    type: String,
    minLength: [10, "Phone No. must contain exact 10 digits."],
    maxLength: [40, "Phone No. must contain exact 10 digits."],
  },
  profileImage: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  paymentMethods: {
    bankTransfer: {
      bankAccountNumber: String,
      bankAccountName: String,
      bankName: String,
    },
    UPI: {
      upi_id: String,
    },
    paypal: {
      paypalEmail: String,
    },
  },
  role: {
    type: String,
    enum: ["Auctioneer", "Bidder", "Admin"],
  },
  unpaidCommission: {
    type: Number,
    default: 0,
  },
  auctionsWon: {
    type: Number,
    default: 0,
  },
  moneySpent: {
    type: Number,
    default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("Password")) {
     return next();
  }
  this.Password = await bcrypt.hash(this.Password, 10);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.Password);
};

userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
}

export const User = mongoose.model("User", userSchema);