import { Request, Response } from 'express';
import * as ProductService from '../services/product.service';
import { ProductDocument } from '../models/product.model';
import { UpdateProductDTO } from '../services/product.service';
import { CategoryDocument } from '../models/category.model'; // Import if needed for association
import mongoose from 'mongoose';

// Define types for request bodies to ensure type safety
export interface CreateProductRequest {
  title: string;
  description?: string;
  price: number;
  ownerId: string;
  category: mongoose.Types.ObjectId
}

export interface UpdateProductRequest {
  title?: string;
  description?: string;
  price?: number;
}

export interface UpdateProductCategoryRequest {
  categoryId: string;
}

export const createProduct = async (req: Request<{}, {}, CreateProductRequest>, res: Response) => {
  try {
    const { title, description, price, ownerId, category } = req.body;
    const product = await ProductService.createProduct({ title, description, price, ownerId, category });
    res.status(201).json(product);
  } catch (error: any) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: error.message || 'Could not create product' });
  }
};


export const updateProduct = async (
  req: Request<{ productId: string }, {}, UpdateProductDTO>,
  res: Response
): Promise<Response<ProductDocument | null>> => {
  try {
    const { productId } = req.params;
    const updateData: UpdateProductDTO = req.body;

    // Validate that there is something to update (optional, but good practice)
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No data provided for update' });
    }

    // Update the product, including potentially the category
    const updatedProduct = await ProductService.updateProduct(productId, updateData);

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json(updatedProduct);

  } catch (error: any) {
    console.error('Error updating product:', error);
    return res.status(500).json({ message: error.message || 'Could not update product' });
  }
};

export const deleteProduct = async (req: Request<{ productId: string }>, res: Response) => {
  try {
    const { productId } = req.params;
    const deletedProduct = await ProductService.deleteProduct(productId);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(204).send(); // 204 No Content
  } catch (error: any) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: error.message || 'Could not delete product' });
  }
};



// Example: Get a single product by ID
export const getProductById = async (req: Request<{ productId: string }>, res: Response) => {
  try {
    const { productId } = req.params;
    const product = await ProductService.getProductById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error: any) {
    console.error('Error getting product by ID:', error);
    res.status(500).json({ message: error.message || 'Could not get product' });
  }
};

// Example: Get all products for a specific owner
export const getProductsByOwner = async (req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined> => {
  try {
    const ownerId = req.query.ownerId as string;
    if (!ownerId) {
      return res.status(400).json({ message: 'Owner ID is required' });
    }
    const products = await ProductService.getProductsByOwner(ownerId);
    res.json(products);
  } catch (error: any) {
    console.error('Error getting products by owner:', error);
    res.status(500).json({ message: error.message || 'Could not get products' });
  }
};