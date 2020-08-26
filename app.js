// variable declaration and requires
const express = require('express');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const app = express();

// connecting to mongoose and creating db: blogApp
mongoose.connect('mongodb://localhost:27017/blogApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// apps
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// mongoose schema
const blogSchema = mongoose.Schema({
  title: String,
  image: String,
  body: String,
});
// mongoose model
const Blog = mongoose.model('Blog', blogSchema);

// restful routes

// route to home page
app.get('/', (req, res) => {
  res.redirect('/blogs');
});

// route to new form
app.get('/blogs/new', (req, res) => {
  res.render('new.ejs');
});

// route to post new info from form
app.post('/blogs', (req, res) => {
  const title = req.body.blog.title;
  const image = req.body.blog.image;
  const body = req.body.blog.body;

  const newBlog = {
    title: title,
    image: image,
    body: body,
  };

  Blog.create(newBlog, (err, blogs) => {
    if (err) {
      console.log('Error Occured' + err);
    } else {
      res.redirect('/blogs');
    }
  });
});
// route to get posted info
app.get('/blogs', (req, res) => {
  Blog.find({}, (err, allBlogs) => {
    if (err) {
      console.log('Error Occured' + err);
    } else {
      res.render('index.ejs', { blogs: allBlogs });
    }
  });
});

// app listener
app.listen(PORT, () => {
  console.log('Blog-App Started on http://localhost:5000');
});
