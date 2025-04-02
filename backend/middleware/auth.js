const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");



exports.isAuthenticatedUser = catchAsyncErrors(async (req,res,next) =>{
    const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Please Login for access this resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await User.findById(decodedData.id);

  next();
});

// Admin Roles
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role (${req.user.role}) is not allowed to access this resource`,
      });
    }
    next();
  };
};

console.log("authorizeRoles type:", typeof exports.authorizeRoles);