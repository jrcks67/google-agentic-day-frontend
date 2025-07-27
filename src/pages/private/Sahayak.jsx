import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Classes from './chat/Classes';
import Chat from './chat/Chat';
import { useSignOut } from '../../hooks/useAuth';
import { useClasses } from '../../hooks/useClasses';

const Sahayak = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const navigate = useNavigate();
  const { classId, feedId } = useParams();
  const signOutMutation = useSignOut();
  const { getClassById } = useClasses();

  // Determine if we're in chat mode based on URL
  const isInChatMode = Boolean(classId);

  // Load class data when classId is in URL
  useEffect(() => {
    if (classId && !selectedClass) {
      const loadClass = async () => {
        const result = await getClassById(classId);
        if (result.data) {
          setSelectedClass(result.data);
        } else {
          // If class not found, redirect to dashboard
          navigate('/dashboard');
        }
      };
      loadClass();
    }
  }, [classId, selectedClass, getClassById, navigate]);

  const handleSelectClass = (classData) => {
    setSelectedClass(classData);
    // Navigate to chat URL when class is selected
    navigate(`/dashboard/classes/${classData.id}/chat`);
  };

  const handleBackToClasses = () => {
    setSelectedClass(null);
    // Navigate back to dashboard
    navigate('/dashboard');
  };

  const handleLogout = async () => {
    try {
      console.log('Sahayak: Starting logout...');
      await signOutMutation.mutateAsync();
      // The useSignOut hook will handle navigation automatically
    } catch (error) {
      console.error('Sahayak: Logout failed:', error);
      // Still navigate to signin even if logout fails
      navigate('/signin');
    }
  };

  return (
    <>
      {!selectedClass ? (
        <Classes onSelectClass={handleSelectClass} />
      ) : (
        <Chat 
          selectedClass={selectedClass}
          onBackToClasses={handleBackToClasses}
          onLogout={handleLogout}
        />
      )}
    </>
  );
};

export default Sahayak;
