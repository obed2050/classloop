import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    name: { type: String, default: null },
    is_group: { type: Boolean, default: false },
    group_avatar: { type: String, default: null },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    last_message: { type: String },
    last_message_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

conversationSchema.index({ participants: 1, last_message_at: -1 });

export default mongoose.model('Conversation', conversationSchema);
