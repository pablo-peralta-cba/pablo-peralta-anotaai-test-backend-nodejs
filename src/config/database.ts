import mongoose from 'mongoose';

const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  throw new Error("MONGO_URI environment variable is not defined!");
}

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully!');
  } catch (err: any) {
    console.error('MongoDB connection error:', err);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;