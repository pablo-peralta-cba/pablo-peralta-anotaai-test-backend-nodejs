

import Product, { ProductDocument } from '../models/product.model';
import { sendMessageToSQS } from './aws/sqs.service';
import mongoose from 'mongoose';

export interface CreateProductDTO {
  title: string;
  description?: string;
  price: number;
  ownerId: string;
  category: mongoose.Types.ObjectId;
}

export interface UpdateProductDTO {
  title?: string;
  description?: string;
  price?: number;
  categoryId?: string;
}



export const createProduct = async (productData: CreateProductDTO): Promise<ProductDocument> => {
  try {
    const product = new Product(productData);
    const savedProduct = await product.save();
    if (savedProduct) {
      await sendMessageToSQS({
        entityType: 'product',
        entityId: savedProduct.id.toString(),
        ownerId: savedProduct.ownerId,
      });
    }
    return savedProduct;
  } catch (error: any) {
    console.error('Error creating product in service:', error);
    throw error;
  }
};

export const updateProduct = async (
  productId: string,
  updateData: UpdateProductDTO
): Promise<ProductDocument | null> => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });
    if (updatedProduct) {
      await sendMessageToSQS({
        entityType: 'product',
        entityId: updatedProduct.id,
        ownerId: updatedProduct.ownerId,
      });
    }
    return updatedProduct;
  } catch (error: any) {
    console.error('Error updating product in service:', error);
    throw error;
  }
};

export const deleteProduct = async (productId: string): Promise<ProductDocument | null> => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (deletedProduct) {
      await sendMessageToSQS({
        entityType: 'product',
        entityId: deletedProduct.id,
        ownerId: deletedProduct.ownerId,
      });
    }
    return deletedProduct;
  } catch (error: any) {
    console.error('Error deleting product in service:', error);
    throw error;
  }
};

export const getProductById = async (productId: string): Promise<ProductDocument | null> => {
  try {
    return await Product.findById(productId);
  } catch (error: any) {
    console.error('Error getting product by ID in service:', error);
    throw error;
  }
};

export const getProductsByOwner = async (ownerId: string): Promise<ProductDocument[]> => {
  try {
    return await Product.find({ ownerId }).populate('category');
  } catch (error: any) {
    console.error('Error getting products by owner in service:', error);
    throw error;
  }
};