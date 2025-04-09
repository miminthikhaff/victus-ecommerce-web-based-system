const express = require("express");
const app = express();
const ErrorHandler = require("./middleware/error");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

// Enable CORS
app.use(cors({
  origin: "https://victus-ecommerce-frontend.onrender.com", // Adjust to match your frontend's address
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  }));

// Middleware to handle JSON payloads
app.use(express.json());

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

app.use(bodyParser.json({ type: 'application/*+json' }))

// Load env variables
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}

// Route imports
const product = require("./routes/ProductRoute");
const user = require("./routes/UserRoute");
const order = require("./routes/OrderRoute");
const payment = require("./routes/PaymentRoute");
const cart = require("./routes/WishListRoute");

// Serve React static files
app.use(express.static(path.join(__dirname, "../frontend/build")));

// API routes (place this BEFORE the wildcard catch-all!)
app.use("/api/v2", product);
app.use("/api/v2", user);
app.use("/api/v2", order);
app.use("/api/v2", payment);
app.use("/api/v2", cart);

 


// ❌ This wildcard route should always come LAST
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

// Error handling middleware
app.use(ErrorHandler);

module.exports = app;
