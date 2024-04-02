const express=require('express')
const app=express()
const{connection}=require('./db')
const {boardRouter}=require('./route/board.route')
const {taskRouter}=require('./route/tasks.route')
const {subtaskRouter}=require('./route/subtask.route')
const {userRouter}=require('./route/user.route')
const cors=require('cors')

app.use(express.json())
app.use(cors())
app.use('/users',userRouter)
app.use('/board',boardRouter)
app.use('/tasks',taskRouter)
app.use('/subtasks',subtaskRouter)
app.get('/',(req,res)=>{
    res.status(200).json({msg:'home page'})
})

app.listen(8080,async()=>{
    console.log('connect to server')
    try{
        await connection
        console.log('connected to db')
    }
    catch(err)
    {
        console.log(err)
    }
})