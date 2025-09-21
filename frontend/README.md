# CareerBridgeAI Frontend

A modern React frontend for the CareerBridgeAI platform, built for the Gen AI Exchange Hackathon.

## 🚀 Features

- **Modern UI/UX**: Built with React 18 and Tailwind CSS
- **Authentication**: Secure login/signup with JWT tokens
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Connected to backend API
- **User Dashboard**: Personalized career guidance interface

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Backend server running on port 3000

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env
   ```
   
   Update `.env` if needed:
   ```env
   REACT_APP_API_URL=http://localhost:3000/api
   GENERATE_SOURCEMAP=false
   ```

4. **Start development server**
   ```bash
   npm start
   ```

5. **Open in browser**
   ```
   http://localhost:3001
   ```

## 📁 Project Structure

```
src/
├── components/
│   ├── AuthPage.js          # Main authentication page
│   ├── LoginForm.js         # Login form component
│   ├── SignupForm.js        # Signup form component
│   ├── Dashboard.js         # User dashboard
│   └── ProtectedRoute.js    # Route protection
├── contexts/
│   └── AuthContext.js       # Authentication context
├── services/
│   └── api.js               # API service layer
├── App.js                   # Main app component
├── index.js                 # App entry point
└── index.css                # Global styles
```

## 🎨 UI Components

### Authentication Page
- **Login Form**: Email and password authentication
- **Signup Form**: Name, email, password, and confirmation
- **Toggle Mode**: Switch between login and signup
- **Form Validation**: Real-time validation with error messages

### Dashboard
- **User Stats**: Profile completion, career stage, interests, skills
- **Profile Section**: User information display
- **Quick Actions**: Assessment, recommendations, skills analysis
- **Coming Soon**: Preview of upcoming features

## 🔧 Available Scripts

- `npm start`: Start development server
- `npm build`: Build for production
- `npm test`: Run tests
- `npm run eject`: Eject from Create React App

## 🌐 API Integration

The frontend connects to the backend API through:
- **Authentication**: Login, signup, profile management
- **Assessments**: Create, start, complete assessments
- **Career Guidance**: Recommendations, trends, insights

## 🎯 Features Implemented

✅ **Authentication System**
- User registration and login
- JWT token management
- Protected routes
- Automatic token refresh

✅ **Modern UI Components**
- Responsive design
- Form validation
- Loading states
- Error handling

✅ **User Dashboard**
- Profile overview
- Quick actions
- Statistics display
- Navigation

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify/Vercel
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variables

## 🔗 Backend Integration

Make sure your backend server is running:
```bash
cd ../  # Go back to project root
npm run dev  # Start backend server
```

The frontend will automatically connect to `http://localhost:3000/api`.

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Custom Components**: Reusable UI components
- **Responsive Design**: Mobile-first approach
- **Color Scheme**: Green primary color matching CareerBridgeAI branding

## 📱 Responsive Design

- **Mobile**: Optimized for phones (320px+)
- **Tablet**: Optimized for tablets (768px+)
- **Desktop**: Optimized for desktop (1024px+)

## 🧪 Testing

```bash
npm test
```

## 📄 License

MIT License - Part of CareerBridgeAI project for Gen AI Exchange Hackathon.
