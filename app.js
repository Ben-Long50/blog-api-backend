import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import cors from 'cors';
import authRouter from './routes/authentication.js';
import postsRouter from './routes/posts.js';
import usersRouter from './routes/users.js';

const app = express();

const mongoDb =
  process.env.DATABASE_URL ||
  'mongodb+srv://benjlong50:JKga95hMq5a425Xx@cluster0.tgg7uov.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoDb);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(import.meta.dirname, 'public')));

app.options('/signup', cors());
app.options('/login', cors());
app.options('/posts', cors());
app.use('/', authRouter);
app.use('/', postsRouter);
app.use('/', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json('error');
});

export default app;
