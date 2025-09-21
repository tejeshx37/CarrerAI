# 🚀 Deployment Guide

This guide covers various deployment options for CareerBridgeAI.

## 📋 Prerequisites

- **Python 3.8+**
- **Node.js 16+**
- **Docker** (optional)
- **Domain name** (for production)
- **SSL certificate** (for HTTPS)

## 🐳 Docker Deployment (Recommended)

### 1. Create Dockerfile for Backend

```dockerfile
# backend/Dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "4", "flask_app:app"]
```

### 2. Create Dockerfile for Frontend

```dockerfile
# frontend/Dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 3. Create Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - FLASK_ENV=production
      - SECRET_KEY=your-secret-key
    volumes:
      - ./backend:/app
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - backend
      - frontend
    restart: unless-stopped
```

### 4. Deploy with Docker

```bash
# Build and start services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## ☁️ Cloud Deployment

### Google Cloud Platform

#### 1. Deploy Backend to Cloud Run

```bash
# Build and push container
gcloud builds submit --tag gcr.io/PROJECT_ID/careerbridge-backend ./backend

# Deploy to Cloud Run
gcloud run deploy careerbridge-backend \
  --image gcr.io/PROJECT_ID/careerbridge-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### 2. Deploy Frontend to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize Firebase
firebase init hosting

# Build and deploy
cd frontend
npm run build
firebase deploy
```

### AWS Deployment

#### 1. Deploy Backend to Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize EB
eb init

# Create environment
eb create production

# Deploy
eb deploy
```

#### 2. Deploy Frontend to S3 + CloudFront

```bash
# Build frontend
cd frontend
npm run build

# Upload to S3
aws s3 sync build/ s3://your-bucket-name

# Create CloudFront distribution
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
```

### Heroku Deployment

#### 1. Backend Deployment

```bash
# Install Heroku CLI
# Create Procfile
echo "web: gunicorn flask_app:app" > Procfile

# Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

#### 2. Frontend Deployment

```bash
# Install Heroku CLI
# Create static buildpack
heroku create your-app-name --buildpack https://github.com/heroku/heroku-buildpack-static

# Deploy
git subtree push --prefix frontend heroku main
```

## 🔧 Environment Configuration

### Production Environment Variables

#### Backend (.env)
```bash
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=your-super-secret-key
DATABASE_URL=postgresql://user:pass@host:port/db
REDIS_URL=redis://localhost:6379
CORS_ORIGINS=https://yourdomain.com
```

#### Frontend (.env)
```bash
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_ENV=production
REACT_APP_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
```

## 🔒 SSL/HTTPS Setup

### Let's Encrypt (Free SSL)

```bash
# Install Certbot
sudo apt-get install certbot

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Nginx Configuration

```nginx
# nginx.conf
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://frontend:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📊 Monitoring and Logging

### Application Monitoring

#### 1. Health Checks

```python
# backend/health.py
@app.route('/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '2.0.0'
    })
```

#### 2. Logging Configuration

```python
# backend/logging.py
import logging
from logging.handlers import RotatingFileHandler

if not app.debug:
    file_handler = RotatingFileHandler('logs/careerbridge.log', maxBytes=10240, backupCount=10)
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
```

### Performance Monitoring

#### 1. Database Monitoring

```python
# Monitor database performance
import time
from functools import wraps

def monitor_db_performance(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        
        if end_time - start_time > 1.0:  # Log slow queries
            app.logger.warning(f"Slow query: {func.__name__} took {end_time - start_time:.2f}s")
        
        return result
    return wrapper
```

#### 2. API Rate Limiting

```python
# backend/rate_limiting.py
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

@app.route('/api/assessments/submit-answers', methods=['POST'])
@limiter.limit("10 per minute")
def submit_answers():
    # Implementation
    pass
```

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Test Backend
        run: |
          cd backend
          pip install -r requirements.txt
          python -m pytest
      - name: Test Frontend
        run: |
          cd frontend
          npm install
          npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Cloud Run
        run: |
          gcloud builds submit --tag gcr.io/$PROJECT_ID/careerbridge
          gcloud run deploy --image gcr.io/$PROJECT_ID/careerbridge
```

## 📈 Scaling

### Horizontal Scaling

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  backend:
    image: careerbridge-backend:latest
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
    environment:
      - FLASK_ENV=production

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
```

### Database Scaling

```python
# backend/database.py
from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool

# Connection pooling for better performance
engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=20,
    max_overflow=30,
    pool_pre_ping=True
)
```

## 🚨 Troubleshooting

### Common Issues

#### 1. CORS Errors
```python
# backend/cors.py
from flask_cors import CORS

CORS(app, origins=[
    "https://yourdomain.com",
    "https://www.yourdomain.com"
])
```

#### 2. Database Connection Issues
```python
# backend/db_health.py
@app.route('/db-health')
def db_health():
    try:
        db.session.execute('SELECT 1')
        return jsonify({'status': 'healthy'})
    except Exception as e:
        return jsonify({'status': 'unhealthy', 'error': str(e)}), 500
```

#### 3. Memory Issues
```bash
# Monitor memory usage
docker stats

# Increase memory limits
docker run -m 1g careerbridge-backend
```

