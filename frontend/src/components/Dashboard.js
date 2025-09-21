import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Settings, TrendingUp, BookOpen, Target, Brain, BarChart3, Map, Award, Zap, Star, Clock, CheckCircle } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';
import ProgressRing from './ProgressRing';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [motivationalQuote, setMotivationalQuote] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Motivational quotes
    const quotes = [
      "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      "The future belongs to those who believe in the beauty of their dreams.",
      "Your career is a journey, not a destination. Enjoy the ride!",
      "Every expert was once a beginner. Every pro was once an amateur.",
      "The only way to do great work is to love what you do."
    ];
    
    setMotivationalQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const handleTakeAssessment = () => {
    navigate('/questions');
  };

  const handleViewRecommendations = () => {
    navigate('/recommendations');
  };

  const handlePersonalityTest = () => {
    navigate('/personality');
  };

  const handleMarketTrends = () => {
    navigate('/market-trends');
  };

  const handleCareerRoadmap = () => {
    navigate('/roadmap');
  };


  const stats = [
    {
      title: 'Profile Completion',
      value: user?.profileCompletionPercentage || 75,
      icon: User,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      isPercentage: true
    },
    {
      title: 'Career Stage',
      value: user?.currentEducationLevel || 'Entry Level',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      isText: true
    },
    {
      title: 'Interests',
      value: user?.careerInterests?.length || 3,
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      isNumber: true
    },
    {
      title: 'Skills',
      value: (user?.technicalSkills?.length || 0) + (user?.softSkills?.length || 0) + 5,
      icon: BookOpen,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      isNumber: true
    }
  ];

  const achievements = [
    { title: 'First Assessment', description: 'Completed career assessment', icon: CheckCircle, earned: true },
    { title: 'Profile Builder', description: 'Set up your profile', icon: User, earned: true },
    { title: 'Skill Explorer', description: 'Identified 5+ skills', icon: BookOpen, earned: true },
    { title: 'Goal Setter', description: 'Set career goals', icon: Target, earned: false },
    { title: 'Network Builder', description: 'Connected with professionals', icon: Award, earned: false },
    { title: 'Course Completer', description: 'Completed first course', icon: Star, earned: false }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CareerBridgeAI</h1>
              <p className="text-gray-600">Welcome back, {user?.firstName}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section with Time and Quote */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Welcome back, {user?.name || 'Student'}! 👋
              </h2>
              <p className="text-blue-100 mb-4">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true 
                })} • {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <p className="text-blue-100 italic">"{motivationalQuote}"</p>
            </div>
            <div className="mt-4 md:mt-0">
              <ProgressRing progress={stats[0].value} size={100} color="#60A5FA" />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.isPercentage ? (
                      <AnimatedCounter end={stat.value} suffix="%" />
                    ) : stat.isNumber ? (
                      <AnimatedCounter end={stat.value} />
                    ) : (
                      stat.value
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Achievements Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="h-5 w-5 text-yellow-600 mr-2" />
            Your Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border-2 transition-all ${
                  achievement.earned 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <achievement.icon 
                    className={`h-5 w-5 mr-3 ${
                      achievement.earned ? 'text-green-600' : 'text-gray-400'
                    }`} 
                  />
                  <div>
                    <h4 className={`font-medium ${
                      achievement.earned ? 'text-green-800' : 'text-gray-600'
                    }`}>
                      {achievement.title}
                    </h4>
                    <p className={`text-sm ${
                      achievement.earned ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button 
                onClick={handleTakeAssessment}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Career Assessment</p>
                    <p className="text-sm text-gray-500">Discover your path</p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </button>

              <button 
                onClick={handlePersonalityTest}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Brain className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Personality Test</p>
                    <p className="text-sm text-gray-500">Know yourself better</p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </button>

              <button 
                onClick={handleViewRecommendations}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Recommendations</p>
                    <p className="text-sm text-gray-500">AI-powered suggestions</p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </button>

              <button 
                onClick={handleMarketTrends}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Market Trends</p>
                    <p className="text-sm text-gray-500">Industry insights</p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </button>

              <button 
                onClick={handleCareerRoadmap}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Map className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Career Roadmap</p>
                    <p className="text-sm text-gray-500">Your journey plan</p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </button>

            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Coming Soon</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-2">🧠</div>
              <h3 className="font-medium text-gray-900">AI Psychometric Tests</h3>
              <p className="text-sm text-gray-500 mt-1">Comprehensive personality assessment</p>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-medium text-gray-900">Market Trends</h3>
              <p className="text-sm text-gray-500 mt-1">Real-time job market insights</p>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-medium text-gray-900">Career Roadmap</h3>
              <p className="text-sm text-gray-500 mt-1">Personalized learning paths</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
