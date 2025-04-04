if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

import express from 'express';
import connectDB from './config/database';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import sqsConsumer from './services/aws/sqs-consumer';
import logger from './config/logger'; 
const app = express();

// Connect to MongoDB
connectDB();
logger.info('MongoDB connected');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount Routes
app.use('/api', productRoutes);
logger.info('Product routes mounted');
app.use('/api', categoryRoutes);
logger.info('Category routes mounted');


// Start SQS Consumer
sqsConsumer.start();
logger.info('SQS Consumer started');


// Basic Error Handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error('Unhandled error:', err);
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
    logger.info(`Server is up and running on port ${port}!`);
    console.log(`Server is up and running on port ${port}!`);
  });