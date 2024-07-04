import mongoose, { Schema } from 'mongoose';

const CommentSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  body: { type: String, required: true },
});

export default mongoose.model('Comment', CommentSchema);
