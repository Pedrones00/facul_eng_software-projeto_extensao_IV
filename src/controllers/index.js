import initService from '../services/index.js';
import UserController from './userController.js';
import AuthController from './authController.js';

export default async() => {
    const { userService, authService } = await initService();

    const userController = new UserController(userService);
    const authController = new AuthController(authService);

    return {
        userController,
        authController
    }
}