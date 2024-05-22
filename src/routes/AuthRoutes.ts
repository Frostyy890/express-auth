import express from "express";
import { AuthService, UserService } from "../services";
import { User } from "../models";
import { AuthController } from "../controllers";
import { ValidateRequest } from "../middlewares";
import { user_validation_constraints } from "../validations";
import AuthFacade from "../facades/AuthFacade";

const authService = new AuthService();
const userService = new UserService(User);
const facade = new AuthFacade(authService, userService);
const controller = new AuthController(facade);

const router = express.Router();
router.post(
  "/login",
  user_validation_constraints.create,
  ValidateRequest,
  controller.login.bind(controller)
);
router.post(
  "/register",
  user_validation_constraints.create,
  ValidateRequest,
  controller.register.bind(controller)
);
router.post(
  "/refresh",
  user_validation_constraints.refresh,
  ValidateRequest,
  controller.refresh.bind(controller)
);
router.post("/logout", controller.logout.bind(controller));

export { router as AuthRouter };
