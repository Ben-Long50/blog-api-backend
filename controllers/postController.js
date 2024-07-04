import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import Post from '../models/post.js';
import cloudinary from '../utils/cloudinary.js';
import upload from '../utils/multer.js';
import User from '../models/user.js';

const postController = {
  listPosts: asyncHandler(async (req, res) => {
    const posts = await Post.find().sort({ dateUpdated: -1 });
    res.json(posts);
  }),

  listActivePosts: asyncHandler(async (req, res) => {
    const posts = await Post.find({ draft: false })
      .populate({
        path: 'comments',
        populate: { path: 'author' },
      })
      .populate('author')
      .sort({ dateUpdated: -1 });
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
    body('title', 'Title must not be empty.').trim().isLength({ min: 1 }),

    body('mythos', 'Mythos must not be empty')
      .trim()
      .custom((value) => {
        if (typeof value !== 'string') {
          throw new Error('Value must be a string');
        }
        return value.charAt(0).toUpperCase() + value.slice(1);
      }),

    body('body', 'Blog body must be a minimum of 3 characters')
      .trim()
      .isLength({ min: 3 }),

    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      } else {
        const postAuthor = await User.findById(req.body.author);
        const post = new Post({
          title: req.body.title,
          author: postAuthor,
          mythos: req.body.mythos,
          image: req.imageURL,
          body: req.body.body,
          draft: true,
          dateCreated: new Date(),
          dateUpdated: new Date(),
        });
        await post.save();
        res.status(200).json(post);
      }
    }),
  ],

  updatePost: [
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
    body('title', 'Title must not be empty.').trim().isLength({ min: 1 }),

    body('mythos', 'Mythos must not be empty')
      .trim()
      .custom((value) => {
        if (typeof value !== 'string') {
          throw new Error('Value must be a string');
        }
        return value.charAt(0).toUpperCase() + value.slice(1);
      }),

    body('body', 'Blog body must be a minimum of 3 characters')
      .trim()
      .isLength({ min: 3 }),

    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      } else {
        const updatedData = {
          title: req.body.title,
          mythos: req.body.mythos,
          image: req.imageURL ? req.imageURL : req.body.image,
          body: req.body.body,
          dateUpdated: new Date(),
        };
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.postId,
          updatedData,
          { new: true },
        );
        res.status(200).json(updatedPost);
      }
    }),
  ],

  updatePostDraft: asyncHandler(async (req, res) => {
    try {
      const post = await Post.findById(req.params.postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      const postData = post.draft ? { draft: false } : { post, draft: true };
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.postId,
        postData,
        { new: true },
      );
      res.status(200).json(updatedPost);
    } catch (error) {
      console.error('Error updating post draft:', error);
      res.status(500).json({ message: 'Error updating post draft' });
    }
  }),

  deletePost: asyncHandler(async (req, res) => {
    try {
      await Post.findByIdAndDelete(req.params.postId);
      res.status(200).json({ message: 'Successfully deleted post' });
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ message: 'Error deleting post' });
    }
  }),
};

export default postController;
