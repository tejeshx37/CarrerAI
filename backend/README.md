# 🔧 CareerBridgeAI Backend

Flask-based REST API for the CareerBridgeAI platform.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- pip

### Installation

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# For development
pip install -r requirements-dev.txt

# Set up environment
cp env.example .env
# Edit .env with your configuration
```

### Running the Server

```bash
# Development server
python flask_app.py

# Production server
gunicorn -w 4 -b 0.0.0.0:8000 flask_app:app
```

## 📁 Project Structure

```
backend/
├── auth/                 # Authentication modules
│   ├── dependencies.py   # Auth dependencies
│   └── jwt_handler.py    # JWT token handling
├── config/               # Configuration files
│   ├── bigquery.py       # BigQuery configuration
│   └── database.py       # Database configuration
├── models/               # Data models
│   └── user.py          # User model
├── routers/              # API routes
│   ├── assessments.py    # Assessment endpoints
│   ├── auth.py          # Authentication endpoints
│   └── career.py        # Career guidance endpoints
├── services/             # Business logic
│   └── gemini_service.py # AI service integration
├── flask_app.py         # Main Flask application
├── requirements.txt     # Production dependencies
└── requirements-dev.txt # Development dependencies
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Assessments
- `GET /api/assessments/questions` - Get assessment questions
- `POST /api/assessments/submit-answers` - Submit answers
- `GET /api/assessments/recommendations` - Get recommendations

### Career Guidance
- `GET /api/career/trends` - Market trends
- `GET /api/career/opportunities` - Career opportunities

## 🧪 Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=.

# Run specific test file
pytest tests/test_assessments.py
```

## 🔧 Development

### Code Quality

```bash
# Format code
black .

# Sort imports
isort .

# Lint code
flake8 .

# Type checking
mypy .
```

### Pre-commit Hooks

```bash
# Install pre-commit
pre-commit install

# Run on all files
pre-commit run --all-files
```

## 📊 Environment Variables

```bash
# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-secret-key

# Database
DATABASE_URL=sqlite:///careerbridge.db

# External Services
OPENAI_API_KEY=your-openai-key
GEMINI_API_KEY=your-gemini-key

# CORS
CORS_ORIGINS=http://localhost:3000
```

## 🚀 Deployment

See [Deployment Guide](../docs/DEPLOYMENT.md) for detailed deployment instructions.

### Docker

```bash
# Build image
docker build -t careerbridge-backend .

# Run container
docker run -p 8000:8000 careerbridge-backend
```

### Health Check

```bash
curl http://localhost:8000/health
```

## 📚 Documentation

- [API Documentation](../docs/API.md)
- [Deployment Guide](../docs/DEPLOYMENT.md)
- [Contributing Guide](../docs/CONTRIBUTING.md)
