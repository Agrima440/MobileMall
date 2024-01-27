import express from "express";
import { isAdmin, isAuth } from "../middlewares/authMiddlewares.js";
import { changeOrderStatusController, createOrderController, getAllOrdersController, getMyOrdersController, paymentsController, singleOrderDetailsController } from "../controllers/orderController.js";


const router=express.Router();


router.post('/create',isAuth,isAdmin,createOrderController)
router.get("/my-orders",isAuth,isAdmin,getMyOrdersController)
router.get("/my-orders/:id",isAuth,isAdmin,singleOrderDetailsController)
router.post("/payments",isAuth,isAdmin,paymentsController)
router.get("/admin/get-all-orders",isAuth,isAdmin,getAllOrdersController)
router.put("/admin/order/:id",isAuth,isAdmin,changeOrderStatusController)

export default router
