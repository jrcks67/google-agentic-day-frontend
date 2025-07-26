import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Classes from './chat/Classes';
import Chat from './chat/Chat';

const Sahayak = () => {
  const [selectedClass, setSelectedClass] = useState(null);

  const handleSelectClass = (classData) => {
    setSelectedClass(classData);
  };

  const handleBackToClasses = () => {
    setSelectedClass(null);
  };

  return (
    <DashboardLayout title={selectedClass ? `${selectedClass.name} - Chat` : "Your Classes"}>
      {!selectedClass ? (
        <Classes onSelectClass={handleSelectClass} />
      ) : (
        <Chat
          selectedClass={selectedClass}
          onBackToClasses={handleBackToClasses}
        />
      )}
    </DashboardLayout>
  );
};

export default Sahayak;
