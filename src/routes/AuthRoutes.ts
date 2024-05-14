import express from "express";
import { AuthService, UserService } from "../services";
import { User } from "../models";
import { AuthController } from "../controllers";

const authService = new AuthService();
const userService = new UserService(User);
const controller = new AuthController(authService, userService);

const router = express.Router();
router.post("/login", controller.login.bind(controller));
router.post("/register", controller.register.bind(controller));

export { router as AuthRouter };
