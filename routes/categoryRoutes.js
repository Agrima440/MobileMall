import express from "express";
import { isAdmin, isAuth } from "../middlewares/authMiddlewares.js";
// import { singleUpload } from "../middlewares/multer.js";
import { createCategory, deleteCategoryController, getAllCategoriesController, updatedCategoriesController } from "../controllers/categoryController.js";
// import { updateProductController } from "../controllers/productController.js";

const router=express.Router();


router.post('/create',isAuth,isAdmin,createCategory)
router.get('/get-all',getAllCategoriesController)
router.delete('/delete/:id',deleteCategoryController)
router.put("/update/:id",isAuth,isAdmin,updatedCategoriesController)


export default router
