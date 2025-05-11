import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

import connectDB from './db/atlas.js'


import './models/user.models.js';
import './models/admin.model.js';
import './models/blog.models.js';


import { User } from './models/user.models.js';
import {Blog} from './models/blog.models.js';


connectDB();
import express from 'express'
import cors from 'cors';

const app = express()
const port = process.env.PORT

app.use(cors({
  origin: 'http://localhost:5173', // frontend origin
  credentials: true
}));

app.use(express.json());


app.listen(port, () => {
  console.log(`Example app listening on port ${port} and ${process.env.PORT}`)
})


app.post('/api/register', async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
    console.log('user added {newUser}')
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/login', async(req,res)=>{
  const {email,password} = req.body;
  User.findOne({email:email}).
  then(user =>{
    if(user)
    {
      if(user.password === password)
      {
        res.json("Success")
      }
      else{

        res.json("Incorrect password")
      }
    }
    else{
      res.json("User not found")
    }
  })
});app.post('/api/newBlog', async (req, res) => {
  try {
   const { email, title, content, imageUrl, category, featured = false } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newBlog = new Blog({
      heading: title,
      content,
      image: imageUrl,
      category, // Include the selected category
      blogger: user._id,
      featured: featured
    });

    const savedBlog = await newBlog.save();
    user.numBlogs += 1;
    user.blog.push(savedBlog._id);
    await user.save();

    res.status(201).json(savedBlog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// Modified API endpoints to include featured status

// Update this endpoint to include 'featured' in the selected fields
app.post('/api/articles/user-by-email', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const articles = await Blog.find({ blogger: user._id })
      .sort({ createdAt: -1 })
      .select('heading category createdAt featured _id') // Added featured field
      .exec();

    res.status(200).json({ articles });
  } catch (err) {
    console.error('Error fetching articles by email:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


app.get('/api/articles/:id', async (req, res) => {
  try {
    const article = await Blog.findById(req.params.id)
      .select('heading content category createdAt image blogger') // Include blogger
      .populate('blogger', 'username') // Populate only the username
      .exec();
    
    if (!article) {
      return res.status(404).json({ 
        success: false,
        message: 'Article not found'
      });
    }
    
    res.status(200).json({
      success: true,
      heading: article.heading,
      content: article.content,
      category: article.category,
      createdAt: article.createdAt,
      image: article.image,
      author: article.blogger.username // Return the username
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
});

app.delete("/api/articles/:id",  (req, res) => {
  const { id } = req.params;
  Blog.findByIdAndDelete(id)
    .then(deletedArticle => {
      if (!deletedArticle) {
        return res.status(404).json({ message: 'Article not found' });
      }
      res.status(200).json({ message: 'Article deleted successfully', deletedArticle });
    })
    .catch(err => res.status(500).json({ message: 'Server error', error: err.message }));

})

app.put('/api/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Blog.findById(id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    // Update only the provided fields
    const { heading, content, category, featured } = req.body;

    if (heading !== undefined) article.heading = heading;
    if (content !== undefined) article.content = content;
    if (category !== undefined) article.category = category;
    if (featured !== undefined) article.featured = featured;

    await article.save();

    res.status(200).json({
      success: true,
      message: 'Article updated successfully',
      article,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
});


// GET all articles with optional pagination, search, and category filter
app.get('/api/articles', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;
    const { search, category } = req.query;

    const query = {};

    if (search) {
      query.heading = { $regex: search, $options: 'i' }; // case-insensitive
    }

    if (category) {
      query.category = category;
    }

    const articles = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({ articles });
  } catch (err) {
    console.error("Error fetching articles:", err);
    res.status(500).json({ error: 'Server error' });
  }
});
// Get all articles in a specific category
app.get('/api/posts/category/:category', async (req, res) => {
  const { category } = req.params;
  try {
    const articles = await Blog.find({ category }).sort({ createdAt: -1 });
    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch articles by category' });
  }
});


// New route to fetch only featured blogs
app.get('/api/featured-posts', async (req, res) => {
  try {
    const featuredPosts = await Blog.find({ featured: true }).sort({ createdAt: -1 }).limit(10);
    res.status(200).json(featuredPosts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch featured posts' });
  }
});
