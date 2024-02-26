import users from '../models/User.mdel.js';
import bcrypt from 'bcrypt';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const createUser = async (req,res,next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return next(errorHandler(400,"All fields are required"));
    }
    if(password.length<8){
      return next(errorHandler(400,"Password must be of 8 characters or more"));
    }
    const hashedPassword = bcrypt.hashSync(password,10);
    const newUser = await users.create({ username, email, password:hashedPassword });
    return res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
 try {
     const {email, password} = req.body;
     if (!email || !password) {
      return next(errorHandler(400,"All fields are required"))
     }
     const validUser = await users.findOne({email:email})
     if (!validUser) {
      return next(errorHandler(404,"User not valid!"))
     }
     const validPassword = bcrypt.compareSync(password, validUser.password);
     if (!validPassword) {
      return next(errorHandler(400,"Invalid Email Or Password"))
     }
     const token = jwt.sign({ id: validUser._id, is_admin: validUser.is_admin }, process.env.JWT_SECRET, { expiresIn: '3d' });
     res.status(200).cookie('access_token', token, {
      httpOnly : true}).json(validUser);
 } catch (error) {
   next(error)
 }
}

export const google = async (req, res, next) => {
  try {
    const { email, name, googlePhotoUrl } = req.body;
    const user = await users.findOne({ email });

    if (user) {
      const token = jwt.sign({ id: user._id, is_admin: user.is_admin }, process.env.JWT_SECRET, { expiresIn: '3d' });
      res.status(200).cookie('access_token', token, {
       httpOnly : true}).json(user);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatedPassword, 10); 
      const newUser = new users({
        username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
        password: hashedPassword,
        email,
        profile_picture: googlePhotoUrl
      });

      await newUser.save();
      const token = jwt.sign({ id: newUser._id, is_admin: newUser.is_admin }, process.env.JWT_SECRET, { expiresIn: '3d' });
      res.status(200).cookie('access_token', token, {
       httpOnly : true}).json(newUser);
    }
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  if(req.user.id !== req.params.id){
    return next(errorHandler(401, 'Unauthorized'))
  }
  if(req.body.password){
    if(req.body.password.length < 8) {
     return next(errorHandler(400,"Password must be of 8 charaters or more"))
    }
    req.body.password = bcrypt.hashSync(req.body.password, 10)
  }
  if(req.body.username){
    if(req.body.username.length < 7 || req.body.username.length > 20){
      return next(errorHandler(400,"Username must be in between 7 to 20"))
    }
    if(req.body.username.includes(' ')){
      return next(errorHandler(400,"Username cannot contain spaces"))
    }
    if(req.body.username !== req.body.username.toLowerCase()){
      return next(errorHandler(400,"Username must be lower case"))
    }
  }
  // if(req.body.username.match(/^[a-zA-Z0-9]+$/)){
  //   return next(errorHandler(400,"Username cannot contain speacial characters"))
  // }
  try {
const updatedUser = await users.findByIdAndUpdate(req.params.id, {
  $set: {
    username : req.body.username,
    email : req.body.email,
    profile_picture : req.body.profile_picture,
    password : req.body.password
  },
}, {new : true});
const {password, ...rest} = updatedUser._doc;
res.status(200).json(rest);
} catch (error) {
  next(error);
}
}

export const deleteUser = async (req,res,next) => {
  if(!req.user.is_admin && req.user.id !== req.params.id){
    return next(errorHandler(403, 'You are not allowed to delete this post'))
  }
  try {
    await users.findByIdAndDelete(req.params.id)
    res.status(200).json("User deleted");
  } catch (error) {
    next(error);
  }
}

export const signoutUser = async (req,res,next) => {
  try {
    res.clearCookie('access_token').status(200).json('User has been signed out')
  } catch (error) {
    next(error);
  }
}

export const getUsers = async (req,res,next) => {
  if (!req.user.is_admin) {
    return next(errorHandler(403, 'You are not allowed to see all users'));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;

    const allUsers = await users
       .find()
       .sort({ updatedAt: sortDirection })
       .skip(startIndex)
       .limit(limit);
   
    const totalUsersWithoutPasswords = allUsers.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    })
    const totalUsers = await users.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastMonthUsers = await users.countDocuments({
       createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      totalUsersWithoutPasswords,
      totalUsers,
      lastMonthUsers,
    })
  } catch (error) {
    next(error);
  }
}

export const getUserById = async (req,res,next) => {
  try {
    const user = await users.findById(req.params.userId);
    if(!user){
      return next(errorHandler(404, 'User not found'));
    }
    const {password, ...rest} = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
}