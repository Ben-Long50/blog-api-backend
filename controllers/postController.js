import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import Post from '../models/post.js';
import cloudinary from '../utils/cloudinary.js';
import upload from '../utils/multer.js';
import User from '../models/user.js';

const postController = {
  listPosts: asyncHandler(async (req, res) => {
    const posts = await Post.find();
    res.json(posts);
  }),

  createPost: [
    upload.single('image'),
    asyncHandler(async (req, res, next) => {
      if (req.file) {
        try {
          const result = await cloudinary.uploader.upload(req.file.path);
          req.imageURL = result.secure_url;
        } catch (err) {
          console.error(err);
          return res.status(500).json({
            success: false,
            message: 'Error uploading to Cloudinary',
          });
        }
      }
      next();
    }),
    body('title', 'Title must not be empty.')
      .trim()
      .isLength({ min: 1 })
      .escape(),

    body('body', 'Blog body must be a minimum of 3 characters')
      .trim()
      .isLength({ min: 3 })
      .escape(),

    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      } else {
        const postAuthor = await User.findById(req.body.author);
        const post = new Post({
          title: req.body.title,
          author: postAuthor,
          image: req.imageURL,
          body: req.body.body,
          draft: true,
        });
        await post.save();
        res.status(200).json(post);
      }
    }),
  ],

  showPost: asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.postId);
    res.json(post);
  }),

  deletePost: asyncHandler(async (req, res) => {
    await Post.findByIdAndDelete(req.params.postId);
  }),
};

export default postController;
