import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import Comment from '../models/comment.js';
import Post from '../models/post.js';

const commentController = {
  createComment: [
    body('body', 'Comment body must not be empty.').trim().isLength({ min: 1 }),

    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json(errors.array());
      } else {
        const comment = new Comment({
          author: req.body.author,
          date: new Date(),
          body: req.body.body,
        });
        await comment.save();
        const post = await Post.findById(req.params.postId);

        if (!post) {
          return res.status(404).json({ message: 'Post not found' });
        }

        post.comments.push(comment);
        await post.save();
        const newComment = await Comment.findOne({
          body: req.body.body,
        }).populate('author');
        res.status(200).json(newComment);
      }
    }),
  ],
};

export default commentController;
