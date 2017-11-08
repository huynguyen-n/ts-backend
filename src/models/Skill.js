import { Schema } from 'mongoose';
import db from './db';

const schema = new Schema({
  skill_name: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export default db.model('Skill', schema);

