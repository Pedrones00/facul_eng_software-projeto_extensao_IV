import express from 'express';
import ValidationMiddleware from '../middlewares/validationMiddleware.js';
import LoginAuthDTO from '../models/dto/loginAuthDTO.js';
import ValidateAuthDTO from '../models/dto/validateAuthDTO.js';

export default async (authController) => {

    const routes = express.Router();

    routes.post(
        '/login',
        ValidationMiddleware.validate(LoginAuthDTO),
        async (request, response) => authController.loginUser(request, response)
    );
    routes.post(
        '/validate',
        ValidationMiddleware.validate(ValidateAuthDTO),
        async (request, response) => authController.validateToken(request, response)
    );

    return routes;

};