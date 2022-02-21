import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from '../models/userModel.js'

//@desc Auth user & get token
//@route Post/api/users/login
//@access Public
const authUser= asyncHandler(async(req,res) =>{
    const {email, password } = req.body
    
    const user = await User.findOne({email})
    
    if(user && (await user.matchPassword(password))) {
        res.json({
        _id: user._id,
        name: user.name,
        email:user.email,
        isAdmin:user.isAdmin,
        token: generateToken(user._id)
     })
    }else {
        res.status(401)
        throw new Error ('Invlid email or password'   )
    }

}) 


//@desc Register User
//@route Post/api/users
//@access Public
const registerUser= asyncHandler(async(req,res) =>{
    const {name, email, password } = req.body

 const userExist = await User.findOne({email: email})
 console.log(userExist)

 if (userExist) {
     res.status(400)
     throw new Error ('User already exists')
 }

 const user = await User.create({
     name,
     email,
     password
 })
    if(user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email:user.email,
            isAdmin:user.isAdmin,
            token: generateToken(user._id) ,
        })
    } else {
        res.status(400)
        throw new Error('Invalid user')

    }
})  
//@desc update user profile
//@route PUT/api/users/profile
//@access Private
const updateUserProfile = asyncHandler(async(req,res) =>{
    const user = await User.findById(req.user._id)
console.log("USER:::::",user)

    if(user) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      if (req.body.password ) {
          user.password = req.body.password 
      }
        const updateUser = await user.save()

        const token = generateToken(updateUser._id)
        res.json({
            ...updateUser._doc,
            token,
        })

       }else {
           res.status(404)
           throw new Error ('User not found')
           
       } 
}) 



//@desc Get user & profile
//@route Post/api/users/profile
//@access Private
const getUserProfile = asyncHandler(async(req,res) =>{
    const user = await User.findById(req.user._id)


    if(user) {
        res.json({
           _id: user._id,
           name: user.name,
           email:user.email,
           isAdmin:user.isAdmin,
           token: generateToken(user._id) 

          
   
        })
       }else {
           res.status(401)
           throw new Error ('Invlid user data')
           
       } 
}) 


//@desc Get all user 
//@route get/api/users/
//@access Private/Admin
const getUsers = asyncHandler(async(req,res) =>{
    const users = await User.find({})
    res.json(users)

}) 


//@desc Delete user 
//@route Delete/api/users/
//@access Private/Admin
const deleteUsers = asyncHandler(async(req,res) =>{
    const user = await User.findById(req.params.id)
    
    if(user) {
        await user.remove()
        res.json({Message: 'User remove'})    
        
    }else{
        res.status(404)
        throw new Error ('User not Found')
    }
    res.json(user)

})   
  


//@desc Get  user  By ID
//@route get/api/users/:ID
//@access Private/Admin
const getUsersById = asyncHandler(async(req,res) =>{
    const user = await User.findById(req.params.id).select('-password')

    if(user){
        res.json(user) 

    }else{
        res.status(404)
        throw new Error ('User not Found')
    }
    
}) 


//@desc update user 
//@route PUT/api/users/profile/:id
//@access Private
const updateUser = asyncHandler(async(req,res) =>{
    const user = await User.findById(req.params.id)
    console.log("USER:::::",user)

    if(user) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      user.isAdmin = req.body.isAdmin 

        const updateUser = await user.save()

        const token = generateToken(updateUser._id)
        res.json({
            ...updateUser._doc,
            token
        })

       }else {
           res.status(404)
           throw new Error ('User not found')
           
       } 
}) 

  

export { authUser, registerUser, getUserProfile, updateUserProfile, getUsers, deleteUsers, getUsersById, updateUser}
 