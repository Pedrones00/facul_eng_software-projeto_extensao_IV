import bcrypt from 'bcrypt';
import ThrowError from '../utils/throwError.js';
import ResponseUserDTO from "../models/dto/responseUserDTO.js";

class UserService {

    constructor(userModel, saltRounds = 10) {
        this.userModel = userModel;
        this.saltRounds = saltRounds;
    }

    async listAll() {
        const users = await this.userModel.findAll();
        return users.map(user => new ResponseUserDTO(user));
    }

    async getById(id) {
        const user = await this.userModel.findByPk(id);
        if (!user) ThrowError.throwError(404, 'Usuário não encontrado');

        return new ResponseUserDTO(user);
    }

    async registerUser(data) {
        const {userEmail, userPwd} = data;

        const existingUser = await this.userModel.findOne({
            where: {
                userEmail: userEmail
            }
        });

        if (existingUser) ThrowError.throwError(409, 'Email já está registrado, utilize outro email');

        const passwordHash = await bcrypt.hash(userPwd, this.saltRounds);

        const newUser = await this.userModel.create({userEmail: userEmail, pwdHash: passwordHash});

        return new ResponseUserDTO(await newUser.reload());
    }

    async deleteUser(id) {
        const user = await this.userModel.findByPk(id);
        if (!user) ThrowError.throwError(404, 'Usuário não encontrado');
        
        await user.destroy();
    }
}

export default UserService;