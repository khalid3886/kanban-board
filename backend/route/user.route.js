const express=require('express')
const userRouter=express.Router()
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const{UserModel}=require('../model/user.model')

userRouter.get('/',async(req,res)=>{
    try{
        const user=await UserModel.find()
        res.status(200).json(user)
    }
    catch(err)
    {
        res.status(400).json({error:err})
    }
})

userRouter.post('/signup',async(req,res)=>{
    const {name,email,password}=req.body
    try{
        const hash=await bcrypt.hash(password,5)
        const user=new UserModel({name,email,password:hash})
        await user.save()
        res.status(200).json({msg:'user has been registered'})
    }
    catch(err)
    {
        console.log(err)
        res.status(400).json({error:err})
    } 
})

userRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (user) {
            bcrypt.compare(password, user.password, async (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ msg: 'Internal server error' });
                } else {
                    if (result) {
                        const access_token = jwt.sign({ userID: user._id }, 'khalid');
                        res.status(200).json({ msg: 'login successfull', access_token, user });
                    } else {
                        res.status(200).json({ msg: 'Wrong credentials' });
                    }
                }
            });
        } else {
            res.status(200).json({ msg: 'Sign up please' });
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err });
    }
});

module.exports={
    userRouter
}
