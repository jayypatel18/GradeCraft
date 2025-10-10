import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  ct: {
    type: Number,
    required: true,
  },
  se: {
    type: Number,
    required: true,
  },
  as: {
    type: Number,
    required: true,
  },
  ru: {
    type: Number,
      required: true,
  },
  lpw: {
    type: Number,
    required: true,
  },
  hasLPW: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Result = mongoose.models.Result || mongoose.model('Result', resultSchema);

export default Result;
