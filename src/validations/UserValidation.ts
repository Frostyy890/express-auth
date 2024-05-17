import { body, cookie, param } from "express-validator";

export const user_validation_constraints = {
  create: [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .notEmpty()
      .withMessage("Password must be provided")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  getById: [param("id").isMongoId().withMessage("Invalid user id")],
  update: [
    param("id").isMongoId().withMessage("Invalid user id"),
    body("email").optional().isEmail().withMessage("Email must be valid"),
    body("password")
      .optional()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  refresh: [
    cookie("jwt")
      .notEmpty()
      .withMessage("Session expired please login and try again")
      .isJWT()
      .withMessage("Invalid token"),
  ],
};
