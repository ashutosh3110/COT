const express=require("express");
const router=express.Router();
const routeController=require("../controller/routeController");


router.get("/health",routeController.getData);
router.post("/register",routeController.registerUser);
router.post("/login",routeController.login);
router.post("/refresh-token",routeController.refreshToken);






module.exports=router;




