class ResponseAuthDebugDTO {
    constructor(object) {
        this.orignal_token = object.token;
        this.token_payload = object.payload;
    }
}

export default ResponseAuthDebugDTO;