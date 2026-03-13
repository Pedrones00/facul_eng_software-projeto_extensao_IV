class AuthController {
    constructor(authService) {
        this.authService = authService;
    }

    async loginUser(request, response) {
        try {
            const loginResponse = await this.authService.loginUser(request.validatedBodyDTOProperties);
            return response.status(200).json({
                message: 'Usuário logado com sucesso.',
                data: loginResponse
            });
        } catch (error) {
            return response.status(error.statusCode || 500).json({message: error.message});
        }
    }

    async validateToken(request, response) {
        try {
            const token = await this.authService.validateToken(request.validatedBodyDTOProperties);
            return response.status(200).json({
                message: 'Token está válido',
                data: token
            });
        } catch (error) {
            return response.status(error.statusCode || 500).json({message: error.message});
        }
    }
}

export default AuthController;