import express from "express";
import { createProductController, deleteProductController, deleteProductImageController, getAllProductsController, getSingleProductController, productReviewController, updateProductController, updateProductImageController } from "../controllers/productController.js";
import { isAdmin, isAuth } from "../middlewares/authMiddlewares.js";
import { singleUpload } from "../middlewares/multer.js";

const router=express.Router();


router.get('/get-all',getAllProductsController)
router.get("/top",getAllProductsController)
router.get('/:id',getSingleProductController)
router.post("/create",isAuth,isAdmin,singleUpload,createProductController)
router.put("/:id",isAuth,isAdmin,updateProductController)
router.put("/image/:id",isAuth,isAdmin,singleUpload,updateProductImageController)
router.delete("/delete-image/:id",isAuth,isAdmin,deleteProductImageController)
router.delete("/delete/:id",isAuth,isAdmin,deleteProductController)
router.put("/:id/review",isAuth,productReviewController)


export default router
