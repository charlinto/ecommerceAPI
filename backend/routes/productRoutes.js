import express  from "express";
const router = express.Router();
import { getProductById, getProducts,  deleteProduct, createProduct, updateProduct, createProductReview, getTopProducts }  from '../controller/productController.js'
import { protect,admin   } from '../middleware/authMiddleware.js'

//@desc Fetch all products
//@route Get/api/products
//@access Fetch all products 
router.route('/').get(getProducts).post(protect, admin, createProduct) 
router.route('/:id/reviews').post(protect, createProductReview)
router.get('/top', getTopProducts)
//@desc Fetch single products
//@route Get/api/products/:id
//@access Fetch all products 
router.route('/:id').get(getProductById).put(protect, admin, updateProduct)

//@desc Delete products
//@route Delete/api/products/:id
//@access Delete all products 
router.route('/:id').delete(protect, admin, deleteProduct)


export default router    