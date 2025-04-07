import { Request, Response } from 'express';
import * as CategoryService from '../services/category.service';
import { CategoryDocument } from '../models/category.model';
import { CreateCategoryRequest, UpdateCategoryRequest } from '../services/category.service';


export const createCategory = async (req: Request<{}, {}, CreateCategoryRequest>, res: Response) => {
  try {
    const { title, description, ownerId } = req.body;
    const category = await CategoryService.createCategory({ title, description, ownerId });
    res.status(201).json(category);
  } catch (error: any) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: error.message || 'Could not create category' });
  }
};

export const updateCategory = async (req: Request<{ categoryId: string }, {}, UpdateCategoryRequest>, res: Response) => {
  try {
    const { categoryId } = req.params;
    const updateData = req.body;
    const requestingOwnerId = req.body.ownerId;

    if (!requestingOwnerId) {
      return res.status(401).json({ message: 'Unauthorized: Owner ID required for update.' });
    }

    const updatedCategory = await CategoryService.updateCategory(categoryId, updateData, requestingOwnerId);
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(updatedCategory);
  } catch (error: any) {
    console.error('Error updating category:', error);
    if (error.message === 'Category not found.') {
      return res.status(404).json({ message: error.message });
    } else if (error.message === 'You do not have permission to update this category.') {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: error.message || 'Could not update category' });
  }
};



export const deleteCategory = async (req: Request<{ categoryId: string }, {}, { ownerId?: string }>, res: Response) => {
  try {
    const { categoryId } = req.params;
    const requestingOwnerId = req.body.ownerId; // Insecure - replace with auth later

    if (!requestingOwnerId) {
      return res.status(401).json({ message: 'Unauthorized: Owner ID required to delete.' });
    }

    const deletedCategory = await CategoryService.deleteCategory(categoryId, requestingOwnerId);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(204).send(); // 204 No Content
  } catch (error: any) {
    console.error('Error deleting category:', error);
    if (error.message === 'Category not found.') {
      return res.status(404).json({ message: error.message });
    } else if (error.message === 'You do not have permission to delete this category.') {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: error.message || 'Could not delete category' });
  }
};

export const getCategoryById = async (req: Request<{ categoryId: string }>, res: Response) => {
  try {
    const { categoryId } = req.params;
    const category = await CategoryService.getCategoryById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error: any) {
    console.error('Error getting category by ID:', error);
    res.status(500).json({ message: error.message || 'Could not get category' });
  }
};

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await CategoryService.getAllCategories();
    res.json(categories);
  } catch (error: any) {
    console.error('Error getting all categories:', error);
    res.status(500).json({ message: error.message || 'Could not get categories' });
  }
};

