const express=require('express')
const taskRouter=express.Router()
const {TaskModel}=require('../model/task.mode')
const {BoardModel}=require('../model/board.model')
const {auth}=require('../middleware/auth.middleware')

// taskRouter.get('/',async(req,res)=>{
//     try{
//         const board=await BoardModel.find()
//         res.status(200).json(board)
//     }
//     catch(err){
//         res.status(400).json({error:err})
//     }
// })

taskRouter.get('/:taskID',auth,async(req,res)=>{
    const _id=req.params.taskID
    try{
        const task=await TaskModel.findOne({_id}).populate('subtask')
        res.status(200).json(task)
    }
    catch(err){
        res.status(400).json({error:err})
    }
})

taskRouter.post('/:boardId',auth,async(req,res)=>{
    const {boardId}=req.params
    const {title,status,description}=req.body
    try{
        const board=await BoardModel.findOne({_id:boardId})
        const newTask=new TaskModel({title,status,description})
        await newTask.save()
        board.tasks.push(newTask)
        await board.save()
        res.status(200).json({msg:'new task has been created'})
    }
    catch(err)
    {
        console.log(err)
        res.status(400).json({error:err})
    }
})

module.exports={
    taskRouter
}