import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import connectDB from './db/atlas.js'


import './models/user.models.js';
import './models/admin.model.js';
import './models/blog.models.js';
import './models/bloger.models.js';


connectDB()

import express from 'express'
const app = express()
const port = process.env.PORT

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port} and ${process.env.PORT}`)
})
