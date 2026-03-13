class LoginAuthDTO {

    constructor(request) {
        this.validatedBodyDTOProperties = {
            userEmail: String(request.body.user_email).trim(),
            userPwd: String(request.body.user_pwd).trim()
        };
        this.nameValidatedProperties = 'validatedBodyDTOProperties';
    }

    static validateMail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static validate(request) {
        const errors = [];
        const data = request.body;

        if (!data) {
            return errors.push("Sem dados para cadastrar o usuário");
        }

        if (!data.user_email || !this.validateMail(data.user_email)) {
            errors.push("Email inválido ou ausente");
        }

        if (!data.user_pwd || String(data.user_pwd).trim().length === 0) {
            errors.push("Senha inválida");
        }
        
        return errors;
    }

}

export default LoginAuthDTO;