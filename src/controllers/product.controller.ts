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
    if (error.message === 'Category not found.') {
      return res.status(400).json({ message: error.message });
    } else if (error.message === 'Category does not belong to the same owner.') {
      return res.status(400).json({ message: error.message });
    }
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
    const requestingOwnerId = req.body.ownerId;

    if (!requestingOwnerId) {
      return res.status(401).json({ message: 'Unauthorized: Owner ID required for update.' });
    }
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No data provided for update' });
    }

    const updatedProduct = await ProductService.updateProduct(productId, updateData, requestingOwnerId);

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json(updatedProduct);

  } catch (error: any) {
    console.error('Error updating product:', error);
    if (error.message === 'Product not found.' || error.message === 'New category not found.') {
      return res.status(404).json({ message: error.message });
    } else if (error.message === 'You do not have permission to update this product.' || error.message === 'New category does not belong to the same owner.') {
      return res.status(403).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message || 'Could not update product' });
  }
};


export const deleteProduct = async (req: Request<{ productId: string }, {}, { ownerId?: string }>, res: Response) => {
  try {
    const { productId } = req.params;
    const requestingOwnerId = req.body.ownerId;

    if (!requestingOwnerId) {
      return res.status(401).json({ message: 'Unauthorized: Owner ID required to delete.' });
    }

    const deletedProduct = await ProductService.deleteProduct(productId, requestingOwnerId);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting product:', error);
    if (error.message === 'Product not found.') {
      return res.status(404).json({ message: error.message });
    } else if (error.message === 'You do not have permission to delete this product.') {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: error.message || 'Could not delete product' });
  }
};



// Get a single product by ID
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