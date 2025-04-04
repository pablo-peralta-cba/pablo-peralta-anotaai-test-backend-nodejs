import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { awsConfig } from '../../config/aws';
import logger from '../../config/logger';

const sqsClient = new SQSClient(awsConfig);

interface MessageBodyType {
  entityType: 'product' | 'category';
  entityId: string;
  ownerId?: string; // OwnerId might be optional for some entities (e.g., initial category creation)
}

export const sendMessageToSQS = async (messageBody: MessageBodyType) => {
  const queueUrl = process.env.CATALOG_EMIT_SQS_URL;

  if (!queueUrl) {
    logger.error('Error: CATALOG_EMIT_SQS_URL environment variable is not defined.');
    throw new Error('SQS Queue URL is missing from environment variables.');
  }

  const messageGroupId = messageBody.ownerId
    ? `${messageBody.ownerId}-${messageBody.entityType}`
    : messageBody.entityType; // Fallback if ownerId is not available

  const params = {
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(messageBody),
    MessageGroupId: messageGroupId,
  };

  try {
    const command = new SendMessageCommand(params);
    const response = await sqsClient.send(command);
    logger.info(`Message sent to SQS: ${response.MessageId}`);
    return response.MessageId;
  } catch (error: any) {
    logger.error('Error sending message to SQS:', error);
    throw error;
  }
};