import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { assessmentAPI } from '../services/api';
import { 
  BookOpen, 
  Clock, 
  Star, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

const Recommendations = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await assessmentAPI.getUserRecommendations();
      if (response.success) {
        setRecommendations(response.data.recommendation);
      } else {
        setError(response.message || 'No recommendations found');
      }
    } catch (err) {
      setError('Failed to load recommendations');
      console.error('Error loading recommendations:', err);
    }
    setLoading(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your personalized recommendations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto text-center">
          <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Recommendations Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={loadRecommendations}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Retry</span>
            </button>
            <button
              onClick={() => window.location.href = '/questions'}
              className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Take Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  const recData = recommendations?.recommendations || {};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Career Recommendations</h1>
              <p className="text-gray-600">AI-powered personalized career guidance based on your assessment</p>
              {recData.career_stage && (
                <div className="mt-2 flex items-center space-x-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {recData.career_stage}
                  </span>
                  {recData.match_score && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {recData.match_score}% Match
                    </span>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowRight className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Career Path Overview */}
        {recData.career_path && (
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Target className="h-8 w-8" />
              <h2 className="text-2xl font-bold">Your Recommended Career Path</h2>
            </div>
            <p className="text-primary-100 text-lg">{recData.career_path}</p>
          </div>
        )}

        {/* Learning Path */}
        {recData.learning_path && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="h-6 w-6 text-primary-600" />
              <h3 className="text-xl font-semibold text-gray-900">Learning Path</h3>
            </div>
            <p className="text-gray-700">{recData.learning_path}</p>
          </div>
        )}

        {/* Skill Gaps */}
        {recData.skill_gaps && recData.skill_gaps.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Skills to Develop</h3>
            <div className="flex flex-wrap gap-2">
              {recData.skill_gaps.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Course Recommendations */}
        {recData.courses && recData.courses.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <BookOpen className="h-6 w-6 text-primary-600" />
              <h3 className="text-xl font-semibold text-gray-900">Recommended Courses</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recData.courses.map((course, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 text-lg">{course.title}</h4>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(course.priority)}`}>
                      {course.priority}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">Category:</span>
                      <span className="text-sm text-gray-600">{course.category}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">Difficulty:</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                        {course.difficulty}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{course.duration}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">Platform:</span>
                      <span className="text-sm text-gray-600">{course.platform}</span>
                    </div>
                  </div>
                  
                  {course.reason && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Why this course:</span> {course.reason}
                      </p>
                    </div>
                  )}
                  
                  <button className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    <span>Start Course</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Steps */}
        {recData.next_steps && recData.next_steps.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h3 className="text-xl font-semibold text-gray-900">Next Steps</h3>
            </div>
            <ul className="space-y-2">
              {recData.next_steps.map((step, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-primary-600 text-sm font-medium">{index + 1}</span>
                  </div>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Market Opportunities */}
        {recData.market_opportunities && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
              Market Opportunities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{recData.market_opportunities.growth_rate}</div>
                <div className="text-sm text-gray-600">Growth Rate</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{recData.market_opportunities.avg_salary}</div>
                <div className="text-sm text-gray-600">Average Salary</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{recData.market_opportunities.job_openings}</div>
                <div className="text-sm text-gray-600">Job Openings</div>
              </div>
            </div>
            {recData.market_opportunities.top_skills && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Top Skills in Demand:</h4>
                <div className="flex flex-wrap gap-2">
                  {recData.market_opportunities.top_skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Personality Insights */}
        {recData.personality_insights && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Star className="h-5 w-5 text-yellow-600 mr-2" />
              Personality Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Work Style</h4>
                <p className="text-gray-600">{recData.personality_insights.work_style}</p>
              </div>
              {recData.personality_insights.strengths && recData.personality_insights.strengths.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Your Strengths</h4>
                  <ul className="space-y-1">
                    {recData.personality_insights.strengths.map((strength, index) => (
                      <li key={index} className="text-gray-600 flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {recData.personality_insights.recommendations && recData.personality_insights.recommendations.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Recommendations for You</h4>
                <p className="text-blue-700">{recData.personality_insights.recommendations[0]}</p>
              </div>
            )}
          </div>
        )}

        {/* Career Timeline */}
        {recData.timeline && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="h-5 w-5 text-indigo-600 mr-2" />
              Your Career Timeline
            </h3>
            <div className="space-y-4">
              {Object.entries(recData.timeline).map(([period, goal], index) => (
                <div key={period} className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-indigo-600">{index + 1}</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900 capitalize">{period.replace('_', ' ')}</h4>
                    <p className="text-sm text-gray-600">{goal}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/questions')}
            className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Retake Assessment</span>
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </main>
    </div>
  );
};

export default Recommendations;
