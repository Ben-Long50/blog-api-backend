import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import User from '../models/user.js';

const userController = {
  listUsers: asyncHandler(async (req, res) => {
    const users = await User.find();
    res.json(users);
  }),

  createAdmin: [
    body('firstName', 'First Name must not be empty.')
      .trim()
      .isLength({ min: 1 })
      .escape(),

    body('lastName', 'Last Name must not be empty.')
      .trim()
      .isLength({ min: 1 })
      .escape(),

    body('username', 'Username must be a minimum of 3 characters')
      .trim()
      .isLength({ min: 3 })
      .escape()
      .custom(async (value) => {
        const user = await User.findOne({ username: value });
        if (user) {
          throw new Error('Username already exists');
        }
        return true;
      }),

    body('password', 'Password must be a minimum of 3 characters')
      .trim()
      .isLength({ min: 3 })
      .escape(),

    body('confirmPassword', 'Passwords must match')
      .trim()
      .escape()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          return false;
        }
        return true;
      }),

    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json(errors.array());
      } else {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          username: req.body.username,
          password: hashedPassword,
          admin: true,
        });
        await user.save();
        res.send(user);
      }
    }),
  ],

  createUser: [
    body('firstName', 'First Name must not be empty.')
      .trim()
      .isLength({ min: 1 })
      .escape(),

    body('lastName', 'Last Name must not be empty.')
      .trim()
      .isLength({ min: 1 })
      .escape(),

    body('username', 'Username must be a minimum of 3 characters')
      .trim()
      .isLength({ min: 3 })
      .escape()
      .custom(async (value) => {
        const user = await User.findOne({ username: value });
        if (user) {
          throw new Error('Username already exists');
        }
        return true;
      }),

    body('password', 'Password must be a minimum of 3 characters')
      .trim()
      .isLength({ min: 3 })
      .escape(),

    body('confirmPassword', 'Passwords must match')
      .trim()
      .escape()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          return false;
        }
        return true;
      }),

    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json(errors.array());
      } else {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          username: req.body.username,
          password: hashedPassword,
          admin: false,
        });
        await user.save();
        res.send(user);
      }
    }),
  ],

  showUser: asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userId);
    res.json(user);
  }),

  deleteUser: asyncHandler(async (req, res) => {
    await User.findByIdAndDelete(req.params.userId);
  }),
};

export default userController;
