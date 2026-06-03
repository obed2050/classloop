import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    target_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    target_type: { type: String, enum: ['post', 'reel'], required: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
    content: { type: String, required: true },
    likes_count: { type: Number, default: 0 },
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

commentSchema.index({ target_id: 1, target_type: 1, parent: 1, createdAt: -1 });

export default mongoose.model('Comment', commentSchema);
