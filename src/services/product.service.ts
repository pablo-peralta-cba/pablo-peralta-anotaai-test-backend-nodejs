import Product, { ProductDocument } from '../models/product.model';
import Category, { CategoryDocument } from '../models/category.model';
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
  ownerId?: string;
  //category?: mongoose.Types.ObjectId | string;
}



export const createProduct = async (productData: CreateProductDTO): Promise<ProductDocument> => {
  try {
    // 1. Fetch the category based on the provided ID
    const category = await Category.findById(productData.category);

    // 2. Check if the category exists
    if (!category) {
      const error = new Error('Category not found.');
      console.error('Error creating product:', error);
      throw error;
    }

    // 3. Verify if the category belongs to the same owner
    if (category.ownerId !== productData.ownerId) {
      const error = new Error('Category does not belong to the same owner.');
      console.error('Error creating product:', error);
      throw error;
    }

    // 4. If the category belongs to the same owner, create the product
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
  updateData: UpdateProductDTO,
  requestingOwnerId: string
): Promise<ProductDocument | null> => {
  try {
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      throw new Error('Product not found.');
    }

    // Verify ownership before allowing updates
    if (existingProduct.ownerId !== requestingOwnerId) {
      throw new Error('You do not have permission to update this product.');
    }

    const updatePayload: Record<string, any> = { ...updateData };

    // If categoryId is being updated, perform ownership check on the new category
    if (updateData.categoryId) {
      const category = await Category.findById(updateData.categoryId);
      if (!category) {
        throw new Error('New category not found.');
      }
      if (category.ownerId !== existingProduct.ownerId) {
        throw new Error('New category does not belong to the same owner.');
      }
  
      updatePayload.category = category._id;
      delete updatePayload.categoryId; // Remove categoryId from the main payload
    }

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


export const deleteProduct = async (productId: string, requestingOwnerId: string): Promise<ProductDocument | null> => {
  try {
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      throw new Error('Product not found.');
    }

    // Verify ownership before allowing deletion
    if (existingProduct.ownerId !== requestingOwnerId) {
      throw new Error('You do not have permission to delete this product.');
    }

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