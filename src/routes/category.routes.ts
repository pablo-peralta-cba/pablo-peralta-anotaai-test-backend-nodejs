import express, { Request, Response } from 'express';
import * as CategoryController from '../controllers/category.controller';

import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../services/category.service'; // Import request body types

const router = express.Router();

// Define category routes

// Create a new category
router.post('/categories', async (req: Request<{}, {}, CreateCategoryRequest>, res: Response) => { 
});

// Update an existing category
router.put('/categories/:categoryId', async (req: Request<{ categoryId: string }, {}, UpdateCategoryRequest>, res: Response) => { 
  await CategoryController.updateCategory(req, res);
});

// Delete a category
router.delete('/categories/:categoryId', async (req: Request<{ categoryId: string }>, res: Response) => { 
  await CategoryController.deleteCategory(req, res);
});

// Get a single category by ID 
router.get('/categories/:categoryId', async (req: Request<{ categoryId: string }>, res: Response) => {
  await CategoryController.getCategoryById(req, res);
});

// Get all categories 
router.get('/categories', async (req: Request, res: Response) => {
  await CategoryController.getAllCategories(req, res);
});

export default router;