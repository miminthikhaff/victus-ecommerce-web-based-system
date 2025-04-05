const express = require("express");
const path = require("path");

const {
  createUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  userDetails,
  updatePassword,
  updateProfile,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
} = require("../controller/UserController");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

const User = require("../models/UserModel");

// Updated registration route with file handling
router.post("/registration", async (req, res) => {
  // Log incoming data for debugging
  console.log("🔹 Headers:", req.headers);
  console.log("🔹 Full Request Body:", req.body);

  const { name, email, password, avatarUrl, avatarPublicId } = req.body;

  console.log("🔍 name:", name);
  console.log("🔍 email:", email);
  console.log("🔍 password:", password);
  console.log("🔍 avatarUrl:", avatarUrl);
  console.log("🔍 avatarPublicId:", avatarPublicId);

  // Check if required fields are provided
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  // Check if avatarUrl and avatarPublicId are provided
  if (!avatarUrl || !avatarPublicId) {
    return res.status(400).json({ message: "Avatar is required" });
  }

  try {
    // Now create the user, including avatar URL and public ID in the database
    const newUser = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: avatarPublicId || "cloudinary",
        url: avatarUrl,
      },
    });

    console.log("User created:", newUser);

    res.status(201).json({
      message: "User registered successfully",
      user: { name, email, avatarUrl, avatarPublicId },
    });
  } catch (error) {
    // Log the exact error to help debug
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
});



// Other routes remain unchanged
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me/update").put(isAuthenticatedUser, updatePassword);
router.route("/me/update/info").put(isAuthenticatedUser, updateProfile);
router.route("/me").get(isAuthenticatedUser, userDetails);
router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

module.exports = router;
