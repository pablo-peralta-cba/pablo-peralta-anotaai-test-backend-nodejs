
import Category, { CategoryDocument } from '../models/category.model';
import Product from '../models/product.model';
import { sendMessageToSQS } from './aws/sqs.service';
import logger from '../config/logger';


// Define types for request bodies
export interface CreateCategoryRequest {
  title: string;
  description?: string;
  ownerId?: string;
}

export interface UpdateCategoryRequest {
  title?: string;
  description?: string;
  ownerId?: string;
}

export const createCategory = async (categoryData: CreateCategoryRequest): Promise<CategoryDocument> => {
  try {
    logger.info(`Creating category: ${categoryData.title} for owner: ${categoryData.ownerId}`);
    const category = new Category(categoryData);
    const savedCategory = await category.save();
    logger.info(`Category created successfully: ${savedCategory.id}`);
    if (savedCategory) {
      await sendMessageToSQS({ entityType: 'category', entityId: savedCategory.id, ownerId: savedCategory.ownerId });
      logger.info(`SQS message sent for category creation: ${savedCategory.id}`);
    }
    return savedCategory;
  } catch (error: any) {
    logger.error('Error creating category in service:', error);
    throw error;
  }
};

export const updateCategory = async (
  categoryId: string,
  updateData: UpdateCategoryRequest,
  requestingOwnerId: string
): Promise<CategoryDocument | null> => {
  try {
    logger.info(`Updating category with ID: ${categoryId} by owner: ${requestingOwnerId}`);
    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory) {
      logger.warn(`Category with ID: ${categoryId} not found.`);
      return null;
    }
// Verify ownership
if (existingCategory.ownerId !== requestingOwnerId) {
  throw new Error('You do not have permission to update this category.');
} 
    const updatedCategory = await Category.findByIdAndUpdate(categoryId, updateData, { new: true });
    if (updatedCategory) {
      logger.info(`Category updated successfully: ${updatedCategory.id}`);
      await sendMessageToSQS({ entityType: 'category', entityId: updatedCategory.id, ownerId: updatedCategory.ownerId });
      logger.info(`SQS message sent for category update: ${updatedCategory.id}`);
    }
    return updatedCategory;
  } catch (error: any) {
    logger.error('Error updating category in service:', error);
    throw error;
  }
};



export const deleteCategory = async (categoryId: string, requestingOwnerId: string): Promise<CategoryDocument | null> => {
  try {
    logger.info(`Deleting category with ID: ${categoryId} by owner: ${requestingOwnerId}`);

    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory) {
      logger.warn(`Category with ID: ${categoryId} not found for deletion.`);
      return null;
    }

    // Verify ownership before allowing deletion
    if (existingCategory.ownerId !== requestingOwnerId) {
      throw new Error('You do not have permission to delete this category.');
    }

    // Find all products associated with this category
    logger.info(`Finding products associated with category ID: ${categoryId}`);
    const productsToDelete = await Product.find({ category: categoryId });
    logger.info(`Found ${productsToDelete.length} products to delete.`);

    if (productsToDelete.length > 0) {
      // Delete those products
      const deleteProductResult = await Product.deleteMany({ category: categoryId });
      logger.info(`Deleted ${deleteProductResult.deletedCount} products associated with category ID: ${categoryId}`);
    }

    // Now delete the category
    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (deletedCategory) {
      logger.info(`Category deleted successfully: ${deletedCategory.id}`);
      await sendMessageToSQS({
        entityType: 'category',
        entityId: deletedCategory.id,
        ownerId: deletedCategory.ownerId,
      });
      logger.info(`SQS message sent for category deletion: ${deletedCategory.id}`);
    }
    return deletedCategory;
  } catch (error: any) {
    logger.error('Error deleting category in service:', error);
    throw error;
  }
};

export const getCategoryById = async (categoryId: string): Promise<CategoryDocument | null> => {
  try {
    logger.info(`Getting category by ID: ${categoryId}`);
    return await Category.findById(categoryId);
  } catch (error: any) {
    logger.error('Error getting category by ID in service:', error);
    throw error;
  }
};

export const getAllCategories = async (ownerId?: string): Promise<CategoryDocument[]> => {
  try {
    logger.info(`Getting all categories. Owner ID provided: ${ownerId}`);
    const query = ownerId ? { ownerId: ownerId } : {}; // If ownerId is provided, filter by it
    const categories = await Category.find(query);
    logger.info(`Found ${categories.length} categories.`);
    return categories;
  } catch (error: any) {
    logger.error('Error getting all categories in service:', error);
    throw error;
  }
};

