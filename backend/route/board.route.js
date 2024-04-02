const express=require('express')
const boardRouter=express.Router()
const {BoardModel}=require('../model/board.model')
const {auth}=require('../middleware/auth.middleware')

boardRouter.get('/',auth,async(req,res)=>{
    try{
        const board=await BoardModel.find()
        res.status(200).json(board)
    }
    catch(err){
        res.status(400).json({error:err})
    }
})

boardRouter.get('/:boardID',auth,async(req,res)=>{
    const _id=req.params.boardID
    try{
        const board=await BoardModel.findOne({_id}).populate({
            path: 'tasks',
            populate: { path: 'subtask' }
        });
        res.status(200).json(board)
    }
    catch(err){
        res.status(400).json({error:err})
    }
})
boardRouter.get('/user/:userID',auth,async(req,res)=>{
    const {userID}=req.params
    try{
        const board=await BoardModel.find({userID:userID})
        res.status(200).json(board)
    }
    catch(err){
        res.status(400).json({error:err})
    }
})

boardRouter.post('/',auth,async(req,res)=>{
    const {name}=req.body
    const userID=req.userID
    try{
        const newBoard=new BoardModel({name,userID})
        await newBoard.save()
        res.status(200).json({msg:'new board has been created'})
    }
    catch(err)
    {
        res.status(400).json({error:err})
    }
})

module.exports={
    boardRouter
}