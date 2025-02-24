import express from 'express';
import hasAuthorization from 'middlewares/hasAuthorization';
import { UserController } from 'controllers/UserController';
import { UserService } from 'controllers/UserService';

const router = express.Router();

const userService = new UserService();
const userController = new UserController(userService);

router.get(
  '/:userId',
  hasAuthorization,
  userController.getUserById.bind(userController),
);

router.get(
  '/:userId/profile',
  hasAuthorization,
  userController.readUserProfile.bind(userController),
);

router.get(
  '/',
  hasAuthorization,
  userController.getAllUsers.bind(userController),
);

router.put(
  '/:userId',
  hasAuthorization,
  userController.updateUserById.bind(userController),
);

router.delete(
  '/:userId',
  hasAuthorization,
  userController.deleteUserById.bind(userController),
);

export default router;
