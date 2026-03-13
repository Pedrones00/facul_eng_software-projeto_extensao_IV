class ParamsIdDTO {

    constructor(request) {
        this.validatedParamId = request.params.id;
        this.nameValidatedProperties = 'validatedParamId';
    }

    static validate(request) {
        const errors = [];
        const data = request.params.id;

        if (!data || isNaN(data)) {
            errors.push('O id deve ser numérico');
        }

        return errors;
    }

}

export default ParamsIdDTO;