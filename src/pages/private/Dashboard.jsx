import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Globe, TestTube, FileText, Users, BarChart3 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const agents = [
    {
      id: 'rag-agent',
      name: 'RAG Agent',
      icon: Brain,
      description: 'Student Data & Context Management',
      status: 'active',
      color: 'bg-blue-500'
    },
    {
      id: 'content-generator',
      name: 'Content Generator',
      icon: Globe,
      description: 'Hyper-Local Content Creation',
      status: 'ready',
      color: 'bg-green-500'
    },
    {
      id: 'quiz-generator',
      name: 'Quiz Generator',
      icon: TestTube,
      description: 'Multi-Grade Quiz Creation',
      status: 'ready',
      color: 'bg-yellow-500'
    },
    {
      id: 'assessment-agent',
      name: 'Assessment Agent',
      icon: FileText,
      description: 'Handwritten Work Evaluation',
      status: 'ready',
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Sahayak AI Assistant
        </h1>
        <p className="text-gray-600">
          Multi-Agent AI Teaching Assistant for Multi-Grade Classrooms
        </p>
      </div>

      {/* Classroom Overview */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Users className="mr-2" size={20} />
          Classroom Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-900">25</div>
            <div className="text-blue-700">Total Students</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-900">3</div>
            <div className="text-green-700">Grade Levels (3,4,5)</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-900">2</div>
            <div className="text-purple-700">Languages (Hindi, Marathi)</div>
          </div>
        </div>
      </div>

      {/* AI Agents */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          AI Agents Available
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {agents.map((agent) => {
            const IconComponent = agent.icon;
            return (
              <div
                key={agent.id}
                className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/agent/${agent.id}`)}
              >
                <div className="flex items-center mb-4">
                  <div className={`${agent.color} p-3 rounded-lg`}>
                    <IconComponent className="text-white" size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {agent.name}
                    </h3>
                    <div className="flex items-center">
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          agent.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      />
                      <span className="text-sm text-gray-500 capitalize">
                        {agent.status}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{agent.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="mr-2" size={20} />
          Recent Agent Activities
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Brain className="text-blue-500 mr-3" size={16} />
              <span className="text-gray-700">RAG: 25 students indexed</span>
            </div>
            <span className="text-gray-500 text-sm">5 min ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Globe className="text-green-500 mr-3" size={16} />
              <span className="text-gray-700">Content: 3 stories generated</span>
            </div>
            <span className="text-gray-500 text-sm">15 min ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <TestTube className="text-yellow-500 mr-3" size={16} />
              <span className="text-gray-700">Quiz: 2 tests created today</span>
            </div>
            <span className="text-gray-500 text-sm">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;