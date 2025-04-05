const express = require("express");
const app = express();
const ErrorHandler = require("./middleware/error");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

// Enable CORS
app.use(cors({
    origin: "http://localhost:3000", // Adjust to match your frontend's address
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type, Authorization"
  }));

// Middleware to handle JSON payloads
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// Load env variables
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "backend/config/.env",
  });
}

// Route imports
const product = require("./routes/ProductRoute");
const user = require("./routes/UserRoute");
const order = require("./routes/OrderRoute");
const payment = require("./routes/PaymentRoute");
const cart = require("./routes/WishListRoute");

app.use("/api/v2", product);
app.use("/api/v2", user);
app.use("/api/v2", order);
app.use("/api/v2", payment);
app.use("/api/v2", cart);

// ✅ PLACE REGISTRATION ROUTE HERE - BEFORE REACT STATIC FILES
app.post("/api/v2/registration", (req, res) => {
    console.log("🔹 Headers:", req.headers);  // Log headers to confirm Content-Type is correct
    console.log("🔹 Full Request Body:", req.body);  // Log body to confirm avatarUrl and avatarPublicId
  
    const { name, email, password, avatarUrl, avatarPublicId } = req.body;
  
    console.log("🔍 name:", name);
    console.log("🔍 email:", email);
    console.log("🔍 password:", password);
    console.log("🔍 avatarUrl:", avatarUrl);
    console.log("🔍 avatarPublicId:", avatarPublicId);
  
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }
  
    if (!avatarUrl || !avatarPublicId) {
      return res.status(400).json({ message: "Avatar is required" });
    }
  
    return res.status(201).json({
      message: "Registration successful",
      user: { name, email, avatarUrl, avatarPublicId },
    });
  });
  
  

// Serve React static files
app.use(express.static(path.join(__dirname, "../frontend/build")));

// ❌ This wildcard route should always come LAST
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

// Error handling middleware
app.use(ErrorHandler);

module.exports = app;
