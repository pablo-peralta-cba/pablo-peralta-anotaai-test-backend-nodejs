
import { Consumer } from 'sqs-consumer';
import AWS from 'aws-sdk';
import { SQSClient } from '@aws-sdk/client-sqs';
import * as ProductService from '../product.service';
import * as CategoryService from '../category.service';
import * as S3Service from './s3.service';
import logger from '../../config/logger';
import { awsConfig } from '../../config/aws';




const sqsClient = new SQSClient(awsConfig);

const app = Consumer.create({
  queueUrl: process.env.CATALOG_EMIT_SQS_URL || '',
  handleMessage: async (message) => {
    logger.info('Received SQS message:', message);
    if (message.Body) {
      try {
        const payload = JSON.parse(message.Body);
        const ownerId = payload.ownerId;

        logger.info(`Processing catalog for owner: ${ownerId}`);

        // Fetch product and category data for the owner
        const products = await ProductService.getProductsByOwner(ownerId);
        const categories = await CategoryService.getAllCategories(ownerId); 
        logger.info(`Products fetched for owner ${ownerId}:`, products); 
        logger.info(`Categories fetched for owner ${ownerId}:`, categories);

        // Generate the catalog JSON
        const catalogJSON = generateCatalogJSON(ownerId, products, categories);

        // Upload to S3
        const bucketName = process.env.S3_BUCKET_NAME || ''; // Configure bucket name
        const s3Key = `catalogs/${ownerId}.json`;
        await S3Service.uploadCatalogJson(bucketName, s3Key, catalogJSON);

        logger.info(`Catalog updated for owner: ${ownerId} in S3`);
      } catch (error: any) {
        logger.error('Error processing SQS message:', error);
        // Handle error (e.g., retry, move to dead-letter queue)
      }
    }
  },
  sqs: sqsClient,
});

// Function to generate the catalog JSON
const generateCatalogJSON = (ownerId: string, products: any[], categories: any[]) => {
  logger.info(`Generating catalog for owner: ${ownerId} with ${products.length} products and ${categories.length} categories`);

  const catalogData = categories.map(category => {
    logger.info(`Processing category: ${category.title} (ID: ${category.id})`);
    const productsInCategory = products.filter(product => {
      const productCategory = product.category;
      const categoryId = category.id;
      logger.info(`  Checking product: ${product.title}, product.category: ${productCategory ? productCategory.id : null}, categoryId: ${categoryId}`);

      if (productCategory) {
        // Access the 'id' property of the populated CategoryDocument
        return productCategory.id === categoryId;
      }
      return false;
    }).map(product => ({
      title: product.title,
      description: product.description,
      price: product.price,
    }));

    return {
      category_title: category.title,
      category_description: category.description,
      products: productsInCategory,
    };
  });

  return {
    owner: ownerId,
    catalog: catalogData,
  };
};


// const generateCatalogJSON = (ownerId: string, products: any[], categories: any[]) => {
//   logger.info(`Generating catalog for owner: ${ownerId} with ${products.length} products and ${categories.length} categories`); // Log product and category counts

//   const catalogData = categories.map(category => {
//     return {
//       cat_title: category.title,
//       cat_description: category.description,
//       products: products.filter(product => product.category && product.category.toString() === category.id).map(product => ({
//         title: product.title,
//         description: product.description,
//         price: product.price,
//       })),
//     };
//   });

//   return {
//     owner: ownerId,
//     catalog: catalogData,
//   };
// };

export default app;