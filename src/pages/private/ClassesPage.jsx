import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import Classes from './chat/Classes';

const ClassesPage = () => {
  const navigate = useNavigate();

  const handleSelectClass = (classData) => {
    // Navigate to chat page with class data
    navigate('/chat', { state: { selectedClass: classData } });
  };

  return (
    <DashboardLayout title="Your Classes">
      <Classes onSelectClass={handleSelectClass} />
    </DashboardLayout>
  );
};

export default ClassesPage;
