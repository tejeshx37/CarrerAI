# CareerBridgeAI Backend

An AI-powered career guidance platform for Indian students, built for the Gen AI Exchange Hackathon. This backend provides personalized career recommendations, psychometric assessments, and market trend analysis using Google Cloud services.

## 🚀 Features

### Core Functionality
- **User Authentication & Management**: Secure JWT-based authentication with Firebase integration
- **AI-Powered Assessments**: Psychometric, skills, and career interest evaluations
- **Personalized Career Recommendations**: AI-driven career guidance based on user profile and market data
- **Market Trend Analysis**: Real-time job market insights using BigQuery
- **Skill Gap Analysis**: Identify and recommend skills for career advancement
- **Career Roadmap Generation**: Personalized learning paths to achieve career goals

### Technical Features
- **Firestore Database**: Scalable NoSQL database for user data and assessments
- **BigQuery Integration**: Market trend analysis and job data insights
- **OpenAI Integration**: AI-powered analysis and recommendations
- **RESTful API**: Well-documented API endpoints
- **Security**: Rate limiting, CORS, helmet security, input validation
- **Error Handling**: Comprehensive error handling and logging

## 🏗️ Architecture

```
src/
├── config/
│   ├── database.js          # Firestore configuration
│   └── bigquery.js          # BigQuery configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── assessmentController.js # Assessment management
│   └── careerController.js  # Career guidance logic
├── middleware/
│   └── auth.js             # Authentication middleware
├── models/
│   ├── User.js             # User data model
│   └── Assessment.js       # Assessment data model
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── assessment.js       # Assessment routes
│   └── career.js           # Career guidance routes
└── server.js               # Main server file
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- Google Cloud Project with Firestore and BigQuery enabled
- OpenAI API key
- Firebase service account key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CareerBridgeAI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   # Google Cloud Configuration
   GOOGLE_APPLICATION_CREDENTIALS=./config/firebase-service-account.json
   FIREBASE_PROJECT_ID=careerbridge-ai-c8f42
   
   # BigQuery Configuration
   BIGQUERY_PROJECT_ID=careerbridge-ai-c8f42
   BIGQUERY_DATASET_ID=career_data
   
   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key_here
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret_here
   
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   ```

4. **Firebase Setup**
   - Download your Firebase service account key
   - Place it in `config/firebase-service-account.json`
   - Ensure Firestore is enabled in your Firebase project

5. **BigQuery Setup**
   - Create a dataset named `career_data` in BigQuery
   - Create the following tables:
     - `job_trends`
     - `skill_demand`
     - `salary_data`
     - `industry_analysis`
     - `location_insights`
     - `education_requirements`

6. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "dateOfBirth": "2000-01-01",
  "gender": "male",
  "state": "Karnataka",
  "city": "Bangalore",
  "pincode": "560001",
  "currentEducationLevel": "bachelor",
  "careerInterests": ["software_development", "data_science"],
  "preferredJobTypes": ["full_time", "internship"],
  "preferredLocations": ["Bangalore", "Mumbai"]
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Firebase Authentication
```http
POST /api/auth/firebase-auth
Content-Type: application/json

{
  "uid": "firebase_user_id",
  "email": "user@example.com",
  "displayName": "User Name"
}
```

### Assessment Endpoints

#### Create Assessment
```http
POST /api/assessments
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "assessmentType": "psychometric",
  "title": "Personality Assessment",
  "description": "Comprehensive personality evaluation",
  "questions": [
    {
      "id": "q1",
      "type": "multiple_choice",
      "question": "How do you prefer to work?",
      "options": ["Independently", "In a team", "Both equally"],
      "category": "work_style"
    }
  ],
  "timeLimit": 1800
}
```

#### Start Assessment
```http
POST /api/assessments/{assessmentId}/start
Authorization: Bearer <jwt_token>
```

#### Submit Response
```http
POST /api/assessments/{assessmentId}/responses
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "questionId": "q1",
  "answer": "In a team",
  "timeSpent": 30
}
```

#### Complete Assessment
```http
POST /api/assessments/{assessmentId}/complete
Authorization: Bearer <jwt_token>
```

### Career Guidance Endpoints

#### Get Career Recommendations
```http
GET /api/career/recommendations?limit=10
Authorization: Bearer <jwt_token>
```

#### Get Job Market Trends
```http
GET /api/career/trends?timeframe=1Y&location=India&industry=technology
```

#### Get Skill Demand Analysis
```http
GET /api/career/skills?skills=javascript,python&location=India
```

#### Get Salary Insights
```http
GET /api/career/salary?jobTitle=software_engineer&location=India&experience=0-2
```

#### Generate Career Roadmap
```http
POST /api/career/roadmap
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "targetRole": "Senior Software Engineer",
  "timeframe": "2Y"
}
```

## 🗄️ Database Schema

### Users Collection
```javascript
{
  id: "user_id",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  // ... other user fields
  psychometricProfile: {
    personalityType: "INTJ",
    cognitiveAbilities: { /* ... */ },
    strengths: ["analytical", "creative"],
    // ... other assessment results
  },
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

### Assessments Collection
```javascript
{
  id: "assessment_id",
  userId: "user_id",
  assessmentType: "psychometric",
  title: "Personality Assessment",
  questions: [/* ... */],
  responses: [/* ... */],
  results: {
    totalScore: 85,
    percentage: 85,
    grade: "A",
    // ... AI analysis results
  },
  status: "completed",
  createdAt: "timestamp",
  completedAt: "timestamp"
}
```

## 🔧 Configuration

### Environment Variables
- `FIREBASE_PROJECT_ID`: Your Firebase project ID
- `BIGQUERY_PROJECT_ID`: Your BigQuery project ID
- `OPENAI_API_KEY`: Your OpenAI API key
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)

### BigQuery Tables
The system expects the following BigQuery tables with sample data:

1. **job_trends**: Job market trends and opportunities
2. **skill_demand**: Skill demand analysis
3. **salary_data**: Salary information by role and location
4. **industry_analysis**: Industry-specific insights
5. **location_insights**: Location-based career opportunities
6. **education_requirements**: Education requirements for different roles

## 🚀 Deployment

### Google Cloud Run
1. Build Docker image
2. Deploy to Cloud Run
3. Set environment variables
4. Configure domain and SSL

### Traditional VPS
1. Install Node.js and dependencies
2. Set up PM2 for process management
3. Configure Nginx reverse proxy
4. Set up SSL certificates

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Lint code
npm run lint
```

## 📊 Monitoring

- Health check endpoint: `GET /health`
- API documentation: `GET /api`
- Logs are written to console and can be configured for file output

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🏆 Hackathon Alignment

This solution perfectly aligns with the Gen AI Exchange Hackathon requirements:

- ✅ **Personalized Career Guidance**: AI-powered recommendations based on user profile
- ✅ **Skills Assessment**: Comprehensive psychometric and skills evaluations
- ✅ **Market Intelligence**: Real-time job market trends using BigQuery
- ✅ **Indian Student Focus**: Tailored for Indian education system and job market
- ✅ **Google Cloud Integration**: Uses Firestore, BigQuery, and other GCP services
- ✅ **AI-Powered**: Leverages OpenAI for intelligent analysis and recommendations

## 📞 Support

For support or questions, please contact the development team or create an issue in the repository.
