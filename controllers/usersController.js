import User from "../models/userModel.js";
import { userValidation, subscriptionValidation } from "../validation/validation.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import "dotenv/config";
import { Jimp } from "jimp";
import path from "path"
import fs from "fs/promises";
import gravatar from "gravatar";

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
        
        //CREATE DEFAULT AVATAR USING GRAVATR
        
        const avatarUrl = gravatar.url(email, { protocol: "http" })

    //CREATE NEW USER

    const newUser = await User.create({
        email,
        password: hashedPassword,
        avatarUrl
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

        res.status(200).json({
      user: {
        _id: existingUser._id,
        email: existingUser.email,
        subscription: existingUser.subscription,
      },
      token,
    });
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

//UPLOAD AVATAR

export const uploadAvatar = async (req, res) => {
    console.log("Entered userController for upload avatar")
    console.log(req.file)
    try {
        const { _id } = req.user;
        console.log("User ID:", _id); // Debug log

        //IF NO FILE IS UPLOADED
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const { path: oldPath, originalname } = req.file; //accessing the initial storage path of the uploaded file


        //resize the image file using JIMP

        await Jimp.read(oldPath)
        .then((image) => {
            image.resize({ w: 250, h: 250 }).write(oldPath);
        })
        .catch((error) => console.log(error));    

        //create new file name

        const extension = path.extname(originalname)

        const newFileName = `${_id}${extension}`
        
        const newPath = path.join("public", "avatars", newFileName)

        console.log(`New Path: ${newPath}`)

        await fs.rename(oldPath, newPath)

        const avatarUrl = path.join("avatars", newFileName)
        console.log(`avatarURL: ${avatarUrl}`)

        await User.findByIdAndUpdate(_id, { avatarUrl });
        console.log("Avatar URL saved to the database"); // Debug log

        res.status(200).json({ avatarUrl });

    } catch (error) {
        console.error("Error in updateAvatar:", error); // Debug log
        res.status(500).json({ message: error.message });
    }
}
