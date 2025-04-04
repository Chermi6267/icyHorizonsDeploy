import { Router } from "express";
export const userRouter = Router();
import { UserController } from "../controllers/User";
import { check } from "express-validator";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { multerMiddleware } from "../middlewares/multerUser";

const userController = new UserController();
userRouter.get("/groups", userController.getUserGroups);

userRouter.get("/:id", userController.getUserDataById);
userRouter.get("/", isAuthenticated, userController.getUserData);

userRouter.put(
  "/name",
  isAuthenticated,
  [check("name", "Имя пользователя не может быть пустым").notEmpty()],
  userController.changeName
);

userRouter.put(
  "/avatar",
  isAuthenticated,
  multerMiddleware,
  userController.changeAvatar
);

userRouter.get("/avatar/:imageName", userController.getAvatar);

userRouter.put(
  "/header",
  isAuthenticated,
  multerMiddleware,
  userController.changeHeader
);

userRouter.put(
  "/group",
  isAuthenticated,
  [
    check("newGroupId", "Некорректный id пользовательской группы(new)")
      .notEmpty()
      .isNumeric(),
  ],
  userController.changeUserGroup
);

userRouter.get("/header/:imageName", userController.getHeader);
