import express from 'express';
import ValidationMiddleware from '../middlewares/validationMiddleware.js';
import CreateUserDTO from '../models/dto/createUserDTO.js';
import ParamsIdDTO from '../models/dto/paramsIdDTO.js';

export default async (userController) => {

    const routes = express.Router();

    routes.get(
        '/users',
        async (request, response) => userController.listAll(request, response)
    );
    routes.get(
        '/users/:id',
        ValidationMiddleware.validate(ParamsIdDTO),
        async (request, response) => userController.getById(request, response)
    )
    routes.post(
        '/users',
        ValidationMiddleware.validate(CreateUserDTO),
        async (request, response) => userController.registerUser(request, response)
    );
    routes.delete(
        '/users/:id',
        ValidationMiddleware.validate(ParamsIdDTO),
        async (request, response) => userController.deleteUser(request, response)
    );

    return routes;

};