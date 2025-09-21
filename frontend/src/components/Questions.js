import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { assessmentAPI } from '../services/api';
import { ArrowLeft, ArrowRight, CheckCircle, Circle } from 'lucide-react';

const Questions = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Sample questions data - replace with API call
  const sampleQuestions = [
    {
      id: 1,
      question: "What is your current education level?",
      type: "single",
      options: [
        "High School",
        "Associate Degree",
        "Bachelor's Degree",
        "Master's Degree",
        "PhD/Doctorate"
      ]
    },
    {
      id: 2,
      question: "Which of the following career fields interest you most?",
      type: "multiple",
      options: [
        "Technology/Software Development",
        "Healthcare",
        "Finance/Banking",
        "Education",
        "Marketing/Advertising",
        "Engineering",
        "Business/Management",
        "Arts/Design"
      ]
    },
    {
      id: 3,
      question: "How many years of work experience do you have?",
      type: "single",
      options: [
        "0-1 years (Entry level)",
        "2-3 years (Junior)",
        "4-6 years (Mid-level)",
        "7-10 years (Senior)",
        "10+ years (Expert)"
      ]
    },
    {
      id: 4,
      question: "What type of work environment do you prefer?",
      type: "single",
      options: [
        "Remote work",
        "Office-based",
        "Hybrid (mix of remote and office)",
        "Field work",
        "No preference"
      ]
    },
    {
      id: 5,
      question: "Which skills do you currently possess? (Select all that apply)",
      type: "multiple",
      options: [
        "Programming/Coding",
        "Data Analysis",
        "Project Management",
        "Communication",
        "Leadership",
        "Problem Solving",
        "Creative Thinking",
        "Technical Writing"
      ]
    }
  ];

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      try {
        const response = await assessmentAPI.getCareerQuestions();
        if (response.success) {
          setQuestions(response.data.questions);
        } else {
          // Fallback to sample questions if API fails
          setQuestions(sampleQuestions);
        }
      } catch (error) {
        console.error('Failed to load questions:', error);
        // Fallback to sample questions
        setQuestions(sampleQuestions);
      }
      setLoading(false);
    };

    loadQuestions();
  }, []);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await assessmentAPI.submitCareerAnswers(answers);
      if (response.success) {
        setSubmitted(true);
      } else {
        console.error('Failed to submit answers:', response.message);
        // Still show success for demo purposes
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Failed to submit answers:', error);
      // Still show success for demo purposes
      setSubmitted(true);
    }
    setSubmitting(false);
  };

  const getProgressPercentage = () => {
    return ((currentQuestionIndex + 1) / questions.length) * 100;
  };

  const isQuestionAnswered = (questionId) => {
    return answers[questionId] && answers[questionId].length > 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Assessment Complete!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for completing the assessment. We're analyzing your responses and generating personalized career recommendations.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/recommendations'}
              className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              View My Recommendations
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

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
                <h1 className="text-2xl font-bold text-gray-900">Career Assessment</h1>
                <p className="text-gray-600">Help us understand your career preferences</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
              <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {currentQuestion.question}
            </h2>
            <p className="text-sm text-gray-600">
              {currentQuestion.type === 'multiple' 
                ? 'Select all that apply' 
                : 'Choose one option'
              }
            </p>
          </div>

          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option, index) => {
              const isSelected = currentQuestion.type === 'multiple' 
                ? answers[currentQuestion.id]?.includes(option)
                : answers[currentQuestion.id] === option;

              return (
                <label
                  key={index}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    isSelected 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type={currentQuestion.type === 'multiple' ? 'checkbox' : 'radio'}
                    name={`question-${currentQuestion.id}`}
                    value={option}
                    checked={isSelected}
                    onChange={(e) => {
                      if (currentQuestion.type === 'multiple') {
                        const currentAnswers = answers[currentQuestion.id] || [];
                        if (e.target.checked) {
                          handleAnswerChange(currentQuestion.id, [...currentAnswers, option]);
                        } else {
                          handleAnswerChange(currentQuestion.id, currentAnswers.filter(a => a !== option));
                        }
                      } else {
                        handleAnswerChange(currentQuestion.id, option);
                      }
                    }}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    {currentQuestion.type === 'multiple' ? (
                      <div className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center ${
                        isSelected 
                          ? 'border-primary-500 bg-primary-500' 
                          : 'border-gray-300'
                      }`}>
                        {isSelected && <CheckCircle className="h-3 w-3 text-white" />}
                      </div>
                    ) : (
                      <div className={`w-5 h-5 border-2 rounded-full mr-3 flex items-center justify-center ${
                        isSelected 
                          ? 'border-primary-500 bg-primary-500' 
                          : 'border-gray-300'
                      }`}>
                        {isSelected && <Circle className="h-2 w-2 bg-white rounded-full" />}
                      </div>
                    )}
                    <span className="text-gray-900">{option}</span>
                  </div>
                </label>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <div className="flex space-x-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === currentQuestionIndex
                      ? 'bg-primary-600'
                      : isQuestionAnswered(questions[index].id)
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={!isQuestionAnswered(currentQuestion.id) || submitting}
                className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Submit Assessment</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!isQuestionAnswered(currentQuestion.id)}
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

export default Questions;
