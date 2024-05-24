import { body, cookie, param } from "express-validator";

export const auth_validation_constraints = {
  login: [
    body("email")
      .notEmpty()
      .withMessage("Email must be provided")
      .bail()
      .isEmail()
      .withMessage("Invalid email"),
    body("password")
      .notEmpty()
      .withMessage("Password must be provided")
      .bail()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  refreshToken: [
    cookie("jwt")
      .notEmpty()
      .withMessage(
        "It seems your session has expired, please login and try again"
      )
      .bail()
      .isJWT()
      .withMessage("Invalid token"),
  ],
};
