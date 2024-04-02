const express=require('express')
const subtaskRouter=express.Router()
const {TaskModel}=require('../model/task.mode')
const {BoardModel}=require('../model/board.model')
const {SubtaskModel}=require('../model/subtask.model')

// taskRouter.get('/',async(req,res)=>{
//     try{
//         const board=await BoardModel.find()
//         res.status(200).json(board)
//     }
//     catch(err){
//         res.status(400).json({error:err})
//     }
// })

subtaskRouter.get('/:subtaskID',async(req,res)=>{
    const _id=req.params.subtaskID
    try{
        const subtask=await SubtaskModel.findOne({_id})
        res.status(200).json(subtask)
    }
    catch(err){
        res.status(400).json({error:err})
    }
})

subtaskRouter.patch('/:subtaskID',async(req,res)=>{
    const _id=req.params.subtaskID
    const {isCompleted}=req.body
    try{
        await SubtaskModel.findByIdAndUpdate(_id,{isCompleted})
        res.status(200).json({msg:'subtask updated'})
    }
    catch(err)
    {
        res.status(400).json({error:err})
    }
})

subtaskRouter.post('/:taskId',async(req,res)=>{
    const {taskId}=req.params
    const {title,isCompleted}=req.body
    try{
        const task=await TaskModel.findOne({_id:taskId})
        const newSubtask=new SubtaskModel({title,isCompleted})
        await newSubtask.save()
        task.subtask.push(newSubtask)
        await task.save()
        res.status(200).json({msg:'new subtask has been created'})
    }
    catch(err)
    {
        console.log(err)
        res.status(400).json({error:err})
    }
})

module.exports={
    subtaskRouter
}