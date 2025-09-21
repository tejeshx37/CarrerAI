import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { assessmentAPI } from '../services/api';
import { 
  Map, 
  ArrowLeft, 
  Target, 
  Calendar, 
  BookOpen, 
  Award,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Zap,
  ArrowRight,
  Download,
  Share2,
  Edit3,
  Plus,
  Minus
} from 'lucide-react';

const CareerRoadmap = () => {
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPhase, setSelectedPhase] = useState('short_term');
  const [expandedMilestones, setExpandedMilestones] = useState({});

  const phases = [
    { id: 'short_term', name: '6 Months', duration: 'Short Term', color: 'bg-green-500' },
    { id: 'medium_term', name: '1 Year', duration: 'Medium Term', color: 'bg-blue-500' },
    { id: 'long_term', name: '3 Years', duration: 'Long Term', color: 'bg-purple-500' }
  ];

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    setLoading(true);
    setError(null);
    try {
      // Mock roadmap data
      const mockRoadmap = {
        short_term: {
          duration: "6 months",
          goals: [
            "Complete foundational courses in your chosen field",
            "Build 3-5 portfolio projects demonstrating your skills",
            "Network with 20+ professionals in your industry",
            "Get certified in 1-2 relevant technologies"
          ],
          skills: [
            "Technical fundamentals",
            "Communication and presentation",
            "Project management basics",
            "Industry-specific knowledge"
          ],
          milestones: [
            {
              id: 1,
              title: "Complete Online Course",
              description: "Finish a comprehensive course in your chosen technology",
              deadline: "Month 2",
              status: "pending",
              priority: "high",
              resources: ["Coursera", "Udemy", "edX"]
            },
            {
              id: 2,
              title: "Build First Project",
              description: "Create a portfolio project showcasing your skills",
              deadline: "Month 3",
              status: "pending",
              priority: "high",
              resources: ["GitHub", "Portfolio Website"]
            },
            {
              id: 3,
              title: "Attend Networking Event",
              description: "Participate in 2-3 industry meetups or conferences",
              deadline: "Month 4",
              status: "pending",
              priority: "medium",
              resources: ["Meetup.com", "Eventbrite", "LinkedIn Events"]
            },
            {
              id: 4,
              title: "Get Industry Certification",
              description: "Earn a relevant professional certification",
              deadline: "Month 6",
              status: "pending",
              priority: "high",
              resources: ["AWS", "Google Cloud", "Microsoft", "Industry Bodies"]
            }
          ]
        },
        medium_term: {
          duration: "1 year",
          goals: [
            "Gain 6+ months of practical work experience",
            "Specialize in 2-3 specific areas within your field",
            "Build a strong professional network (100+ connections)",
            "Lead or contribute to a significant project"
          ],
          skills: [
            "Advanced technical skills",
            "Leadership and team management",
            "Industry expertise",
            "Mentoring and knowledge sharing"
          ],
          milestones: [
            {
              id: 5,
              title: "Land First Job/Internship",
              description: "Secure employment or internship in your target field",
              deadline: "Month 8",
              status: "pending",
              priority: "high",
              resources: ["LinkedIn", "Job Boards", "Company Websites"]
            },
            {
              id: 6,
              title: "Complete Specialization",
              description: "Deep dive into 2-3 specific areas of expertise",
              deadline: "Month 10",
              status: "pending",
              priority: "high",
              resources: ["Advanced Courses", "Industry Training", "Mentorship"]
            },
            {
              id: 7,
              title: "Build Professional Network",
              description: "Connect with 100+ professionals in your industry",
              deadline: "Month 12",
              status: "pending",
              priority: "medium",
              resources: ["LinkedIn", "Industry Events", "Professional Groups"]
            },
            {
              id: 8,
              title: "Lead Project",
              description: "Take leadership role in a significant project",
              deadline: "Month 12",
              status: "pending",
              priority: "high",
              resources: ["Work Projects", "Open Source", "Volunteer Work"]
            }
          ]
        },
        long_term: {
          duration: "3 years",
          goals: [
            "Become a recognized expert in your domain",
            "Take on senior or leadership positions",
            "Mentor junior professionals and give back to community",
            "Consider entrepreneurship or consulting opportunities"
          ],
          skills: [
            "Domain expertise and thought leadership",
            "Strategic thinking and planning",
            "Team leadership and management",
            "Business acumen and entrepreneurship"
          ],
          milestones: [
            {
              id: 9,
              title: "Become Industry Expert",
              description: "Gain recognition as a subject matter expert",
              deadline: "Year 2",
              status: "pending",
              priority: "high",
              resources: ["Speaking Engagements", "Publications", "Industry Recognition"]
            },
            {
              id: 10,
              title: "Senior Position",
              description: "Advance to senior or leadership role",
              deadline: "Year 2.5",
              status: "pending",
              priority: "high",
              resources: ["Internal Promotion", "External Opportunities", "Leadership Training"]
            },
            {
              id: 11,
              title: "Mentor Others",
              description: "Start mentoring junior professionals",
              deadline: "Year 3",
              status: "pending",
              priority: "medium",
              resources: ["Company Programs", "Online Communities", "Educational Institutions"]
            },
            {
              id: 12,
              title: "Consider Entrepreneurship",
              description: "Evaluate starting your own venture or consulting",
              deadline: "Year 3",
              status: "pending",
              priority: "low",
              resources: ["Business Incubators", "Mentorship", "Industry Connections"]
            }
          ]
        },
        learning_resources: [
          {
            name: "Online Learning Platforms",
            platforms: ["Coursera", "Udemy", "edX", "Pluralsight"],
            focus: "Technical Skills and Certifications",
            cost: "₹2,000 - ₹15,000 per course"
          },
          {
            name: "Industry Certifications",
            platforms: ["AWS", "Google Cloud", "Microsoft", "Industry Bodies"],
            focus: "Professional Credibility and Recognition",
            cost: "₹5,000 - ₹50,000 per certification"
          },
          {
            name: "Networking and Events",
            platforms: ["LinkedIn", "Meetup", "Conference Websites"],
            focus: "Professional Network and Industry Insights",
            cost: "Free - ₹10,000 per event"
          },
          {
            name: "Mentorship Programs",
            platforms: ["Company Programs", "Online Communities", "Professional Associations"],
            focus: "Guidance and Career Development",
            cost: "Free - ₹5,000 per month"
          }
        ],
        generated_at: new Date().toISOString(),
        user_id: user?.id
      };
      
      setRoadmap(mockRoadmap);
    } catch (err) {
      console.error('Error fetching roadmap:', err);
      setError('Failed to load career roadmap');
    } finally {
      setLoading(false);
    }
  };

  const toggleMilestone = (milestoneId) => {
    setExpandedMilestones(prev => ({
      ...prev,
      [milestoneId]: !prev[milestoneId]
    }));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-gray-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Generating your career roadmap...</p>
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
            onClick={fetchRoadmap}
            className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto text-center p-6 bg-white rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Roadmap Available</h2>
          <p className="text-gray-700 mb-6">Please complete assessments to generate your personalized career roadmap.</p>
          <button
            onClick={() => window.location.href = '/questions'}
            className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Take Assessment
          </button>
        </div>
      </div>
    );
  }

  const currentPhase = roadmap[selectedPhase];

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
                <h1 className="text-2xl font-bold text-gray-900">Career Roadmap</h1>
                <p className="text-gray-600">Your personalized career development path</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Edit3 className="h-4 w-4" />
                <span>Customize</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Phase Selector */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex space-x-1">
              {phases.map((phase) => (
                <button
                  key={phase.id}
                  onClick={() => setSelectedPhase(phase.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                    selectedPhase === phase.id
                      ? 'bg-primary-100 text-primary-700 border border-primary-200'
                      : 'text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${phase.color}`}></div>
                  <div className="text-left">
                    <div className="text-sm font-medium">{phase.name}</div>
                    <div className="text-xs text-gray-500">{phase.duration}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Goals and Skills */}
          <div className="lg:col-span-1 space-y-6">
            {/* Goals */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="h-5 w-5 text-green-600 mr-2" />
                Goals ({currentPhase.duration})
              </h3>
              <ul className="space-y-3">
                {currentPhase.goals.map((goal, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <span className="text-sm text-gray-700">{goal}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills to Develop */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                Skills to Develop
              </h3>
              <div className="space-y-2">
                {currentPhase.skills.map((skill, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Resources */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="h-5 w-5 text-purple-600 mr-2" />
                Learning Resources
              </h3>
              <div className="space-y-4">
                {roadmap.learning_resources.map((resource, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">{resource.name}</h4>
                    <p className="text-xs text-gray-600 mb-2">{resource.focus}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {resource.platforms.map((platform, pIndex) => (
                        <span key={pIndex} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {platform}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">{resource.cost}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Milestones */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Calendar className="h-5 w-5 text-orange-600 mr-2" />
                Milestones & Timeline
              </h3>
              
              <div className="space-y-4">
                {currentPhase.milestones.map((milestone, index) => (
                  <div key={milestone.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="flex-shrink-0 mt-1">
                          {getStatusIcon(milestone.status)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-sm font-medium text-gray-900">{milestone.title}</h4>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(milestone.priority)}`}>
                              {milestone.priority}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              Due: {milestone.deadline}
                            </span>
                            <span className="flex items-center">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              {milestone.resources.length} resources
                            </span>
                          </div>
                          
                          {/* Expandable Resources */}
                          <button
                            onClick={() => toggleMilestone(milestone.id)}
                            className="mt-2 flex items-center text-xs text-primary-600 hover:text-primary-700"
                          >
                            {expandedMilestones[milestone.id] ? (
                              <>
                                <Minus className="h-3 w-3 mr-1" />
                                Hide Resources
                              </>
                            ) : (
                              <>
                                <Plus className="h-3 w-3 mr-1" />
                                Show Resources
                              </>
                            )}
                          </button>
                          
                          {expandedMilestones[milestone.id] && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <h5 className="text-xs font-medium text-gray-900 mb-2">Recommended Resources:</h5>
                              <div className="flex flex-wrap gap-2">
                                {milestone.resources.map((resource, rIndex) => (
                                  <span key={rIndex} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                    {resource}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <button className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600">
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="mt-8 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Zap className="h-5 w-5 text-primary-600 mr-2" />
            Your Progress Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 mb-1">0%</div>
              <div className="text-sm text-gray-600">Overall Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">0</div>
              <div className="text-sm text-gray-600">Milestones Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">{currentPhase.milestones.length}</div>
              <div className="text-sm text-gray-600">Total Milestones</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CareerRoadmap;

