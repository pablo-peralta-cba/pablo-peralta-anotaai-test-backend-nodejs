
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { awsConfig } from '../../config/aws';
import logger from '../../config/logger';

const s3Client = new S3Client(awsConfig);

export const uploadCatalogJson = async (bucketName: string, key: string, jsonData: any) => {
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: JSON.stringify(jsonData),
    ContentType: 'application/json',
  };

  try {
    const command = new PutObjectCommand(params);
    const response = await s3Client.send(command);
    logger.info(`JSON uploaded to S3: ${response}`);
    return `https://${bucketName}.s3.${awsConfig.region}.amazonaws.com/${key}`; // Construct URL
  } catch (error: any) {
    logger.error('Error uploading JSON to S3:', error);
    throw error;
  }
};

// Function to download JSON
export const downloadCatalogJson = async (bucketName: string, key: string) => {
    const params = {
      Bucket: bucketName,
      Key: key,
    };
  
    try {
      const command = new GetObjectCommand(params);
      const response = await s3Client.send(command);
  
      if (response.Body) {
        // Use response.Body.transformToString() for simple text/JSON
        try {
          const jsonString = await response.Body.transformToString();
          return JSON.parse(jsonString);
        } catch (parseError: any) {
          logger.error('Error parsing JSON from S3:', parseError);
          return null;
        }
      }
      return null;
  
    } catch (error: any) {
      logger.error('Error downloading JSON from S3:', error);
      throw error;
    }
  };