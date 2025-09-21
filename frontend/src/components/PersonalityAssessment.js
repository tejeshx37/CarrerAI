import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { assessmentAPI } from '../services/api';
import { 
  Brain, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Target,
  TrendingUp,
  Users,
  Lightbulb,
  Heart,
  Zap
} from 'lucide-react';

const PersonalityAssessment = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      try {
        // Mock personality questions for now
        const mockQuestions = [
          {
            "id": 1,
            "question": "In a group project, you prefer to:",
            "type": "single",
            "category": "leadership",
            "options": [
              {"text": "Take charge and lead the team", "score": {"leadership": 3, "extroversion": 2}},
              {"text": "Collaborate equally with everyone", "score": {"teamwork": 3, "communication": 2}},
              {"text": "Focus on your specific tasks", "score": {"focus": 3, "independence": 2}},
              {"text": "Support others and help where needed", "score": {"support": 3, "empathy": 2}}
            ]
          },
          {
            "id": 2,
            "question": "When facing a difficult problem, you:",
            "type": "single",
            "category": "problem_solving",
            "options": [
              {"text": "Analyze it step by step", "score": {"analytical": 3, "methodical": 2}},
              {"text": "Brainstorm creative solutions", "score": {"creativity": 3, "innovation": 2}},
              {"text": "Ask for help from others", "score": {"collaboration": 3, "communication": 2}},
              {"text": "Research similar problems", "score": {"research": 3, "learning": 2}}
            ]
          },
          {
            "id": 3,
            "question": "Your ideal work environment is:",
            "type": "single",
            "category": "work_style",
            "options": [
              {"text": "Quiet and focused", "score": {"introversion": 3, "focus": 2}},
              {"text": "Dynamic and interactive", "score": {"extroversion": 3, "energy": 2}},
              {"text": "Structured and organized", "score": {"organization": 3, "planning": 2}},
              {"text": "Flexible and adaptable", "score": {"adaptability": 3, "flexibility": 2}}
            ]
          },
          {
            "id": 4,
            "question": "When learning something new, you prefer to:",
            "type": "single",
            "category": "learning_style",
            "options": [
              {"text": "Read and study independently", "score": {"independence": 3, "reading": 2}},
              {"text": "Watch videos and demonstrations", "score": {"visual": 3, "observation": 2}},
              {"text": "Practice hands-on immediately", "score": {"kinesthetic": 3, "practical": 2}},
              {"text": "Discuss with others", "score": {"social": 3, "communication": 2}}
            ]
          },
          {
            "id": 5,
            "question": "In stressful situations, you:",
            "type": "single",
            "category": "stress_management",
            "options": [
              {"text": "Stay calm and think logically", "score": {"calmness": 3, "logic": 2}},
              {"text": "Take action quickly", "score": {"action": 3, "decisiveness": 2}},
              {"text": "Seek support from others", "score": {"support_seeking": 3, "social": 2}},
              {"text": "Take breaks to recharge", "score": {"self_care": 3, "balance": 2}}
            ]
          },
          {
            "id": 6,
            "question": "Your communication style is:",
            "type": "single",
            "category": "communication",
            "options": [
              {"text": "Direct and to the point", "score": {"directness": 3, "efficiency": 2}},
              {"text": "Detailed and comprehensive", "score": {"thoroughness": 3, "detail": 2}},
              {"text": "Encouraging and supportive", "score": {"encouragement": 3, "empathy": 2}},
              {"text": "Collaborative and inclusive", "score": {"collaboration": 3, "inclusivity": 2}}
            ]
          },
          {
            "id": 7,
            "question": "When making decisions, you rely most on:",
            "type": "single",
            "category": "decision_making",
            "options": [
              {"text": "Data and facts", "score": {"analytical": 3, "evidence": 2}},
              {"text": "Intuition and gut feeling", "score": {"intuition": 3, "instinct": 2}},
              {"text": "Others' opinions and advice", "score": {"collaboration": 3, "social": 2}},
              {"text": "Past experiences", "score": {"experience": 3, "wisdom": 2}}
            ]
          },
          {
            "id": 8,
            "question": "Your motivation comes from:",
            "type": "single",
            "category": "motivation",
            "options": [
              {"text": "Achieving personal goals", "score": {"achievement": 3, "personal": 2}},
              {"text": "Helping others succeed", "score": {"altruism": 3, "service": 2}},
              {"text": "Learning and growing", "score": {"growth": 3, "learning": 2}},
              {"text": "Recognition and rewards", "score": {"recognition": 3, "external": 2}}
            ]
          }
        ];
        setQuestions(mockQuestions);
      } catch (error) {
        console.error('Failed to load questions:', error);
        setError('Failed to load personality questions');
      }
      setLoading(false);
    };

    loadQuestions();
  }, []);

  const handleAnswer = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Mock results for now
      const mockResults = {
        personality_type: "The Collaborator",
        top_traits: [
          { trait: "Teamwork", score: 8.5 },
          { trait: "Communication", score: 8.2 },
          { trait: "Empathy", score: 7.9 },
          { trait: "Leadership", score: 7.5 },
          { trait: "Creativity", score: 7.2 }
        ],
        strengths: ["Teamwork", "Communication", "Empathy"],
        development_areas: ["Technical Skills", "Analytical Thinking"],
        career_recommendations: ["Project Manager", "Team Lead", "Consultant"],
        ideal_environments: ["Collaborative", "Dynamic", "Supportive"],
        leadership_style: "Collaborative and supportive",
        communication_preferences: "Direct and encouraging",
        learning_recommendations: ["Hands-on projects", "Group learning", "Mentorship"]
      };
      
      setResults(mockResults);
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit assessment:', error);
      setError('Failed to submit personality assessment');
    }
    setSubmitting(false);
  };

  const getPersonalityIcon = (type) => {
    switch (type) {
      case "The Leader": return <Target className="h-6 w-6" />;
      case "The Collaborator": return <Users className="h-6 w-6" />;
      case "The Analyst": return <TrendingUp className="h-6 w-6" />;
      case "The Creator": return <Lightbulb className="h-6 w-6" />;
      case "The Supporter": return <Heart className="h-6 w-6" />;
      default: return <Brain className="h-6 w-6" />;
    }
  };

  const getPersonalityColor = (type) => {
    switch (type) {
      case "The Leader": return "text-red-600 bg-red-100";
      case "The Collaborator": return "text-blue-600 bg-blue-100";
      case "The Analyst": return "text-green-600 bg-green-100";
      case "The Creator": return "text-purple-600 bg-purple-100";
      case "The Supporter": return "text-pink-600 bg-pink-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading personality assessment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto text-center p-6 bg-white rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (submitted && results) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => window.history.back()}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Back</span>
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Personality Assessment Results</h1>
                  <p className="text-gray-600">Your personalized personality profile</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Results */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Personality Type */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8 text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${getPersonalityColor(results.personality_type)} mb-4`}>
              {getPersonalityIcon(results.personality_type)}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{results.personality_type}</h2>
            <p className="text-lg text-gray-600 mb-6">
              Your personality assessment reveals a collaborative and empathetic approach to work and life.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => window.location.href = '/recommendations'}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Get Recommendations
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Traits */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Zap className="h-5 w-5 text-yellow-500 mr-2" />
                Your Top Traits
              </h3>
              <div className="space-y-4">
                {results.top_traits.map((trait, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{trait.trait}</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
                          style={{ width: `${(trait.score / 10) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{trait.score}/10</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & Development Areas */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="h-5 w-5 text-green-500 mr-2" />
                Strengths & Development
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Your Strengths</h4>
                  <div className="flex flex-wrap gap-2">
                    {results.strengths.map((strength, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {strength}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Areas for Development</h4>
                  <div className="flex flex-wrap gap-2">
                    {results.development_areas.map((area, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Career Recommendations */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                Career Recommendations
              </h3>
              <div className="space-y-3">
                {results.career_recommendations.map((role, index) => (
                  <div key={index} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-gray-900">{role}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Work Style Insights */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="h-5 w-5 text-purple-500 mr-2" />
                Work Style Insights
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Ideal Work Environments</h4>
                  <p className="text-sm text-gray-600">{results.ideal_environments.join(", ")}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Leadership Style</h4>
                  <p className="text-sm text-gray-600">{results.leadership_style}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Communication Style</h4>
                  <p className="text-sm text-gray-600">{results.communication_preferences}</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Personality Assessment</h1>
                <p className="text-gray-600">Discover your work style and preferences</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>10-15 min</span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium text-gray-700">{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Question */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-4">
              <Brain className="h-6 w-6 text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{currentQ?.question}</h2>
            <p className="text-gray-600">Select the option that best describes you</p>
          </div>

          <div className="space-y-4 mb-8">
            {currentQ?.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(currentQ.id, index)}
                className={`w-full p-4 text-left border rounded-lg transition-colors ${
                  answers[currentQ.id] === index
                    ? 'border-primary-500 bg-primary-50 text-primary-900'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    answers[currentQ.id] === index
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-gray-300'
                  }`}>
                    {answers[currentQ.id] === index && (
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                    )}
                  </div>
                  <span className="text-sm font-medium">{option.text}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <div className="flex space-x-2">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentQuestion
                      ? 'bg-primary-500'
                      : answers[index] !== undefined
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                ></div>
              ))}
            </div>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={submitting || answers[currentQ.id] === undefined}
                className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Complete Assessment</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={answers[currentQ.id] === undefined}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PersonalityAssessment;

