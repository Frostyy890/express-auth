import { body } from "express-validator";

export const auth_validation_constraints = [
  body("email").isEmail().withMessage("Email must be valid"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password must be provided")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];
