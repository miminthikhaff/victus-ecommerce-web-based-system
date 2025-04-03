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


// Updated registration route with file handling
router.post("/registration", async (req, res) => {
  const { name, email, password } = req.body;

  // Check if avatar is uploaded
  if (!req.files || !req.files.avatar) {
    return res.status(400).json({ message: "Avatar is required" });
  }

  const avatar = req.files.avatar;

  // Validate avatar type (optional)
  if (!avatar.mimetype.startsWith("image/")) {
    return res.status(400).json({ message: "Please upload a valid image file" });
  }

  // Generate a unique path for the avatar file
  const avatarPath = path.join(__dirname, "../uploads", Date.now() + path.extname(avatar.name));

  // Move the avatar file to the uploads folder
  avatar.mv(avatarPath, async (err) => {
    if (err) {
      return res.status(500).json({ message: "Error uploading avatar", error: err });
    }

    try {
      // Now create the user, including avatar path in the database
      const newUser = await createUser({
        name,
        email,
        password,
        avatar: avatarPath, // Save the path in the database
      });

      res.status(201).json({
        message: "User registered successfully",
        user: { name, email, avatar: avatarPath },
      });
    } catch (error) {
      res.status(500).json({ message: "Error registering user", error: error.message });
    }
  });
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
