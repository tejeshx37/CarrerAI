const { BigQuery } = require('@google-cloud/bigquery');

// Initialize BigQuery client
const initializeBigQuery = () => {
  try {
    // Load service account key
    const serviceAccount = require('../../careerbridge-ai-c8f42-firebase-adminsdk-fbsvc-09f10bb1bc.json');
    
    const bigquery = new BigQuery({
      projectId: process.env.BIGQUERY_PROJECT_ID || 'careerbridge-ai-c8f42',
      credentials: serviceAccount
    });

    console.log('✅ BigQuery initialized successfully');
    return bigquery;
  } catch (error) {
    console.error('❌ Error initializing BigQuery:', error);
    throw error;
  }
};

// BigQuery configuration
const BIGQUERY_CONFIG = {
  projectId: process.env.BIGQUERY_PROJECT_ID || 'careerbridge-ai-c8f42',
  datasetId: process.env.BIGQUERY_DATASET_ID || 'career_data',
  tables: {
    JOB_TRENDS: 'job_trends',
    SKILL_DEMAND: 'skill_demand',
    SALARY_DATA: 'salary_data',
    INDUSTRY_ANALYSIS: 'industry_analysis',
    LOCATION_INSIGHTS: 'location_insights',
    EDUCATION_REQUIREMENTS: 'education_requirements'
  }
};

