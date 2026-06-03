import mongoose from 'mongoose';

const memorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String },
    description: { type: String },
    before_image: { type: String },
    after_image: { type: String },
    memory_date: { type: Date },
    memory_year: { type: Number },
    memory_type: {
      type: String,
      enum: ['throwback', 'before_after', 'funny_moment', 'school_event', 'graduation'],
      required: true,
    },
    tags: [{ type: String }],
    likes_count: { type: Number, default: 0 },
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

memorySchema.index({ user: 1, memory_year: -1 });

export default mongoose.model('Memory', memorySchema);
