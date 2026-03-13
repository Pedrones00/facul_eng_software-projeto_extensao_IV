import initModels from '../models/entity/index.js';
import UserService from './userService.js';
import AuthService from './authService.js';

export default async () => {

    const { User } = await initModels();

    const userService = new UserService(User);
    const authService = new AuthService(User);

    await authService.init();

    return {
        userService,
        authService
    }
}