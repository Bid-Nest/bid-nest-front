import express from 'express';
import AuthController from '../controllers/authController';
const router = express.Router();

router.post('/register', AuthController.register);
// router.post('/login', controllers.auth.login);

export default router;
