import mongoose from 'mongoose';

const reelSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    video_url: { type: String, required: true },
    video_public_id: { type: String },
    thumbnail_url: { type: String },
    caption: { type: String, maxlength: 2200 },
    hashtags: [{ type: String, lowercase: true }],
    audio_name: { type: String },
    duration: { type: Number },
    likes_count: { type: Number, default: 0 },
    comments_count: { type: Number, default: 0 },
    views_count: { type: Number, default: 0 },
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

reelSchema.index({ createdAt: -1 });
reelSchema.index({ likes_count: -1 });

export default mongoose.model('Reel', reelSchema);
