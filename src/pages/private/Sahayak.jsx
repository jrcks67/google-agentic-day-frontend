import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Classes from './chat/Classes';
import Chat from './chat/Chat';
import { useSignOut } from '../../hooks/useAuth';

const Sahayak = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const navigate = useNavigate();
  const signOutMutation = useSignOut();

  const handleSelectClass = (classData) => {
    setSelectedClass(classData);
  };

  const handleBackToClasses = () => {
    setSelectedClass(null);
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
