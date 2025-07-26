import { useEffect } from 'react';
import { BookOpen, Brain, Globe, FileText, BarChart3, Sparkles, Target, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsAuthenticated } from '../../hooks/useAuth';

const HomePage = () => {
  const navigate = useNavigate();
  const { data: isAuthenticated, isLoading: authLoading } = useIsAuthenticated();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      console.log('User already authenticated, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-blue-50 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              Sahayak
            </span>
          </div>
          <nav className="flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Mission</a>
            <button onClick={()=>{navigate("/signin")}}
            className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all font-medium">
              Login
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-100 to-cyan-100 text-indigo-800 px-6 py-3 rounded-full text-sm font-semibold mb-8">
            <Sparkles className="w-4 h-4" />
            <span>Revolutionary AI for Education</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-8 leading-tight">
            The Future of
            <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent block">
              Multi-Grade Teaching
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            We're building the world's first multi-agent AI teaching assistant designed specifically 
            for under-resourced schools. Join the education revolution.
          </p>
        </div>

        {/* Problem & Solution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-10 border border-white/50">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">The Challenge</h3>
            <p className="text-gray-600 leading-relaxed">
              Over 200,000 multi-grade schools in India struggle with limited resources, 
              teachers managing 2-4 grades simultaneously, and lack of personalized content 
              that respects local culture and languages.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-10 border border-white/50">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Solution</h3>
            <p className="text-gray-600 leading-relaxed">
              A coordinated 4-agent AI system that understands student context, creates 
              culturally relevant content, generates adaptive assessments, and evaluates 
              handwritten work - all in local languages.
            </p>
          </div>
        </div>

        {/* Agent Ecosystem */}
        <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-12 border border-white/50 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">AI Agent Ecosystem</h2>
            <p className="text-gray-600 text-lg">Four specialized agents working in perfect harmony</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Brain className="w-12 h-12 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">RAG Agent</h4>
              <p className="text-gray-600 text-sm">Contextual student memory across all interactions</p>
            </div>

            <div className="group text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-12 h-12 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Hyper-Local Generator</h4>
              <p className="text-gray-600 text-sm">Cultural intelligence & language adaptation</p>
            </div>

            <div className="group text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <FileText className="w-12 h-12 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Quiz Generator</h4>
              <p className="text-gray-600 text-sm">Adaptive multi-grade assessment creation</p>
            </div>

            <div className="group text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-12 h-12 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Assessment Agent</h4>
              <p className="text-gray-600 text-sm">Handwritten work evaluation & feedback</p>
            </div>
          </div>
        </div>

        {/* Traction */}

      </section>
    </div>
  );
};

export default HomePage;
