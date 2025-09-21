# 🚀 CareerBridgeAI

> **AI-Powered Career Guidance Platform for Students**

CareerBridgeAI is an intelligent career guidance platform that helps students discover their ideal career paths through AI-powered assessments, personalized recommendations, and real-time market insights.

![CareerBridgeAI](https://img.shields.io/badge/Version-2.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Python](https://img.shields.io/badge/Python-3.8+-blue)
![React](https://img.shields.io/badge/React-18.0+-blue)
![Flask](https://img.shields.io/badge/Flask-2.0+-green)

## ✨ Features

### 🎯 Core Functionality
- **AI-Powered Assessments**: Comprehensive personality and skills evaluations
- **Dynamic Recommendations**: Personalized career guidance based on student responses
- **Real-time Market Insights**: Live job market trends and opportunities
- **Interactive Dashboard**: Beautiful, animated user interface with progress tracking
- **Achievement System**: Gamified learning with badges and milestones

### 🛠️ Technical Features
- **Modern React Frontend**: Responsive, animated UI with Tailwind CSS
- **Flask Backend**: RESTful API with intelligent recommendation algorithms
- **Smart Analytics**: Dynamic analysis of user responses and market data
- **Secure Authentication**: JWT-based user authentication system
- **Real-time Updates**: Live clock, motivational quotes, and progress tracking

## 🏗️ Architecture

```
CareerBridgeAI/
├── 📁 backend/                 # Flask API Server
│   ├── 📁 auth/               # Authentication modules
│   ├── 📁 config/             # Configuration files
│   ├── 📁 models/             # Data models
│   ├── 📁 routers/            # API routes
│   ├── 📁 services/           # Business logic
│   ├── 📄 flask_app.py        # Main Flask application
│   └── 📄 requirements.txt    # Python dependencies
├── 📁 frontend/               # React Application
│   ├── 📁 public/             # Static assets
│   ├── 📁 src/                # Source code
│   │   ├── 📁 components/     # React components
│   │   ├── 📁 contexts/       # React contexts
│   │   └── 📁 services/       # API services
│   ├── 📄 package.json        # Node.js dependencies
│   └── 📄 tailwind.config.js  # Tailwind configuration
├── 📁 docs/                   # Documentation
├── 📄 .gitignore              # Git ignore rules
└── 📄 README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- **Python 3.8+**
- **Node.js 16+**
- **npm or yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tejeshx37/CarrerAI.git
   cd CareerBridgeAI
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Configuration**
   ```bash
   # Backend
   cp backend/env.example backend/.env
   # Edit backend/.env with your configuration
   
   # Frontend
   cp frontend/env.example frontend/.env
   # Edit frontend/.env with your API URL
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   source venv/bin/activate
   python flask_app.py
   ```
   Backend will run on: `http://localhost:8000`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm start
   ```
   Frontend will run on: `http://localhost:3000`

3. **Access the Application**
   Open your browser and navigate to `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Assessment Endpoints
- `GET /api/assessments/questions` - Get assessment questions
- `POST /api/assessments/submit-answers` - Submit assessment answers
- `GET /api/assessments/recommendations` - Get personalized recommendations

### Career Guidance Endpoints
- `GET /api/career/trends` - Get market trends
- `GET /api/career/opportunities` - Get career opportunities
- `POST /api/career/roadmap` - Generate career roadmap

## 🎨 Frontend Components

### Core Components
- **Dashboard**: Main user interface with animated statistics
- **PersonalityAssessment**: Interactive assessment interface
- **Recommendations**: Dynamic career recommendations display
- **Questions**: Assessment question interface
- **AnimatedCounter**: Animated number display component
- **ProgressRing**: Circular progress indicator

### Features
- **Real-time Clock**: Live time and date display
- **Motivational Quotes**: Dynamic inspirational messages
- **Achievement System**: Badge collection and progress tracking
- **Responsive Design**: Mobile-first, responsive layout
- **Smooth Animations**: CSS transitions and hover effects

## 🔧 Configuration

### Backend Configuration
```python
# backend/.env
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=your-database-url
```

### Frontend Configuration
```javascript
// frontend/.env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENV=development
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
python -m pytest tests/
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📦 Deployment

### Production Build
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 flask_app:app
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Acknowledgments

- **Google Cloud Platform** for hosting and services
- **OpenAI** for AI-powered recommendations
- **React Community** for excellent documentation
- **Flask Community** for robust backend framework


---

<div align="center">
  <strong>Built with ❤️ for the future of career guidance</strong>
  <br>
  <a href="https://github.com/tejeshx37/CarrerAI">⭐ Star this repository</a>
</div>
