import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the Product document
export interface ProductDocument extends Document {
  title: string;
  description?: string; // Optional description
  price: number;
  category: mongoose.Types.ObjectId; // Reference to the Category model
  ownerId: string; 
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

// Define the schema for the Product model
const ProductSchema: Schema = new Schema(
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
    price: {
      type: Number,
      required: true,
      min: 0, // Ensure price is not negative
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category', // Name of the Category model
      required: true,
    },
    ownerId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the Product model
const Product = mongoose.model<ProductDocument>('Product', ProductSchema);

export default Product;