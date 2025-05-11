import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

import connectDB from './db/atlas.js'


import './models/user.models.js';
import './models/admin.model.js';
import './models/blog.models.js';

import { User } from './models/user.models.js';
import {Blog} from './models/blog.models.js'


connectDB()

import express from 'express'
import cors from 'cors';

const app = express()
const port = process.env.PORT

app.use(cors());
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
});
app.post('/api/newBlog', async (req, res) => {
  try {
    const { email, title, content, imageUrl } = req.body;

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
      image: imageUrl,  // Using the provided URL directly
      blogger: user._id,
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