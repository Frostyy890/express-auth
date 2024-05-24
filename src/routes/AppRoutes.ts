import express from "express";
import { UserRouter } from "./UserRoutes";
import { AuthRouter } from "./AuthRoutes";
import { AuthGuard } from "../middlewares";
import { Roles } from "../config/roles";

const authGuard = new AuthGuard();
const router = express.Router();
router.use(
  "/users",
  authGuard.verifyToken,
  authGuard.verifyRoles([Roles.ADMIN, Roles.MANAGER]),
  UserRouter
);
router.use("/auth", AuthRouter);
export { router as AppRouter };
