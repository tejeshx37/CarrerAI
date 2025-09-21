import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { assessmentAPI } from '../services/api';
import { 
  TrendingUp, 
  ArrowLeft, 
  BarChart3, 
  DollarSign, 
  Users, 
  MapPin,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Target,
  Zap,
  Star,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

const MarketTrends = () => {
  const { user } = useAuth();
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const industries = [
    { id: 'all', name: 'All Industries', color: 'bg-gray-500' },
    { id: 'technology', name: 'Technology', color: 'bg-blue-500' },
    { id: 'healthcare', name: 'Healthcare', color: 'bg-green-500' },
    { id: 'finance', name: 'Finance', color: 'bg-yellow-500' },
    { id: 'education', name: 'Education', color: 'bg-purple-500' }
  ];

  useEffect(() => {
    fetchMarketTrends();
  }, [selectedIndustry]);

  const fetchMarketTrends = async () => {
    setLoading(true);
    setError(null);
    try {
      // Mock market trends data
      const mockTrends = {
        trends: {
          technology: {
            growth_rate: 15.2,
            demand_skills: ["AI/ML", "Cloud Computing", "Cybersecurity", "Data Science"],
            salary_trends: { entry: 600000, mid: 1200000, senior: 2000000 },
            job_openings: 45000,
            remote_percentage: 65,
            top_companies: ["Google", "Microsoft", "Amazon", "Apple", "Meta"],
            emerging_roles: ["AI Engineer", "DevOps Engineer", "Cloud Architect", "Data Scientist"],
            market_sentiment: "Very Positive",
            skill_demand_change: "+23%",
            salary_growth: "+12%"
          },
          healthcare: {
            growth_rate: 12.8,
            demand_skills: ["Digital Health", "Telemedicine", "Data Analytics", "Patient Care"],
            salary_trends: { entry: 500000, mid: 1000000, senior: 1800000 },
            job_openings: 32000,
            remote_percentage: 25,
            top_companies: ["Johnson & Johnson", "Pfizer", "UnitedHealth", "Abbott", "Medtronic"],
            emerging_roles: ["Health Data Analyst", "Telemedicine Specialist", "Digital Health Manager"],
            market_sentiment: "Positive",
            skill_demand_change: "+18%",
            salary_growth: "+8%"
          },
          finance: {
            growth_rate: 8.5,
            demand_skills: ["Fintech", "Blockchain", "Risk Management", "Data Analysis"],
            salary_trends: { entry: 700000, mid: 1400000, senior: 2500000 },
            job_openings: 28000,
            remote_percentage: 40,
            top_companies: ["JPMorgan", "Bank of America", "Goldman Sachs", "Morgan Stanley", "Wells Fargo"],
            emerging_roles: ["Fintech Analyst", "Blockchain Developer", "Risk Analyst", "Quantitative Analyst"],
            market_sentiment: "Stable",
            skill_demand_change: "+15%",
            salary_growth: "+6%"
          },
          education: {
            growth_rate: 6.3,
            demand_skills: ["EdTech", "Online Learning", "Curriculum Design", "Student Assessment"],
            salary_trends: { entry: 400000, mid: 800000, senior: 1500000 },
            job_openings: 18000,
            remote_percentage: 70,
            top_companies: ["Coursera", "Udemy", "Khan Academy", "edX", "Pluralsight"],
            emerging_roles: ["Learning Experience Designer", "EdTech Product Manager", "Online Learning Specialist"],
            market_sentiment: "Growing",
            skill_demand_change: "+12%",
            salary_growth: "+5%"
          }
        },
        ai_analysis: {
          market_summary: "Strong growth across all sectors with technology leading the way. Remote work continues to be a major trend, especially in tech and education sectors.",
          emerging_opportunities: ["AI/ML Engineering", "Cybersecurity", "Digital Health", "EdTech", "Fintech"],
          skill_predictions: ["Cloud Computing", "Data Science", "Remote Work Skills", "AI/ML", "Cybersecurity"],
          salary_analysis: "Competitive salaries with remote work flexibility becoming a key differentiator. Tech sector shows highest growth potential.",
          growth_recommendations: [
            "Upskill in emerging technologies",
            "Develop remote work capabilities", 
            "Focus on AI/ML and data science",
            "Build cross-functional skills",
            "Consider fintech and edtech opportunities"
          ]
        },
        last_updated: new Date().toISOString(),
        data_source: "CareerBridgeAI Market Intelligence"
      };
      
      setTrends(mockTrends);
    } catch (err) {
      console.error('Error fetching market trends:', err);
      setError('Failed to load market trends');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMarketTrends();
    setRefreshing(false);
  };

  const getTrendIcon = (change) => {
    if (change.startsWith('+')) return <ArrowUp className="h-4 w-4 text-green-500" />;
    if (change.startsWith('-')) return <ArrowDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getTrendColor = (change) => {
    if (change.startsWith('+')) return 'text-green-600';
    if (change.startsWith('-')) return 'text-red-600';
    return 'text-gray-600';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading market trends...</p>
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
            onClick={fetchMarketTrends}
            className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!trends) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto text-center p-6 bg-white rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Data Available</h2>
          <p className="text-gray-700 mb-6">Unable to load market trends at this time.</p>
          <button
            onClick={fetchMarketTrends}
            className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  const currentTrends = selectedIndustry === 'all' ? trends.trends : { [selectedIndustry]: trends.trends[selectedIndustry] };

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
                <h1 className="text-2xl font-bold text-gray-900">Market Trends</h1>
                <p className="text-gray-600">Real-time job market insights and analysis</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Industry Filter */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by Industry:</span>
            <div className="flex space-x-2">
              {industries.map((industry) => (
                <button
                  key={industry.id}
                  onClick={() => setSelectedIndustry(industry.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedIndustry === industry.id
                      ? 'bg-primary-100 text-primary-700 border border-primary-200'
                      : 'text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {industry.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* AI Analysis Summary */}
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">AI Market Analysis</h2>
              <p className="text-gray-700 mb-4">{trends.ai_analysis.market_summary}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Emerging Opportunities</h3>
                  <div className="flex flex-wrap gap-2">
                    {trends.ai_analysis.emerging_opportunities.map((opportunity, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {opportunity}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Top Skills in Demand</h3>
                  <div className="flex flex-wrap gap-2">
                    {trends.ai_analysis.skill_predictions.map((skill, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Industry Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {Object.entries(currentTrends).map(([industryKey, data]) => (
            <div key={industryKey} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 capitalize">{industryKey}</h3>
                <div className={`w-3 h-3 rounded-full ${industries.find(i => i.id === industryKey)?.color || 'bg-gray-500'}`}></div>
              </div>

              {/* Growth Rate */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Growth Rate</span>
                  <div className="flex items-center">
                    {getTrendIcon(`+${data.growth_rate}%`)}
                    <span className={`text-sm font-semibold ml-1 ${getTrendColor(`+${data.growth_rate}%`)}`}>
                      +{data.growth_rate}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full"
                    style={{ width: `${Math.min(data.growth_rate * 2, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Job Openings</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {data.job_openings.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Remote Work</span>
                  <span className="text-sm font-semibold text-gray-900">{data.remote_percentage}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Market Sentiment</span>
                  <span className={`text-sm font-semibold ${
                    data.market_sentiment === 'Very Positive' ? 'text-green-600' :
                    data.market_sentiment === 'Positive' ? 'text-blue-600' :
                    data.market_sentiment === 'Stable' ? 'text-yellow-600' : 'text-gray-600'
                  }`}>
                    {data.market_sentiment}
                  </span>
                </div>
              </div>

              {/* Salary Ranges */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Salary Ranges</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Entry Level</span>
                    <span className="text-xs font-medium text-gray-900">{formatCurrency(data.salary_trends.entry)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Mid Level</span>
                    <span className="text-xs font-medium text-gray-900">{formatCurrency(data.salary_trends.mid)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Senior Level</span>
                    <span className="text-xs font-medium text-gray-900">{formatCurrency(data.salary_trends.senior)}</span>
                  </div>
                </div>
              </div>

              {/* Demand Skills */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">In-Demand Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {data.demand_skills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {skill}
                    </span>
                  ))}
                  {data.demand_skills.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      +{data.demand_skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Emerging Roles */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Emerging Roles</h4>
                <ul className="space-y-1">
                  {data.emerging_roles.slice(0, 3).map((role, index) => (
                    <li key={index} className="flex items-center text-xs text-gray-600">
                      <div className="w-1 h-1 bg-primary-500 rounded-full mr-2"></div>
                      {role}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Growth Recommendations */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="h-5 w-5 text-green-600 mr-2" />
            Growth Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trends.ai_analysis.growth_recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Star className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-700">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Data Source */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Last updated: {new Date(trends.last_updated).toLocaleString()} | 
            Source: {trends.data_source}
          </p>
        </div>
      </main>
    </div>
  );
};

export default MarketTrends;

