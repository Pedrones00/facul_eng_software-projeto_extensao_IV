class ValidateAuthDTO {

    constructor(request) {
        this.validatedBodyDTOProperties = {
            token: request.body.token.trim()
        }
        this.nameValidatedProperties = 'validatedBodyDTOProperties';
    }

    static validate(request) {
        const errors = [];
        const data = request.body;

        if (!data || !data.token || typeof data.token !== 'string') {
            errors.push('Token inválido.');
        }

        return errors;
    }

}

export default ValidateAuthDTO;