require('dotenv').config();
const { User } = require("../models/user");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const register = async (req, res) => {
    try {
        const {username, email, password} = req.body;

         //check if user exist in db
         const findUser = await User.findOne({$or : [{username}, {email}]});

         if (findUser) {
            return res.status(409).json({
                message: "email or username already taken"
            });
         }

         //password hashing
         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(password, salt);

         const registeredUser = await User.create({
            username,
            email,
            password: hashedPassword,
         });

         if (!registeredUser) {
            return res.status(201).json({
                message: "Unable to register user due to error. Try again",
             }); 
         }   
         
         res.status(201).json({
            message: "User registered successfully",
         });
         
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Invalid register credentials"
        });
    }
}

const login = async (req, res) => {
    try {
        const {username, password} = req.body;

        //check if user exist
        const getUser = await User.findOne({username});

        if (!getUser) {
            return res.status(401).json({
                message: "Invalid login credentials"
            });
        }

        //check for password match
        const passwordMatchCheck = await bcrypt.compare(password, getUser.password);

        if (!passwordMatchCheck) {
            return res.status(401).json({
                message: "Invalid login credentials"
            });
        }

        const accessToken = jwt.sign({
            id: getUser._id,
            username: getUser.username,
            email: getUser.email,
            role: getUser.role
        }, process.env.JWT_SECRET_KEY, { expiresIn: '30m' });

        res.status(200).json({
            message: "Logged in successfully",
            accessToken: accessToken
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Invalid login credentials"
        });
    }
}

const changePassword = async (req, res)=>{
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({
                message: "User doesn't exist"
            });
        }

        //compare password
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Current password is incorrect"
            });
        }

        if (currentPassword === newPassword) {
            return res.status(400).json({
                message: "New password must be different from the current password"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            message: "Password changed successfully"
        })

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error occured while changing password"
        });
    }
}

module.exports = {
    register,
    login,
    changePassword
}