import express from "express";
import { AuthService, UserService } from "../services";
import { User } from "../models";
import { AuthController } from "../controllers";
import { ValidateRequest } from "../middlewares";
import { auth_validation_constraints } from "../validations";
import { AuthFacade } from "../facades";

const authService = new AuthService();
const userService = new UserService(User);
const facade = new AuthFacade(authService, userService);
const controller = new AuthController(facade);

const router = express.Router();
router.post(
  "/login",
  auth_validation_constraints.login,
  ValidateRequest,
  controller.login.bind(controller)
);
router.post(
  "/register",
  auth_validation_constraints.login,
  ValidateRequest,
  controller.register.bind(controller)
);
router.post(
  "/refresh",
  auth_validation_constraints.refreshToken,
  ValidateRequest,
  controller.refresh.bind(controller)
);
router.post("/logout", controller.logout.bind(controller));

export { router as AuthRouter };
