import express from "express"
import {getUserProfileController, loginContainer, logoutController, passwordResetController, registerController, updatePasswordController, updateProfileController, updateProfilePicController} from "../controllers/userController.js"
import {isAuth}  from "../middlewares/authMiddlewares.js"
import {singleUpload} from "../middlewares/multer.js"
import {rateLimit} from "express-rate-limit"

// RATE LIMITER
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Use an external store for consistency across multiple server instances.
});



const  router=express.Router()

// routes
router.post("/register",limiter,registerController) 
router.post("/login",limiter,loginContainer)
router.get("/profile",isAuth,getUserProfileController)
router.get("/logout",isAuth,logoutController)
router.put("/update-profile",isAuth,updateProfileController)
router.put("/update-password", isAuth,updatePasswordController)
router.put("/update-picture",isAuth,singleUpload,updateProfilePicController)
router.post("/reset-password",passwordResetController)



export default router;

