require("dotenv").config(); // Load environment variables

const path = require("path"); // Node.js path module
const express = require("express"); // Express.js framework
const mongoose = require("mongoose"); // Mongoose for MongoDB object modeling
const cookieParser = require("cookie-parser"); // Middleware for parsing cookies

const Blog = require("./models/blog"); // Importing the Blog model
const userRoute = require("./routes/user"); // User routes
const blogRoute = require("./routes/blog"); // Blog routes

const { checkForAuthenticationCookie } = require("./middlewares/authentication"); // Middleware for authentication

const app = express(); // Initialize Express app
const PORT = process.env.PORT || 8000; // Define port, fallback to 8000 if not specified in environment variables

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Set view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middleware for parsing form data
app.use(express.urlencoded({ extended: false }));

// Middleware for parsing cookies
app.use(cookieParser());

// Middleware for checking authentication cookie
app.use(checkForAuthenticationCookie("token"));

// Middleware for serving static files
app.use(express.static(path.resolve("./public")));

// Route for homepage
app.get("/", async (req, res) => {
  // Fetch all blogs from the database
  const allBlogs = await Blog.find({});
  // Render home page with user object and fetched blogs
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

// Mounting user routes
app.use("/user", userRoute);

// Mounting blog routes
app.use("/blog", blogRoute);

// Start server
app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
