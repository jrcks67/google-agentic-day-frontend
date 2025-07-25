/ File: frontend/src/components/AgentInterface.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Send, Loader } from 'lucide-react';
import { apiService } from '../services/apiService';

interface AgentInterfaceProps {}

const AgentInterface: React.FC<AgentInterfaceProps> = () => {
  const { agentName } = useParams<{ agentName: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  const agentConfigs = {
    'rag-agent': {
      title: 'RAG Agent - Student Data Manager',
      description: 'Upload and manage student roster data',
      fields: [
        { name: 'file', type: 'file', label: 'Student CSV/Excel File' },
        { name: 'query', type: 'text', label: 'Query Student Data' }
      ]
    },
    'content-generator': {
      title: 'Hyper-Local Content Generator',
      description: 'Generate culturally relevant educational content',
      fields: [
        { name: 'topic', type: 'text', label: 'Content Topic' },
        { name: 'language', type: 'select', label: 'Language', options: ['Hindi', 'Marathi', 'English'] },
        { name: 'grades', type: 'multiselect', label: 'Grade Levels', options: ['3', '4', '5'] }
      ]
    },
    'quiz-generator': {
      title: 'Quiz Generator',
      description: 'Create grade-specific quizzes and assessments',
      fields: [
        { name: 'topic', type: 'text', label: 'Quiz Topic' },
        { name: 'difficulty', type: 'select', label: 'Difficulty Level', options: ['Easy', 'Medium', 'Hard'] },
        { name: 'grades', type: 'multiselect', label: 'Target Grades', options: ['3', '4', '5'] }
      ]
    },
    'assessment-agent': {
      title: 'Assessment Agent',
      description: 'Evaluate handwritten student work',
      fields: [
        { name: 'questionImage', type: 'file', label: 'Question Sheet Image' },
        { name: 'answerImage', type: 'file', label: 'Answer Sheet Image' },
        { name: 'studentId', type: 'text', label: 'Student ID' }
      ]
    }
  };

  const currentAgent = agentConfigs[agentName as keyof typeof agentConfigs];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await apiService.orchestrateRequest(
        agentName === 'content-generator' ? 'generate_content' :
        agentName === 'quiz-generator' ? 'create_quiz' :
        agentName === 'assessment-agent' ? 'assess_work' : 'process',
        formData
      );
      setResult(response.result);
    } catch (error) {
      console.error('Error:', error);
      setResult({ error: 'Failed to process request' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  if (!currentAgent) {
    return <div>Agent not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {currentAgent.title}
        </h1>
        <p className="text-gray-600">{currentAgent.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Agent Input
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {currentAgent.fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                </label>
                {field.type === 'text' && (
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                  />
                )}
                {field.type === 'file' && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <div className="text-center">
                      <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                      <input
                        type="file"
                        accept={field.name.includes('Image') ? 'image/*' : '.csv,.xlsx'}
                        className="w-full"
                        onChange={(e) => handleInputChange(field.name, e.target.files?.[0])}
                      />
                    </div>
                  </div>
                )}
                {field.type === 'select' && (
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                )}
              </div>
            ))}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <Loader className="animate-spin mr-2" size={16} />
              ) : (
                <Send className="mr-2" size={16} />
              )}
              {loading ? 'Processing...' : 'Process Request'}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Agent Response
          </h2>
          {result ? (
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8">
              Submit a request to see the agent response
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentInterface;