// BigQuery helper functions
const bigQueryHelpers = {
  // Execute a query
  executeQuery: async (query, options = {}) => {
    try {
      const bigquery = initializeBigQuery();
      const [rows] = await bigquery.query({
        query,
        ...options
      });
      return rows;
    } catch (error) {
      console.error('BigQuery execution error:', error);
      throw error;
    }
  },

  // Get job market trends
  getJobMarketTrends: async (timeframe = '1Y', location = 'India') => {
    const query = `
      SELECT 
        job_title,
        industry,
        location,
        demand_score,
        growth_rate,
        average_salary,
        skill_requirements,
        education_level,
        experience_required,
        DATE(timestamp) as date
      FROM \`${BIGQUERY_CONFIG.projectId}.${BIGQUERY_CONFIG.datasetId}.${BIGQUERY_CONFIG.tables.JOB_TRENDS}\`
      WHERE 
        DATE(timestamp) >= DATE_SUB(CURRENT_DATE(), INTERVAL ${timeframe})
        AND location LIKE '%${location}%'
      ORDER BY timestamp DESC
      LIMIT 100
    `;

    return await bigQueryHelpers.executeQuery(query);
  },

  // Get skill demand analysis
  getSkillDemandAnalysis: async (skills = [], location = 'India') => {
    const skillFilter = skills.length > 0 
      ? `AND skill_name IN (${skills.map(s => `'${s}'`).join(', ')})`
      : '';

    const query = `
      SELECT 
        skill_name,
        demand_score,
        growth_rate,
        average_salary_impact,
        job_titles,
        industries,
        DATE(timestamp) as date
      FROM \`${BIGQUERY_CONFIG.projectId}.${BIGQUERY_CONFIG.datasetId}.${BIGQUERY_CONFIG.tables.SKILL_DEMAND}\`
      WHERE 
        location LIKE '%${location}%'
        ${skillFilter}
      ORDER BY demand_score DESC
      LIMIT 50
    `;

    return await bigQueryHelpers.executeQuery(query);
  },

  // Get salary insights
  getSalaryInsights: async (jobTitle, location = 'India', experience = '0-2') => {
    const query = `
      SELECT 
        job_title,
        location,
        experience_level,
        min_salary,
        max_salary,
        average_salary,
        median_salary,
        percentile_25,
        percentile_75,
        percentile_90,
        sample_size,
        DATE(timestamp) as date
      FROM \`${BIGQUERY_CONFIG.projectId}.${BIGQUERY_CONFIG.datasetId}.${BIGQUERY_CONFIG.tables.SALARY_DATA}\`
      WHERE 
        job_title LIKE '%${jobTitle}%'
        AND location LIKE '%${location}%'
        AND experience_level = '${experience}'
      ORDER BY timestamp DESC
      LIMIT 10
    `;

    return await bigQueryHelpers.executeQuery(query);
  },

  // Get industry analysis
  getIndustryAnalysis: async (industry = null, location = 'India') => {
    const industryFilter = industry 
      ? `AND industry = '${industry}'`
      : '';

    const query = `
      SELECT 
        industry,
        job_count,
        average_salary,
        growth_rate,
        top_skills,
        top_job_titles,
        education_requirements,
        experience_distribution,
        DATE(timestamp) as date
      FROM \`${BIGQUERY_CONFIG.projectId}.${BIGQUERY_CONFIG.datasetId}.${BIGQUERY_CONFIG.tables.INDUSTRY_ANALYSIS}\`
      WHERE 
        location LIKE '%${location}%'
        ${industryFilter}
      ORDER BY job_count DESC
      LIMIT 20
    `;

    return await bigQueryHelpers.executeQuery(query);
  },

  // Get location insights
  getLocationInsights: async (location = 'India') => {
    const query = `
      SELECT 
        city,
        state,
        job_opportunities,
        average_salary,
        cost_of_living_index,
        quality_of_life_score,
        top_industries,
        top_skills,
        growth_rate,
        DATE(timestamp) as date
      FROM \`${BIGQUERY_CONFIG.projectId}.${BIGQUERY_CONFIG.datasetId}.${BIGQUERY_CONFIG.tables.LOCATION_INSIGHTS}\`
      WHERE 
        state LIKE '%${location}%' OR city LIKE '%${location}%'
      ORDER BY job_opportunities DESC
      LIMIT 30
    `;

    return await bigQueryHelpers.executeQuery(query);
  },

  // Get education requirements analysis
  getEducationRequirements: async (jobTitle = null, industry = null) => {
    const filters = [];
    if (jobTitle) filters.push(`job_title LIKE '%${jobTitle}%'`);
    if (industry) filters.push(`industry = '${industry}'`);
    
    const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

    const query = `
      SELECT 
        job_title,
        industry,
        education_level,
        degree_requirements,
        certification_requirements,
        skill_requirements,
        experience_requirements,
        salary_impact,
        job_availability,
        DATE(timestamp) as date
      FROM \`${BIGQUERY_CONFIG.projectId}.${BIGQUERY_CONFIG.datasetId}.${BIGQUERY_CONFIG.tables.EDUCATION_REQUIREMENTS}\`
      ${whereClause}
      ORDER BY job_availability DESC
      LIMIT 50
    `;

    return await bigQueryHelpers.executeQuery(query);
  },

  // Get career path recommendations based on user profile
  getCareerPathRecommendations: async (userProfile) => {
    const { 
      currentEducationLevel, 
      careerInterests, 
      technicalSkills, 
      preferredLocations,
      workExperience 
    } = userProfile;

    // Build dynamic query based on user profile
    let whereConditions = [];
    
    if (careerInterests && careerInterests.length > 0) {
      const interestFilter = careerInterests.map(interest => 
        `job_title LIKE '%${interest}%' OR industry LIKE '%${interest}%'`
      ).join(' OR ');
      whereConditions.push(`(${interestFilter})`);
    }

    if (preferredLocations && preferredLocations.length > 0) {
      const locationFilter = preferredLocations.map(location => 
        `location LIKE '%${location}%'`
      ).join(' OR ');
      whereConditions.push(`(${locationFilter})`);
    }

    if (currentEducationLevel) {
      whereConditions.push(`education_level <= '${currentEducationLevel}'`);
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    const query = `
      SELECT 
        job_title,
        industry,
        location,
        education_level,
        experience_required,
        average_salary,
        growth_rate,
        skill_requirements,
        career_progression,
        DATE(timestamp) as date
      FROM \`${BIGQUERY_CONFIG.projectId}.${BIGQUERY_CONFIG.datasetId}.${BIGQUERY_CONFIG.tables.JOB_TRENDS}\`
      ${whereClause}
      ORDER BY growth_rate DESC, average_salary DESC
      LIMIT 20
    `;

    return await bigQueryHelpers.executeQuery(query);
  },

  // Get emerging job roles
  getEmergingJobRoles: async (timeframe = '6M') => {
    const query = `
      SELECT 
        job_title,
        industry,
        emergence_score,
        growth_rate,
        skill_requirements,
        education_requirements,
        salary_range,
        location_distribution,
        DATE(timestamp) as date
      FROM \`${BIGQUERY_CONFIG.projectId}.${BIGQUERY_CONFIG.datasetId}.${BIGQUERY_CONFIG.tables.JOB_TRENDS}\`
      WHERE 
        DATE(timestamp) >= DATE_SUB(CURRENT_DATE(), INTERVAL ${timeframe})
        AND emergence_score > 0.7
      ORDER BY emergence_score DESC, growth_rate DESC
      LIMIT 15
    `;

    return await bigQueryHelpers.executeQuery(query);
  },

  // Get skill gap analysis
  getSkillGapAnalysis: async (currentSkills = [], targetRole = null) => {
    const skillFilter = currentSkills.length > 0 
      ? `AND skill_name NOT IN (${currentSkills.map(s => `'${s}'`).join(', ')})`
      : '';

    const roleFilter = targetRole 
      ? `AND job_title LIKE '%${targetRole}%'`
      : '';

    const query = `
      SELECT 
        skill_name,
        demand_score,
        average_salary_impact,
        learning_difficulty,
        time_to_learn,
        related_skills,
        job_titles,
        industries,
        DATE(timestamp) as date
      FROM \`${BIGQUERY_CONFIG.projectId}.${BIGQUERY_CONFIG.datasetId}.${BIGQUERY_CONFIG.tables.SKILL_DEMAND}\`
      WHERE 
        demand_score > 0.6
        ${skillFilter}
        ${roleFilter}
      ORDER BY demand_score DESC, average_salary_impact DESC
      LIMIT 20
    `;

    return await bigQueryHelpers.executeQuery(query);
  }
};

module.exports = {
  initializeBigQuery,
  BIGQUERY_CONFIG,
  bigQueryHelpers
};
