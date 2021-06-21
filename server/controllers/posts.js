import postMessage from '../models/postMessage.js';
import mongoose from 'mongoose';

export const getPosts = async (req, res) => {
    try{
        const foundMessages = await postMessage.find();
        console.log(foundMessages);
        res.status(200).json(foundMessages);
;
    } catch(error){
        res.status(404).json({message: error.message});
    }
}

export const createPost = async (req, res) =>{
    const post = req.body;
    const newPost = new postMessage(post);
    try{
        await newPost.save();
        res.status(201).json(newPost);
    } catch(error){
        res.status(409).json({message: error.message});
    }
}

export const updatePost = async (req, res) =>{
    const {id: _id} = req.params;
    const post = req.body;
    console.log(post);
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send("No post with that id");

    const updatedPost = await postMessage.findByIdAndUpdate(_id, post, {new:true});
    res.json(updatedPost);
}


export const deletePost = async (req, res) =>{
    const {id: _id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send("No post with that id");

    await postMessage.findByIdAndRemove(_id);
    res.json({message:'Post deleted successfuly'});

}


export const likePost= async (req, res) =>{
    const {id: _id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send("No post with that id");

    const post = await postMessage.findById(_id);
    const updatedPost = await postMessage.findByIdAndUpdate(_id, {likeCount: post.likeCount+1}, {new: true});
    console.log(updatedPost);
    res.json(updatedPost);

}