const express = require('express');
const connectToDatabase = require('./database/connection.'); // Corrected require statement
const authRouter = require("./routes/authRouter");
const productsRoute = require("./routes/ProductsRoute")
const blogRouter = require("./routes/blogRouter")
const productCategRouter = require("./routes/productCategRouter");
const brandRouter = require("./routes/brandRouter");
const {errorHandler} = require("./middlewares/erreurHandler");
const {notFound} = require('./middlewares/erreurHandler');
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require('helmet');
const compression = require('compression'); 
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000; 

connectToDatabase(); // Calling the connectToDatabase 
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));
// Use built-in middleware for parsing JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/users', authRouter);
app.use('/api/products',productsRoute);
app.use('/api/blogs',blogRouter);
app.use('/api/category',productCategRouter);
app.use('/api/brands',brandRouter);

app.use(notFound); //The notFound middleware should be placed after all other routes ato catch 404,
app.use(errorHandler);



app.listen(PORT, () => console.log(`Server is running at Port ${PORT}`));