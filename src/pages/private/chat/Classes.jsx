import { useState } from 'react';
import { ChevronRight, Plus, X, BookOpen, Users, Calendar } from 'lucide-react';
import { useGrades, useCreateGrade } from '../../../hooks/useGrades';

// Helper function to format last activity time
const formatLastActivity = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now - date) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 2) {
      return '1 hour ago';
    } else {
      return `${Math.floor(diffInHours)} hours ago`;
    }
  } else if (diffInHours < 48) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
};

// Create Class Modal Component
const CreateClassModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    academic_year: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.academic_year.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await onSubmit(formData);
      setFormData({ name: '', academic_year: '' });
      setError('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create class');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Create New Class</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Class Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Class I, Grade 5, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="academic_year" className="block text-sm font-medium text-gray-700 mb-2">
              Academic Year
            </label>
            <input
              type="text"
              id="academic_year"
              name="academic_year"
              value={formData.academic_year}
              onChange={handleChange}
              placeholder="e.g., 2024-25"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              {loading ? 'Creating...' : 'Create Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Classes = ({ onSelectClass }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // API hooks
  const { data: gradesData, isLoading, error, refetch } = useGrades();
  const createGradeMutation = useCreateGrade();

  // TODO: Add subjects API integration
  // const { data: subjectsData } = useSubjects(); // When subjects API is ready
  // Handle create class
  const handleCreateClass = async (formData) => {
    await createGradeMutation.mutateAsync(formData);
  };

  const ClassCard = ({ classData, onClick }) => (
    <div
      onClick={() => onClick(classData)}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{classData.name}</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 bg-blue-50 px-2 py-1 rounded">
            {classData.academic_year}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{classData.student_count || 0}</div>
          <div className="text-sm text-gray-500">Students</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <BookOpen className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">
            {/* TODO: Integrate with subjects API later */}
            {classData.subjects?.length || 0}
          </div>
          <div className="text-sm text-gray-500">Subjects</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600">
            {new Date(classData.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
          <div className="text-sm text-gray-500">Created</div>
        </div>
      </div>

      {/* Subjects display - placeholder for now */}
      {classData.subjects && classData.subjects.length > 0 && (
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-2">Subjects:</div>
          <div className="flex flex-wrap gap-1">
            {classData.subjects.slice(0, 3).map((subject, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {subject}
              </span>
            ))}
            {classData.subjects.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                +{classData.subjects.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Last activity: {formatLastActivity(classData.updated_at)}</span>
        <ChevronRight size={16} />
      </div>
    </div>
  );

  // Get classes from API response
  const classes = gradesData?.data?.grades || [];

  return (
    <div className="h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Classes</h1>
            <p className="text-gray-600">Select a class to start teaching with AI assistance</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition duration-200"
            >
              <Plus size={16} />
              <span>Create New Class</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 mb-4">Failed to load classes: {error.message}</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && classes.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Classes Created Yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first class to start using Sahayak AI teaching assistant
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 mx-auto transition duration-200"
            >
              <Plus size={20} />
              <span>Create Your First Class</span>
            </button>
          </div>
        )}

        {/* Classes Grid */}
        {!isLoading && !error && classes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map(classData => (
              <ClassCard
                key={classData.id}
                classData={classData}
                onClick={onSelectClass}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Class Modal */}
      <CreateClassModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateClass}
        loading={createGradeMutation.isPending}
      />
    </div>
  );
};

export default Classes;