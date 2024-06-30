import mongoose, { Schema } from 'mongoose';

const CommentSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
});

export default mongoose.model('Comment', CommentSchema);
