import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    target_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    target_type: { type: String, enum: ['post', 'reel', 'comment'], required: true },
  },
  { timestamps: true }
);

likeSchema.index({ user: 1, target_id: 1, target_type: 1 }, { unique: true });

export default mongoose.model('Like', likeSchema);
