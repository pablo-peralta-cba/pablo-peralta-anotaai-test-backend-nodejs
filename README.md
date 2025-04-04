# Backend Analyst Candidate Test - Pablo Peralta

# AnotaAi Backend API



**Backend API developed as a solution for the [AnotaAi candidate test](https://github.com/githubanotaai/new-test-backend-nodejs).**

## Table of Contents

- [About](#about)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
  - [Development Mode](#development-mode)
  - [Production Mode](#production-mode)
- [Contact](#Contact)

## About
This is a robust and scalable RESTful API built using Node.js, Express and TypeScript. It provides a comprehensive backend solution for managing products and categories catalogs, including creation, update and sharing. The API is designed with a focus on data integrity through Mongoose for interacting with MongoDB.
It also incorporates AWS services, including SQS for asynchronous task processing and S3 for file storage, making it a powerful and versatile backend. Logging is implemented using Winston for effective monitoring and debugging.

## Features

- **Products and Categories Management:** Full CRUD (Create, Read, Update, Delete) operations for your primary data entities, structured in downloadable catalogs (JSON files).
- **Asynchronous Task Processing:** Utilizes AWS SQS (Simple Queue Service) to handle background tasks and decouple processes, improving application responsiveness and reliability.
- **File Storage:** Integration with AWS S3 (Simple Storage Service) for efficient and scalable storage of files.
- **Data Persistence:** Leverages MongoDB with Mongoose ODM (Object Data Modeling) for structured and efficient database interactions.
- **Centralized Logging:** Implements `winston` for comprehensive logging across the application, allowing for different log levels and output destinations.
- **Environment Configuration:** Uses `dotenv` to manage environment variables, keeping sensitive configuration separate from the codebase.

## Technologies

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- dotenv
- winston
- AWS SDK (specifically S3 and SQS)
- sqs-consumer


## Installation

1.  Clone the repository:
    ```bash
    git clone [Your Repository URL]
    cd [Your Application Directory Name]
    ```

2.  Install the dependencies using npm:
    ```bash
    npm install
    ```

    Or, if you prefer Yarn:
    ```bash
    yarn install
    ```

## Configuration

1.  Create a `.env` file in the root directory of the project.

2.  Define the following environment variables based on your application's needs:

    ```env
    NODE_ENV=development
    PORT=4000
    # Mongo database variables
    MONGO_URI=mongodb://localhost:27017/[Your Database Name]

    #AWS Access
    AWS_REGION=[Your AWS Region]
    AWS_ACCESS_KEY_ID=[Your AWS Access Key ID]
    AWS_SECRET_ACCESS_KEY=[Your AWS Secret Access Key]
    CATALOG_EMIT_SQS_URL=[Your SQS Queue URL]
    S3_BUCKET_NAME=[Your S3 Bucket name]

    #logger
    LOG_LEVEL=[Your desired level. E.g. debud]

    ```


## Running the Application

### Development Mode

1.  Make sure you have configured the `.env` file as described in the [Configuration](#configuration) section.

2.  Run the application in development mode using the appropriate script from your `package.json`:

    ```bash
    npm run dev
    # or
    yarn dev
    ```

3.  The application should now be running at `http://localhost:[Your Configured Port]` (e.g., `http://localhost:4000`).

### Production Mode


1.  Ensure you have built your application if necessary (e.g., transpiled TypeScript to JavaScript). This might involve a build script in your `package.json`:

    ```bash
    npm run build
    # or
    yarn build
    ```

2.  Set the `NODE_ENV` environment variable to `production`:

    ```bash
    export NODE_ENV=production
    ```

    Or, you can set it directly when running the script:

    ```bash
    NODE_ENV=production npm start
    # or
    NODE_ENV=production yarn start
    ```

    (Replace `start` with the actual script name for running your production build).

3.  The application should now be running at the configured port.



## Contact

- [MyGitHub](https://github.com/pablo-peralta-cba)
- [LinkedIn](https://www.linkedin.com/in/pablo-federico-peralta)


**Thanks for checking out pablo-peralta-anotaai-test-backend-nodejs!**
