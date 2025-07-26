import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Classes from './chat/Classes';
import Chat from './chat/Chat';
import { signOut } from '../../utils/auth';

const Sahayak = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const navigate = useNavigate();

  const handleSelectClass = (classData) => {
    setSelectedClass(classData);
  };

  const handleBackToClasses = () => {
    setSelectedClass(null);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/signin');
    } catch (error) {
      console.error('Logout failed:', error);
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
