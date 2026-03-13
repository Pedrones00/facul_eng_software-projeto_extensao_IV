class ResponseAuthDTO {
    constructor(token) {
        this.acess_token = token;
        this.token_type = 'Bearer';
    }
}

export default ResponseAuthDTO;