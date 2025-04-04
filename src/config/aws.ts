import AWS from 'aws-sdk';
import logger from './logger'; // Import your logger if needed

if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  logger.error('AWS credentials or region are not defined in environment variables.');
  throw new Error('AWS configuration missing');
}

const awsConfig = {
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

AWS.config.update(awsConfig);

export { awsConfig, AWS };