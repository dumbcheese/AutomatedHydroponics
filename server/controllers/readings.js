import LatestReading from '../models/latestReading.js';
import Readings from '../models/readings.js';
import mongoose from 'mongoose';
import moment from 'moment';

export const getLatestReading = async (req, res) => {
    try{
        const foundMessages = await LatestReading.find();
        console.log(foundMessages);
        res.status(200).json(foundMessages);
;
    } catch(error){
        res.status(404).json({message: error.message});
    }
}

export const createReading = async (req, res) =>{
    const post = req.body;
    const newPost = new Readings(post);
    try{
        await newPost.save();
        res.status(201).json(newPost);
    } catch(error){
        res.status(409).json({message: error.message});
    }
}

export const latestReading = async (req, res) =>{
    const _id = "60b8bc2cf27f970ca419eda6";
    const post = req.body;
    console.log(post);
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send("No post with that id");

    const updatedPost = await LatestReading.findByIdAndUpdate(_id, post, {new:true});
    res.json(updatedPost);
}


export const getAllReadings = async (req, res) => {
    try{
        const foundMessages = await Readings.find();
        console.log(foundMessages);
        res.status(200).json(foundMessages);
;
    } catch(error){
        res.status(404).json({message: error.message});
    }
}
