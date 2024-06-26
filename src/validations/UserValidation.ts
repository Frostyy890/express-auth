import { body, param } from "express-validator";
import { Roles } from "../config/roles";

export const user_validation_constraints = {
  create: [
    body("email")
      .notEmpty()
      .withMessage("must be provided")
      .bail()
      .isEmail()
      .withMessage("must be valid"),
    body("password")
      .notEmpty()
      .withMessage("must be provided")
      .bail()
      .isLength({ min: 6 })
      .withMessage("must be at least 6 characters long"),
    body("roles").isArray().withMessage("must be an array"),
    body("roles.*").isIn(Object.values(Roles)).withMessage("Invalid role"),
  ],
  objectId: [param("id").isMongoId().withMessage("Invalid user id")],
  update: [
    param("id").isMongoId().withMessage("Invalid user id"),
    body("email").optional().isEmail().withMessage("must be valid"),
    body("password")
      .optional()
      .isLength({ min: 6 })
      .withMessage("must be at least 6 characters long"),
    body("roles").optional().isArray().withMessage("must be an array"),
    body("roles.*")
      .optional()
      .isIn(Object.values(Roles))
      .withMessage("Invalid role"),
  ],
};
