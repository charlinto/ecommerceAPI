import path from 'path'
import express from'express';
import connectDB from './config/db.js';
import colors from 'colors';
import morgan  from 'morgan';
import { notFound, errorHandler } from './middleware/errMiddleware.js'


import dotenv from 'dotenv'; 

import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js' 




dotenv.config() 

connectDB()

const app = express();

  if (process.env.NODE_ENV ===  'development') {
  app.use(morgan('dev'))
 }

app.use(express.json())

  app.get('/', (req,res) =>{
    res.send('Api is running.....') 
 })


app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

//paypal payment
app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
)

const __dirname = path.resolve()
app.use('/upload', express.static(path.join(__dirname,'/uploads')))

          // for productions//

// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '/frontend/build')))

//   app.get('*', (req,res) =>  
//   res.sendFile(path.resolve(__dirname, '/frontend',"build", 'index.html')))

// } else {
//   app.get('/', (req,res) =>{
//     res.send('Api is running.....') 
//  })
// }

app.use(notFound)

app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} node on port ${PORT}`.yellow.bold))