import { Schema } from 'mongoose';
import db from './db';

const schema = new Schema({
  user_id: Schema.Types.ObjectId,
  email: {
    type: String,
    required: true,
  },
  full_name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['candidate', 'employer'],
  },
  company_name: String,
  skype_id: String,
  phone_number: String,
  cv_url: String,
  skills: [{
    name: String,
    level: Number,
  }],
  status: {
    type: String,
    required: true,
    default: 'new',
    enum: ['new', 'pending', 'approved'],
  },
}, {
  timestamps: true,
});

export default db.model('ApplyForm', schema);

