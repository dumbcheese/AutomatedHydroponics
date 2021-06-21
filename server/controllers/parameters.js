import Parameters from '../models/parameters.js';
import mongoose from 'mongoose';

export const getParameters = async (req, res) => {
    try{
        const foundMessages = await Parameters.find();
        console.log(foundMessages);
        res.status(200).json(foundMessages);
;
    } catch(error){
        res.status(404).json({message: error.message});
    }
}

export const updateParameters = async (req, res) =>{
    const _id = "60b937b36c3ecc4240886ea0";
    const post = req.body;
    console.log(post);
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send("No post with that id");

    const updatedPost = await Parameters.findByIdAndUpdate(_id, post, {new:true});
    res.json(updatedPost);
}

export const createParameters = async (req, res) =>{
  const post = req.body;
  const newPost = new Parameters(post);
  try{
      await newPost.save();
      res.status(201).json(newPost);
  } catch(error){
      res.status(409).json({message: error.message});
  }
}