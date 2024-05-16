import express from "express";
import { AuthService, UserService } from "../services";
import { User } from "../models";
import { AuthController } from "../controllers";
import { ValidateRequest } from "../middlewares";
import { auth_validation_constraints } from "../validations";

const authService = new AuthService();
const userService = new UserService(User);
const controller = new AuthController(authService, userService);

const router = express.Router();
router.post(
  "/login",
  auth_validation_constraints,
  ValidateRequest,
  controller.login.bind(controller)
);
router.post(
  "/register",
  auth_validation_constraints,
  ValidateRequest,
  controller.register.bind(controller)
);
router.post("/refresh", controller.refresh.bind(controller));
router.post("/logout", controller.logout.bind(controller));

export { router as AuthRouter };
