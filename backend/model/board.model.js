const mongoose=require('mongoose')
const {Schema}=mongoose
const boardSchema=mongoose.Schema({
    name: String,
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task'}],
    userID: { type: Schema.Types.ObjectId, ref: 'user'}
},
{
    versionKey:false
})

const BoardModel=mongoose.model('Board',boardSchema)
module.exports={
    BoardModel
}