class UserController {

    constructor(userService) {
        this.userService = userService;
    }

    async listAll(request, response) {
        try {
            const users = await this.userService.listAll();
            return response.status(200).json({
                message: 'Lista de usuários registrados',
                data: users
            });
        } catch (error) {
            return response.status(error.statusCode || 500).json({message: error.message});
        }
    }

    async getById(request, response) {
        try {
            const user = await this.userService.getById(request.validatedParamId);
            return response.status(200).json({
                message: 'Usuário encontrado',
                data: user
            });
        } catch (error) {
            return response.status(error.statusCode || 500).json({message: error.message});
        }
    }

    async registerUser(request, response) {
        try {
            const user = await this.userService.registerUser(request.validatedBodyDTOProperties);
            return response.status(201).json({
                message: 'Usuário criado com sucesso',
                data: user
            });
        } catch (error) {
            return response.status(error.statusCode || 500).json({message: error.message});
        }
    }

    async deleteUser(request, response) {
        try {
            await this.userService.deleteUser(request.validatedParamId);
            return response.status(204).send();
        } catch (error) {
            return response.status(error.statusCode || 500).json({message: error.message});
        }
    }

}

export default UserController;