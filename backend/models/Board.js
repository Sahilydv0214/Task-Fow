const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Board title is required'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  columns: [{
    id: String,
    title: String,
    order: Number,
    color: {
      type: String,
      default: '#6366f1'
    }
  }],
  background: {
    type: String,
    default: '#0f172a'
  }
}, { timestamps: true });

module.exports = mongoose.model('Board', boardSchema);