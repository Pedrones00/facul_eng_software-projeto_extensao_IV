import bcrypt from 'bcrypt';
import fs from 'fs';
import { importPKCS8, importSPKI, SignJWT, CompactEncrypt,jwtVerify, compactDecrypt } from 'jose';
import ThrowError from "../utils/throwError.js";
import ResponseAuthDTO from '../models/dto/responseAuthDTO.js';
import ResponseAuthDebugDTO from '../models/dto/responseAuthDebugDTO.js';

class AuthService {
    constructor(userModel, saltRounds = 10) {
        this.userModel = userModel;
        this.saltRounds = saltRounds;
        this.expiresIn = '1h';
    }

    async init() {
        this.signPublicKey  = await this.#readSignPublicKey('./keys/sign-public.pem');
        this.signPrivateKey = await this.#readSignPrivateKey('./keys/sign-private.pem');
        this.encPublicKey   = await this.#readEncPublicKey('./keys/enc-public.pem');
        this.encPrivateKey  = await this.#readEncPrivateKey('./keys/enc-private.pem');
    }

    async #readSignPublicKey(path) {
        const signPublicKey = fs.readFileSync(path, 'utf8');

        return await importSPKI(
            signPublicKey,
            'RS256'
        );
    }

    async #readSignPrivateKey(path) {
        const signPrivateKey = fs.readFileSync(path, 'utf8');

        return await importPKCS8(
            signPrivateKey,
            'RS256'
        );
    }

    async #readEncPublicKey(path) {
        const encPublicKey = fs.readFileSync(path, 'utf8');

        return await importSPKI(
            encPublicKey,
            'RSA-OAEP-256'
        )
    }

    async #readEncPrivateKey(path) {
        const encPrivateKey = fs.readFileSync(path, 'utf8');

        return await importPKCS8(
            encPrivateKey,
            'RSA-OAEP-256'
        )
    }

    async #validateUser(userEmail, userPwd) {
        const user = await this.userModel.findOne({
            where: {userEmail: userEmail}
        });
        if (!user) ThrowError.throwError(401, 'Usuário ou senha estão errados.');

        const isPwdValid = await bcrypt.compare(userPwd, user.pwdHash);
        if (!isPwdValid) ThrowError.throwError(401, 'Usuário ou senha estão errados.');

        return user;
    }

    async #generateToken(userEntity) {
        const payload = {
            user: userEntity.userEmail,
            userPwdHash: userEntity.pwdHash
        }

        const signJWT = await new SignJWT(payload)
                                .setProtectedHeader({
                                    alg: 'RS256',
                                    typ: 'JWT'
                                })
                                .setExpirationTime(this.expiresIn)
                                .sign(this.signPrivateKey);

        const encryptedJWT = await new CompactEncrypt(new TextEncoder().encode(signJWT))
                                    .setProtectedHeader({
                                        alg: 'RSA-OAEP-256',
                                        enc: 'A256GCM',
                                        cty: 'JWT'
                                    })
                                    .encrypt(this.encPublicKey);

        return encryptedJWT;
    }

    async #validateToken(token) {
        try {
            const { plaintext } = await compactDecrypt(token, this.encPrivateKey);
            const signToken = new TextDecoder().decode(plaintext);

            const {payload} = await jwtVerify(signToken, this.signPublicKey);

            return payload;
        } catch (error) {
            ThrowError.throwError(401, 'Invalid token');   
        }
    }

    async loginUser(data) {
        const {userEmail, userPwd} = data;

        const user = await this.#validateUser(userEmail, userPwd);

        const encryptedJWT = await this.#generateToken(user);

        return new ResponseAuthDTO(encryptedJWT);
    }

    async validateToken(data) {
        const { token } = data;

        const payload = await this.#validateToken(token);

        return new ResponseAuthDebugDTO({token, payload});
    }
}

export default AuthService;