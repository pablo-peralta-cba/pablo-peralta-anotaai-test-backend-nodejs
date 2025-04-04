import express, { Request, Response } from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getProductsByOwner,
  UpdateProductRequest,
  UpdateProductCategoryRequest,
  CreateProductRequest
} from '../controllers/product.controller';


const router = express.Router();

// Define product routes

// Register a product
router.post('/products', async (req: Request<{}, {}, CreateProductRequest>, res: Response) => { 
  await createProduct(req, res);
});

// Update the data of a product
router.put('/products/:productId', async (req: Request<{ productId: string }, {}, UpdateProductRequest>, res: Response) => { 
  await updateProduct(req, res);
});

// Delete a product
router.delete('/products/:productId', async (req: Request<{ productId: string }>, res: Response) => { 
  await deleteProduct(req, res);
});


// Get a single product by ID (Example)
router.get('/products/:productId', async (req: Request<{ productId: string }>, res: Response) => {
  await getProductById(req, res);
});

// Get all products for a specific owner (Example)
router.get('/products', async (req: Request, res: Response) => {
  await getProductsByOwner(req, res);
});

export default router;
