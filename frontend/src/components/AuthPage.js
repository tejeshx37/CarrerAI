import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { GraduationCap } from 'lucide-react';

const AuthPage = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const navigate = useNavigate();

  const handleToggleMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  const handleAuthSuccess = (userData) => {
    // Redirect to dashboard after successful authentication
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Left Side - Branding */}
          <div className="w-full lg:w-1/2 mb-8 lg:mb-0 lg:pr-12">
            <div className="text-center lg:text-left">
              {/* Logo */}
              <div className="flex items-center justify-center lg:justify-start mb-8">
                <div className="bg-white rounded-2xl p-4 shadow-lg">
                  <GraduationCap className="h-12 w-12 text-primary-600" />
                </div>
                <div className="ml-4">
                  <h1 className="text-3xl font-bold text-white">CareerBridgeAI</h1>
                  <p className="text-green-100">AI-Powered Career Guidance</p>
                </div>
              </div>

              {/* Hero Content */}
              <div className="space-y-6">
                <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                  Your Career Journey Starts Here
                </h2>
                <p className="text-xl text-green-100 leading-relaxed">
                  Get personalized career recommendations, skills assessment, and AI-powered guidance 
                  to help you make informed decisions about your future.
                </p>
                
                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-bold text-sm">1</span>
                    </div>
                    <span className="text-white font-medium">AI Assessment</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-bold text-sm">2</span>
                    </div>
                    <span className="text-white font-medium">Career Matching</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-bold text-sm">3</span>
                    </div>
                    <span className="text-white font-medium">Skill Analysis</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-bold text-sm">4</span>
                    </div>
                    <span className="text-white font-medium">Market Insights</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="w-full lg:w-1/2">
            {isLoginMode ? (
              <LoginForm 
                onToggleMode={handleToggleMode}
                onSuccess={handleAuthSuccess}
              />
            ) : (
              <SignupForm 
                onToggleMode={handleToggleMode}
                onSuccess={handleAuthSuccess}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-green-100 text-sm">
            Perfect for the Gen AI Exchange Hackathon • Built with React & Node.js
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
