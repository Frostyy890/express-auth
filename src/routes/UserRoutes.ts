import express from "express";
import { User } from "../models";
import { UserService } from "../services";
import { UserController } from "../controllers";
import { user_validation_constraints } from "../validations";
import { AuthGuard, ValidateRequest } from "../middlewares";
import { Permissions } from "../config/roles";
import { UserRepository } from "../repositories";

const userRepository = new UserRepository(User);
const userService = new UserService(userRepository);
const controller = new UserController(userService);
const authGuard = new AuthGuard();

const router = express.Router();
router
  .get("/", controller.getAll.bind(controller))
  .get(
    "/:id",
    user_validation_constraints.objectId,
    ValidateRequest,
    controller.getById.bind(controller)
  )
  .get("/:attribute/:value", controller.getByAttribute.bind(controller))
  .post(
    "/",
    user_validation_constraints.create,
    ValidateRequest,
    controller.create.bind(controller)
  )
  .patch(
    "/:id",
    user_validation_constraints.update,
    ValidateRequest,
    controller.update.bind(controller)
  )
  .delete(
    "/:id",
    authGuard.verifyPermissions(Permissions.DELETE),
    user_validation_constraints.objectId,
    ValidateRequest,
    controller.delete.bind(controller)
  );
export { router as UserRouter };
