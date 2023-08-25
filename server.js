const dotenv = require('dotenv');
const connectToDatabase = require('./database/connection.'); // Corrected require statement

dotenv.config();

// Calling the connectToDatabase 
connectToDatabase(); 

// Module

const express = require('express');
const authRouter = require("./routes/authRouter");
const productsRoute = require("./routes/ProductsRoute")
const blogRouter = require("./routes/blogRouter")
const productCategRouter = require("./routes/productCategRouter");
const brandRouter = require("./routes/brandRouter");
const couponRouter = require("./routes/couponRouter");
const cartRouter = require("./routes/CartRouter");
const colorRouter = require("./routes/colorRouter");
const inquiryRouter = require("./routes/inquiryRouter");
const {errorHandler} = require("./middlewares/erreurHandler");
const {notFound} = require('./middlewares/erreurHandler');
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require('helmet');
const compression = require('compression'); 
const limiter = require('./middlewares/limiter')
const cors = require('cors');

const app = express();

// Middlewares

app.use(helmet());
app.use(cors());
app.use(limiter);
app.use(compression());
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
// Use built-in middleware for parsing JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Route
app.use('/api/users', authRouter);
app.use('/api/products',productsRoute);
app.use('/api/blogs',blogRouter);
app.use('/api/category',productCategRouter);
app.use('/api/brands',brandRouter);
app.use('/api/coupons',couponRouter);
app.use('/api/carts',cartRouter);
app.use('/api/colors',colorRouter);
app.use('/api/inquiry',inquiryRouter);


// Error handler Middlwares
//The notFound middleware should be placed after all other routes ato catch 404,
app.use(notFound); 
app.use(errorHandler);


// Port
const PORT = process.env.PORT || 4000; 
app.listen(PORT, () =>
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
			
	)
);