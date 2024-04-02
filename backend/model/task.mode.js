const mongoose=require('mongoose')
const {Schema}=mongoose
const taskSchema=mongoose.Schema({
    title : String,
	description : String,
	status : {type: String, enum: ['Todo', 'Doing', 'Done'], default: 'Todo'},
	subtask : [{ type: Schema.Types.ObjectId, ref: 'Subtask'}]
},
{
    versionKey:false
})

const TaskModel=mongoose.model('Task',taskSchema)
module.exports={
    TaskModel
}