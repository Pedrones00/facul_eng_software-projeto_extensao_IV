import initUserModel from "./user.js";
import db from "../../config/db.js"

export default async () => {

    const User = initUserModel();

    await db.connection.sync({alter: true});

    return {
        User
    }

}