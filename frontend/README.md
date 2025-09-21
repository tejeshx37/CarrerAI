# 🎨 CareerBridgeAI Frontend

Modern React application for the CareerBridgeAI platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up environment
cp env.example .env
# Edit .env with your API URL

# Start development server
npm start
```

## 📁 Project Structure

```
frontend/
├── public/              # Static assets
│   └── index.html      # HTML template
├── src/                # Source code
│   ├── components/     # React components
│   │   ├── AnimatedCounter.js    # Animated number display
│   │   ├── AuthPage.js          # Authentication page
│   │   ├── CareerRoadmap.js     # Career roadmap display
│   │   ├── Dashboard.js         # Main dashboard
│   │   ├── LoginForm.js         # Login form
│   │   ├── MarketTrends.js      # Market trends display
│   │   ├── PersonalityAssessment.js # Assessment interface
│   │   ├── ProgressRing.js      # Circular progress indicator
│   │   ├── ProtectedRoute.js    # Route protection
│   │   ├── Questions.js         # Assessment questions
│   │   ├── Recommendations.js   # Recommendations display
│   │   └── SignupForm.js        # Signup form
│   ├── contexts/       # React contexts
│   │   └── AuthContext.js       # Authentication context
│   ├── services/       # API services
│   │   └── api.js              # API client
│   ├── App.js         # Main App component
│   ├── index.css      # Global styles
│   └── index.js       # Entry point
├── package.json       # Dependencies and scripts
└── tailwind.config.js # Tailwind CSS configuration
```

## 🎨 Features

### Core Components
- **Dashboard**: Animated statistics and user overview
- **Assessment**: Interactive personality and skills assessment
- **Recommendations**: Dynamic career recommendations
- **Progress Tracking**: Visual progress indicators
- **Responsive Design**: Mobile-first approach

### UI Components
- **AnimatedCounter**: Smooth number animations
- **ProgressRing**: Circular progress indicators
- **Interactive Forms**: Modern form components
- **Real-time Updates**: Live clock and quotes

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Run linting
npm run lint

# Format code
npm run format
```

### Environment Variables

```bash
# API Configuration
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENV=development

# Analytics (optional)
REACT_APP_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
```

## 🎨 Styling

### Tailwind CSS

The project uses Tailwind CSS for styling. Key classes:

```css
/* Primary colors */
bg-primary-600    /* Primary background */
text-primary-600  /* Primary text */
border-primary-600 /* Primary border */

/* Gradients */
bg-gradient-to-r  /* Left to right gradient */
from-blue-500     /* Gradient start */
to-purple-600     /* Gradient end */

/* Animations */
transition-all    /* Smooth transitions */
hover:scale-105   /* Hover scale effect */
animate-pulse     /* Pulse animation */
```

### Custom Components

```jsx
// Animated Counter
<AnimatedCounter 
  end={85} 
  duration={2000} 
  suffix="%" 
/>

// Progress Ring
<ProgressRing 
  progress={75} 
  size={120} 
  color="#4F46E5" 
/>
```

## 🧪 Testing

### Component Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test
npm test -- --testNamePattern="Dashboard"
```

### Test Structure

```javascript
// Example test
import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';

describe('Dashboard Component', () => {
  test('renders welcome message', () => {
    render(<Dashboard />);
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  });
});
```

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile First */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
```

### Mobile Optimization

- Touch-friendly buttons (min 44px)
- Optimized images and assets
- Fast loading with code splitting
- Offline support with service workers

## 🚀 Performance

### Optimization Techniques

- **Code Splitting**: Lazy loading of components
- **Image Optimization**: WebP format with fallbacks
- **Bundle Analysis**: Webpack bundle analyzer
- **Caching**: Service worker for offline support

### Performance Monitoring

```javascript
// Performance metrics
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## 🔧 Build and Deployment

### Production Build

```bash
# Create production build
npm run build

# Serve locally
npx serve -s build
```

### Environment-specific Builds

```bash
# Development
npm run build:dev

# Staging
npm run build:staging

# Production
npm run build:prod
```

## 📚 API Integration

### API Client

```javascript
// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Error Handling

```javascript
// Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 🎯 Accessibility

### WCAG Compliance

- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: ARIA labels and roles
- **Color Contrast**: WCAG AA compliance
- **Focus Management**: Visible focus indicators

### Accessibility Testing

```bash
# Install axe-core
npm install --save-dev @axe-core/react

# Run accessibility tests
npm run test:a11y
```

## 🔒 Security

### Best Practices

- **Input Validation**: Client-side validation
- **XSS Protection**: Sanitized user input
- **CSRF Protection**: Token-based protection
- **Secure Headers**: Content Security Policy

## 📊 Analytics

### Google Analytics

```javascript
// Analytics setup
import ReactGA from 'react-ga4';

ReactGA.initialize('GA_MEASUREMENT_ID');

// Track page views
ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**: Check API URL configuration
2. **Build Failures**: Clear node_modules and reinstall
3. **Styling Issues**: Check Tailwind configuration
4. **Performance**: Use React DevTools Profiler

### Debug Tools

```bash
# Install React DevTools
# Chrome Extension: React Developer Tools

# Bundle analyzer
npm install --save-dev webpack-bundle-analyzer
npm run analyze
```

## 📞 Support

- **Documentation**: [Frontend Docs](../docs/)
- **Issues**: [GitHub Issues](https://github.com/tejeshx37/CarrerAI/issues)
- **Discussions**: [GitHub Discussions](https://github.com/tejeshx37/CarrerAI/discussions)