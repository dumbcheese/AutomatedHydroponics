import User from '../models/User.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export const signIn = async (req, res) =>{
    const {email, password} = req.body;
    try{
        const existingUser = await User.findOne({email});

        if(!existingUser) return res.status(404).json({message: "User doesn't exist."});
        
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if(!isPasswordCorrect) return res.status(404).json({message: "Invalid credentials."});

        const token = jwt.sign({email: existingUser.email, id: existingUser._id}, 'test', {expiresIn: "1h"});
        res.status(200).json({result: existingUser, token});
    } catch(error){
        res.status(500).json({message: "Something went wrong."})
    }
}



export const signUp = async (req, res) =>{
    const {email, password, confirmPassword, name } = req.body;
    try{
        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(400).json({message: "User already exists."});
        if(password != confirmPassword) return res.status(400).json({message: "Password don't match."});

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await User.create({email, password: hashedPassword, name})
        const token = jwt.sign({email: result.email, id: result._id}, 'test', {expiresIn:"1h"}); 
        res.status(200).json({result, token});
    } catch(error){
        res.status(500).json({message: "Something went wrong."})
    }
}