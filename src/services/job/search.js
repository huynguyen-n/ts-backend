import Job from '../../models/Job';
import jsonResponse from '../../utils/jsonResponse';

const generateInQueryFromString = str =>
  str.split(',').map(item => new RegExp(['^', item.trim(), '$'].join(''), 'i'));

/**
 * TODO:
 * - Update later to use Elasticsearch or Algolia
 */
export default (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const queryParams = event.queryStringParameters || {};
  /**
   * Reference: Search jobs section in Techinasia
   * API Specs:
    - Don't need authentication but need to think for security
    - Have pagination (DONE)
    - Search by:
      - Keywords (job title, company name, skill) (DONE)
      - Location (DONE)
      - Featured jobs (DONE)
    - Filter section will have following fields with number of jobs next to it:
      - Skills (DONE)
      - Industry
      - Salary range
      - Company (DONE)
      - Location (DONE)
   */
  const {
    keywords,
    location,
    featured,
    skill,
    company,
    page = 1,
  } = queryParams;
  const limit = 20;
  const offset = (limit * page) - limit;

  const query = {};
  const lookupEmployer = {
    from: 'employers',
    localField: 'employer.employer_id',
    foreignField: 'user_id',
    as: 'employer',
  };
  const projectFields = {
    job_title: 1,
    job_description: 1,
    compensation: 1,
    work_location: 1,
    is_featured: 1,
    createdAt: 1,
    'skills.skill_id': 1,
    'skills.skill_name': 1,
    'skills.skill_level': 1,
    'employer.company_name': 1,
    'employer.logo': 1,
    'employer.industries': 1,
  };
  if (keywords && keywords !== '') {
    query.$text = {
      $search: '\"' + keywords.split(' ').join('\" \"') + '\"', // eslint-disable-line
    };
  }
  if (featured && (featured === 'true' || featured === 'false')) {
    query.is_featured = featured === 'true';
  }
  if (location && location !== '') {
    query.work_location = {
      $in: generateInQueryFromString(location),
    };
  }
  if (skill && skill !== '') {
    query['skills.skill_name'] = {
      $in: generateInQueryFromString(skill),
    };
  }
  if (company && company !== '') {
    query['employer.company_name'] = {
      $in: generateInQueryFromString(company),
    };
  }

  Job.aggregate([
    { $match: query },
    { $lookup: lookupEmployer },
    { $unwind: '$employer' },
    { $project: projectFields },
    { $sort: { createdAt: -1 } },
    { $skip: offset },
    { $limit: limit },
  ])
    // TODO: Update data response to includes filters
    .then(data => callback(null, jsonResponse.success({ data })))
    .catch(err => callback(null, jsonResponse.serverError(err)));
};
