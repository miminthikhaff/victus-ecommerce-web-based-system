const express = require("express");
const app = express();
const ErrorHandler = require("./middleware/error");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require('cors');

app.use(cors({
    origin: "http://localhost:3000", // Allow frontend to make requests to backend
    methods: "GET,POST,PUT,DELETE",  // Allowed HTTP methods
    credentials: true
  
}));


app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true,limit:"50mb"}));


// config
if(process.env.NODE_ENV!=="PRODUCTION"){
    require("dotenv").config({
        path:"backend/config/.env"
    })}

// Route imports
const product = require("./routes/ProductRoute");
const user = require("./routes/UserRoute");
const order = require("./routes/OrderRoute");
const payment = require("./routes/PaymentRoute");
const cart = require("./routes/WishListRoute");

// Define API routes first
app.use("/api/v2",product);

app.use("/api/v2",user);

app.use("/api/v2",order);

app.use("/api/v2",payment);

app.use("/api/v2",cart);

// Serve React static files only after API routes
app.use(express.static(path.join(__dirname,"../frontend/build")));

// Fallback for any unhandled routes (React app)
app.get("*",(req,res) =>{
    res.sendFile(path.resolve(__dirname,"../frontend/build/index.html"));
})





// it's for errorHandeling
app.use(ErrorHandler);

module.exports = app