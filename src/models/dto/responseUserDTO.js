class ResponseUserDTO {
    constructor(object) {
        this.user_id = object.id;
        this.user_email = object.userEmail;
    }
}

export default ResponseUserDTO;