import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import {createPost, getPosts, deletePost, updatePost} from '../controllers/post.controllers.js'

const router = express.Router();

router.post('/', verifyToken, createPost);

router.put('/:postId/:userId', verifyToken, updatePost);

router.get('/', getPosts);

router.delete('/:postId/:userId', verifyToken, deletePost);

export default router;