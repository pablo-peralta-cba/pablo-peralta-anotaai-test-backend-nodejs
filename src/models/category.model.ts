import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the Category document
export interface CategoryDocument extends Document {
  title: string;
  description?: string; 
  ownerId: string; 
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema for the Category model
const CategorySchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    ownerId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

// Create the Category model
const Category = mongoose.model<CategoryDocument>('Category', CategorySchema);

export default Category;