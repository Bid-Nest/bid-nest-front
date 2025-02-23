import express from 'express';
import hasAuthorization from 'middlewares/hasAuthorization';

const router = express.Router();
import UserController from 'controllers/UserController';

app.get('/user/:userId', UserController.getUserById);
app.get('/user/:userId/profile', UserController.readUserProfile);
app.get('/users', UserController.getAllUsers);
app.put('/user/:userId', UserController.updateUserById);
app.delete('/user/:userId', UserController.deleteUserById);
app.use(UserController.isSeller);
