import { Schema } from 'mongoose';
import db from './db';

const schema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  company_name: {
    type: String,
    required: true,
  },
  company_description: String,
  benefits: String,
  website: String,
  location: String,
  no_of_employees: String,
  industries: [String],
  logo: String,
}, {
  timestamps: true,
});

export default db.model('Employer', schema);

