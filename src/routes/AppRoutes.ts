import express from "express";
import { UserRouter } from "./UserRoutes";
import { AuthRouter } from "./AuthRoutes";
import { AuthGuard } from "../middlewares";

const router = express.Router();
router.use("/users", AuthGuard, UserRouter);
router.use("/auth", AuthRouter);
export { router as AppRouter };
