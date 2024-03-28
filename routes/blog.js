const { Router } = require("express");
const multer = require("multer"); 
const path = require("path"); 

const Blog = require("../models/blog");
const Comment = require("../models/comment"); 

const router = Router(); 

// Multer configuration for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`)); // Destination directory for uploaded files
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`; // Unique filename
    cb(null, fileName);
  },
});

// Multer middleware for file uploads
const upload = multer({ storage: storage });

// Route for rendering the form to add a new blog
router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user, // Pass user object to the template
  });
});

// Route for fetching a specific blog by ID and its comments
router.get("/:id", async (req, res) => {
  // Find the blog by ID and populate createdBy field
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  // Find comments associated with the blog and populate createdBy field
  const comments = await Comment.find({ blogId: req.params.id }).populate(
    "createdBy"
  );

  return res.render("blog", {
    user: req.user, // Pass user object to the template
    blog, // Pass blog object to the template
    comments, // Pass comments array to the template
  });
});

// Route for adding a comment to a specific blog
router.post("/comment/:blogId", async (req, res) => {
  // Create a new comment
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id, // Set createdBy to the current user's ID
  });
  return res.redirect(`/blog/${req.params.blogId}`); // Redirect back to the blog page
});

// Route for creating a new blog
router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  // Create a new blog
  const blog = await Blog.create({
    body,
    title,
    createdBy: req.user._id, // Set createdBy to the current user's ID
    coverImageURL: `/uploads/${req.file.filename}`, // Set cover image URL
  });
  return res.redirect(`/blog/${blog._id}`); // Redirect to the newly created blog page
});

module.exports = router; 
