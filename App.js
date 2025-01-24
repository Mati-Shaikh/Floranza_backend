const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const perfumeRoutes = require("./routes/perfumeRoutes");
const path = require("path");
const cors = require("cors"); // Import CORS package

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
console.log("Saving file to:", path.join(__dirname, "uploads"));

// Default admin credentials
const ADMIN_CREDENTIALS = { username: "admin", password: "admin" };
app.use((req, res, next) => {
    req.adminPassword = ADMIN_CREDENTIALS.password;
    next();
});

// Routes
app.use("/api", perfumeRoutes);

// Database Connection
mongoose.connect("mongodb+srv://mydb:mydb1234@cluster0.hnrty.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Failed to connect to MongoDB", err));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: "Something went wrong!" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
