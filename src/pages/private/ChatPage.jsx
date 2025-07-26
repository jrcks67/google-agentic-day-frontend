import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import Chat from './chat/Chat';

const ChatPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    // Get selected class from navigation state
    if (location.state?.selectedClass) {
      setSelectedClass(location.state.selectedClass);
    }
  }, [location.state]);

  const handleBackToClasses = () => {
    navigate('/classes');
  };

  // If no class is selected, redirect to classes page
  if (!selectedClass) {
    return (
      <DashboardLayout title="Chat">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Class Selected</h2>
            <p className="text-gray-600 mb-4">Please select a class to start chatting</p>
            <button
              onClick={() => navigate('/classes')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go to Classes
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={`${selectedClass.name} - Chat`}>
      <Chat 
        selectedClass={selectedClass}
        onBackToClasses={handleBackToClasses}
      />
    </DashboardLayout>
  );
};

export default ChatPage;
