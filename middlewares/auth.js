import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import "dotenv/config";

const { SECRET_KEY } = process.env

export const authenticateToken = async (req, res, next) => {
    const { authorization = "" } = req.headers; // Extract authorization header if none then give ""

    const [bearer, token] = authorization.split(" "); //Split the header into bearer and token

    if (bearer !== "Bearer") {
        return res.status(401).json({ message: "Not Authorized" });
    }

    try {
        const { userId } = jwt.verify(token, SECRET_KEY); //this will return the data of the user and specifically choses id
        

        const user = await User.findById(userId);

        console.log(user)

        if (!user || !user.token) {
            return res.status(401).json({ message: "Not Authorized" });
        }

        req.user = user; //saving the verified user to req.user to be used in the next middleware

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Not Authorized" });
    }
};

        