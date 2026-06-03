import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    caption: { type: String, maxlength: 2200 },
    media_url: { type: String, required: true },
    media_type: { type: String, enum: ['image', 'video'], default: 'image' },
    media_public_id: { type: String },
    hashtags: [{ type: String, lowercase: true }],
    likes_count: { type: Number, default: 0 },
    comments_count: { type: Number, default: 0 },
    saves_count: { type: Number, default: 0 },
    is_memory: { type: Boolean, default: false },
    memory_year: { type: Number },
    memory_type: {
      type: String,
      enum: ['throwback', 'before_after', 'funny_moment', 'school_event', null],
      default: null,
    },
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

postSchema.index({ user: 1, createdAt: -1 });
postSchema.index({ hashtags: 1 });
postSchema.index({ is_memory: 1 });

export default mongoose.model('Post', postSchema);
