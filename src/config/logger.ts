// src/config/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info', // Set log level using environment variable
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(), // Log to the console
    // You can add more transports like logging to a file:
    // new winston.transports.File({ filename: 'combined.log' }),
    // new winston.transports.File({ filename: 'errors.log', level: 'error' }),
  ],
});

export default logger;