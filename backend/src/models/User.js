import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 30 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    full_name: { type: String, trim: true, maxlength: 100 },
    bio: { type: String, maxlength: 300 },
    profile_picture: { type: String, default: null },
    school_name: { type: String, trim: true, maxlength: 100 },
    graduation_year: { type: Number, min: 1990, max: 2030 },
    class_section: { type: String, trim: true, maxlength: 20 },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    is_banned: { type: Boolean, default: false },
    is_private: { type: Boolean, default: false },
    followers_count: { type: Number, default: 0 },
    following_count: { type: Number, default: 0 },
    posts_count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model('User', userSchema);
