import express from "express";
import { UserRouter } from "./UserRoutes";

const router = express.Router();
router.use("/users", UserRouter );
export { router as AppRouter };
