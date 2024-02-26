import { errorHandler } from "../utils/error.js"
import posts from '../models/Post.model.js';

export const createPost = async (req,res,next) => {
 if(!req.user.is_admin){
    return next(errorHandler(403, 'You are not allowed to create a post'))
 }
 if(!req.body.title || !req.body.content){
    return next(errorHandler(400, 'YPlease provide all required fields'))
 }
 const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z-0-9-]/g, '-');
 const newPost = new posts({
    ...req.body,
    slug,
    user_id: req.user.id,
 });
 try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
 } catch (error) {
    next(error)
 }
};

export const getPosts = async (req, res, next) => {
   try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.order === 'asc' ? 1 : -1;
      const queryConditions = {
         ...(req.query.user_id && { user_id: req.query.user_id }),
         ...(req.query.category && { category: req.query.category }),
         ...(req.query.slug && { slug: req.query.slug }),
         ...(req.query.post_id && { _id: req.query.post_id }), 
         ...(req.query.searchTerm && {
            $or: [
               { title: { $regex: req.query.searchTerm, $options: 'i' }},
               { content: { $regex: req.query.searchTerm, $options: 'i' }} 
            ],
         }),
      };
      
      const allPosts = await posts
         .find(queryConditions)
         .sort({ updatedAt: sortDirection })
         .skip(startIndex)
         .limit(limit);

      const totalPosts = await posts.countDocuments(); 
      
      const now = new Date();
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      
      const lastMonthPosts = await posts.countDocuments({
         createdAt: { $gte: oneMonthAgo },
      });
      res.status(200).json({
         allPosts,
         totalPosts,
         lastMonthPosts,
      });
   } catch (error) {
      next(error);
   }
};

export const deletePost = async (req,res,next) => {
   if(!req.user.is_admin || req.user.id !== req.params.userId){
      return next(errorHandler(403, 'You are not allowed to delete this post'))
   };
   try {
      await posts.findByIdAndDelete(req.params.postId);
      res.status(200).json('The post is deleted');
   } catch (error) {
      next(error)
   }
};

export const updatePost = async (req, res, next) => {
   if (!req.user.is_admin || req.user.id !== req.params.userId) {
      return next(errorHandler(403, 'You are not allowed to update this post'));
   }

   try {
      const updatedPost = await posts.findByIdAndUpdate(
         req.params.postId, 
         {   
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
            image: req.body.image,
         },
         { new: true } 
      );
      
      if (!updatedPost) {
         return next(errorHandler(404, 'Post not found'));
      }

      res.status(200).json(updatedPost);
   } catch (error) {
      next(error);
   }
};
