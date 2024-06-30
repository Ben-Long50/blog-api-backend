import mongoose, { Schema } from 'mongoose';

const PostSchema = new Schema({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  image: { type: String },
  body: { type: String, required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  draft: { type: Boolean, required: true },
});

export default mongoose.model('Post', PostSchema);
