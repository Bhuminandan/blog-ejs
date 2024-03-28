const { Router } = require("express"); 
const User = require("../models/user"); 

const router = Router(); // Creating an instance of Express Router

// Route for rendering the sign-in form
router.get("/signin", (req, res) => {
  return res.render("signin"); // Render sign-in page
});

// Route for rendering the sign-up form
router.get("/signup", (req, res) => {
  return res.render("signup"); // Render sign-up page
});

// Route for handling sign-in form submission
router.post("/signin", async (req, res) => {
  const { email, password } = req.body; // Destructuring email and password from request body
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password); // Attempt to authenticate user and generate token

    return res.cookie("token", token).redirect("/"); // Set authentication token as cookie and redirect to homepage
  } catch (error) {
    return res.render("signin", {
      error: "Incorrect Email or Password", // Render sign-in page with error message if authentication fails
    });
  }
});

// Route for handling logout
router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/"); // Clear authentication token cookie and redirect to homepage
});

// Route for handling sign-up form submission
router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body; // Destructuring fullName, email, and password from request body
  await User.create({
    fullName,
    email,
    password,
  }); // Create a new user with provided details
  return res.redirect("/"); // Redirect to homepage after successful sign-up
});

module.exports = router; 
