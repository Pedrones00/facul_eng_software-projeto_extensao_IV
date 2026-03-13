import initController from '../controllers/index.js';
import initUserRoute from './userRoute.js';
import initAuthRoute from './authRoute.js';

export default async (expressApp) => {

    const { authController, userController } = await initController();

    const userRoutes = await initUserRoute(userController);
    const authRoutes = await initAuthRoute(authController);

    expressApp.use(userRoutes);
    expressApp.use(authRoutes);
}