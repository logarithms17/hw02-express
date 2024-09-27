import User from "../models/userModel.js";
import { userValidation, subscriptionValidation } from "../validation/validation.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import "dotenv/config";

const {SECRET_KEY} = process.env

export const signupUser = async (req, res, next) => {
    try{
    const { password, email } = req.body;
    console.log(password)
    console.log(email)

    const { error } = userValidation.validate(req.body);

    if (error) {
        return res.status(400).json({ message: "Missing required field" });
    }

    //CHECK IF THERE ARE EXISTING USER
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(409).json({ message: "Email in use" });
    }

    //HASH THE PASSWORD
    const salt = await bcrypt.genSalt(10); //level of security
    const hashedPassword = await bcrypt.hash(password, salt);

    //CREATE NEW USER

    const newUser = await User.create({
        email,
        password: hashedPassword,
    })
    
    res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
}

//LOGIN USER
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const { error } = userValidation.validate(req.body);

        if (error) {
            return res.status(400).json({ message: "Missing required field" });
        }

        //CHECK IF THERE ARE EXISTING USER
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(401).json({ message: "Email or password is wrong" });
        }

        //COMPARE PASSWORD
        const isMatch = await bcrypt.compare(password, existingUser.password); //compare the given password to any existing password within the database

        if (!isMatch) {
            return res.status(401).json({ message: "Email or password is wrong" });
        }

        //CREATE TOKEN NO TOKEN AVAILABLE
        
        const token = jwt.sign(
            { userId: existingUser._id },
            SECRET_KEY,
            { expiresIn: "23h" }
        );

        await User.findByIdAndUpdate(existingUser._id, { token })

        res.status(200).json({ existingUser });
    } catch (error) {
        next(error);
    }
}

//LOGOUT USER

export const logoutUser = async (req, res, next) => {
    console.log("entered Logout function")
    try {
        const { _id } = req.user;
        await User.findByIdAndUpdate(_id, { token: null });
        res.status(204).json({message: "User successfully logged out!"});
    } catch (error) {
        next(error);
    }
}

//GET CURRENT USER

export const getCurrentUser = async (req, res, next) => {
    try {
        const { _id } = req.user;
        const user = await User.findById(_id);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

//UPDATE USER INFO

export const updateUserSubscription = async (req, res, next) => {

    const { error } = subscriptionValidation.validate(req.body);

    if (error) {
        return res.status(400).json({ message: "Missing required field" });
    }

    if (req.body.password) {
        return res.status(400).json({ message: "Password cannot be changed" });
    }

    try {
        const { _id } = req.user;
        const user = await User.findByIdAndUpdate(_id, req.body, { new: true });
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}