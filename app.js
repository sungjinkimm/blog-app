// variable declaration and requires
const express = require('express');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const app = express();
const methodOverride = require('method-override');

// connecting to mongoose and creating db: blogApp
mongoose.connect('mongodb://localhost:27017/blogApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set('useFindAndModify', false);

// apps
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

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
  // sending new blog info to db
  Blog.create(newBlog, (err, blogs) => {
    if (err) {
      console.log('Error Occured' + err);
    } else {
      res.redirect('/blogs');
    }
  });
});

// route to main page with retrieved blog info from db
app.get('/blogs', (req, res) => {
  Blog.find({}, (err, allBlogs) => {
    if (err) {
      console.log('Error Occured' + err);
    } else {
      res.render('index.ejs', { blogs: allBlogs });
    }
  });
});

// show more route
app.get('/blogs/:id', (req, res) => {
  // res.render('show.ejs')
  const blogID = req.params.id;

  Blog.findById(blogID, (err, foundBlog) => {
    if (err) {
      res.redirect('/');
    } else {
      res.render('show.ejs', { blog: foundBlog });
    }
  });
});

// edit route
app.get('/blogs/:id/edit', (req, res) => {
  const blogID = req.params.id;
  Blog.findById(blogID, (err, foundBlog) => {
    if (err) {
      res.redirect('/');
    } else {
      res.render('edit.ejs', { blog: foundBlog });
    }
  });
});

// update route
app.put('/blogs/:id', (req, res) => {
  
  const blogID = req.params.id;
  const blogBody = req.body.blog;
  Blog.findByIdAndUpdate(blogID, blogBody, (err, foundBlog)=>{
    if (err){
      res.redirect('/blogs')
    }
    else {
      res.redirect('/blogs/'+ blogID)
    }
  })
});

// delete route
app.delete('/blogs/:id', (req, res)=>{
  const blogID = req.params.id;
  Blog.findByIdAndRemove(blogID, (err)=>{
    if (err){
      res.redirect('/')
    }
    else {
      res.redirect('/blogs')
    }
  })
})

// app listener
app.listen(PORT, () => {
  console.log('Blog-App Started on http://localhost:5000');
});
