import { Schema } from 'mongoose';
import db from './db';

const schema = new Schema({
  employer: {
    employer_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    company_name: {
      type: String,
      required: true,
    },
  },
  job_title: {
    type: String,
    required: true,
  },
  job_description: {
    type: String,
    required: true,
  },
  job_type: String,
  compensation: {
    type: Schema.Types.Mixed,
    required: true,
  },
  work_location: {
    type: Schema.Types.Mixed,
    required: true,
  },
  due_date: Date,
  roles: [String],
  status: {
    type: String,
    required: true,
    enum: ['unpublish', 'published'],
    default: 'unpublish',
  },
  is_verified: {
    type: Boolean,
    required: true,
    default: false,
  },
  skills: [{
    skill_id: Schema.Types.ObjectId,
    skill_name: String,
    level: Number,
  }],
  is_featured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

schema.index({
  job_title: 'text',
  'skills.skill_name': 'text',
  'employer.company_name': 'text',
});

export default db.model('Job', schema);

