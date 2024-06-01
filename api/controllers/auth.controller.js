import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

export const register = async (req, res) => {
    const {username, email, password} = req.body;
    try{
    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = await prisma.user.create({
        data: {
            username, email, password:hashedPassword
        }
    })
    console.log(newUser)
    res.status(201).json({newUser, message: 'user successfully created!'})
}
catch{
    console.log(error);
    res.status(500).json(error)
}
}

export const login = async (req, res) => {
    const {username, password} = req.body;

    try {
        const user = await prisma.user.findUnique({
            where:{username:username}
        })
    
    if(!user) {
        return res.status(401).json({message: "invalid credentials"})
    }

        const isPasswordValid = bcryptjs.compareSync(password, user.password)

        if(!isPasswordValid) {
            return res.status(401).json({message: "invalid credentials"})
        }

        const age = 1000 * 60 * 60 * 24 * 7
        
        const token = jwt.sign({
            id:user.id,
            
        }, process.env.JWT_SECRET_KEY, {expiresIn: age})

        const {password: userPasword, ...userInfo} = user

        res.cookie("token", token, {
            httpOnly: true,
            // secure:true
            maxAge: age,
        }).status(200).json({message: "Login Successful"})
    
        
    } catch (error) {
        console.log(error);

    }
    
}

export const logout = (req, res) => {
    res.clearCookie("token").status(200).json({message: "logout successful!"})
}