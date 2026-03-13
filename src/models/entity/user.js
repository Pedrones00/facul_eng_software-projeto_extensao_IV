import {Model, DataTypes} from 'sequelize';
import db from '../../config/db.js';

export default () => {
    
    class User extends Model {}

    User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userEmail: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        pwdHash: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize: db.connection,
        modelName: 'User',
        tableName: 'users',
        timestamps: true,
        underscored: true
    });

    return User;
}