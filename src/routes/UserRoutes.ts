import express from "express";
import { User } from "../models";
import { UserService } from "../services";
import { UserController } from "../controllers";

const userService = new UserService(User);
const controller = new UserController(userService);

const router = express.Router();
router
  .get("/", controller.getAll.bind(controller))
  .get("/:id", controller.getById.bind(controller))
  .get("/:attribute/:value", controller.getByAttribute.bind(controller))
  .post("/", controller.create.bind(controller))
  .patch("/:id", controller.update.bind(controller))
  .delete("/:id", controller.delete.bind(controller));
export { router as UserRouter };
