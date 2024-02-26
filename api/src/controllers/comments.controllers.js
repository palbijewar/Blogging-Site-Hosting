import comments from '../models/Comment.model.js';
import { errorHandler } from '../utils/error.js';

export const createComment = async (req,res,next) => {
    try {
        const {content, post_id, user_id} = req.body;
        if(user_id !== req.user.id){
            return next(errorHandler(403, 'You are not allowed to comment'))
        }
        const newComment = new comments({
            content,
            post_id,
            user_id,
        })
        await newComment.save();
        res.status(200).json(newComment);
    } catch (error) {
        next(error)
    }
};

export const getPostComments = async (req, res, next) => {
    try {
      const allComments = await comments.find({ post_id: req.params.postId }).sort({
        createdAt: -1,
      });
      res.status(200).json(allComments);
    } catch (error) {
      next(error);
    }
  };

  export const likeComment = async (req,res,next) => {
    try {
        const comment = await comments.findById(req.params.commentId);
        if(!comment){
            return next(errorHandler(404, 'Comment not found'))
        }
        const userIndex = comment.likes.indexOf(req.user.id);
        if(userIndex === -1){
            comment.number_of_likes += 1
            comment.likes.push(req.user.id)
        } else {
            comment.number_of_likes -= 1
            comment.likes.splice(userIndex, 1)
        }
        await comment.save();
        res.status(200).json(comment);
    } catch (error) {
        next(error);
    }
  }

  export const editComment = async (req, res, next) => {
    try {
      const comment = await comments.findById(req.params.commentId);
      if (!comment) {
        return next(errorHandler(404, 'Comment not found'));
      }
      if (comment.user_id.toString() !== req.user.id && !req.user.is_admin) {
        return next(errorHandler(403, 'You are not allowed to edit this comment'));
      }
      const editedComment = await comments.findByIdAndUpdate(
        req.params.commentId,
        {
          content: req.body.content,
        },
        { new: true }
      );
      res.status(200).json(editedComment);
    } catch (error) {
      next(error);
    }
  };
  
  export const deleteComment = async (req, res, next) => {
    try {
      const comment = await comments.findById(req.params.commentId);
      if (!comment) {
        return next(errorHandler(404, 'Comment not found'));
      }
      if (comment.user_id.toString() !== req.user.id && !req.user.is_admin) {
        return next(errorHandler(403, 'You are not allowed to delete this comment'));
      }
      await comments.findByIdAndDelete(req.params.commentId);
      res.status(200).json('Comment deleted successfully');
    } catch (error) {
      next(error);
    }
  };
  
  export const getComments = async (req,res,next) => {
    if (!req.user.is_admin) {
      return next(errorHandler(403, 'You are not allowed to comment'));
  }  
    try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.order === 'asc' ? 1 : -1;
  
      const allComments = await comments
         .find()
         .sort({ updatedAt: sortDirection })
         .skip(startIndex)
         .limit(limit);
      
      const totalComments = await comments.countDocuments();
      const now = new Date();
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      const lastMonthComments = await comments.countDocuments({
         createdAt: { $gte: oneMonthAgo },
      });
      res.status(200).json({
        allComments,
        totalComments,
        lastMonthComments,
      })
    } catch (error) {
      next(error);
    }
  }