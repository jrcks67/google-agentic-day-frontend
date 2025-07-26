import React from 'react';
import { ChevronRight, Plus } from 'lucide-react';

// Mock data for classes
const mockClasses = [
  {
    id: 1,
    name: "Rural Primary School - Mixed Grades",
    grades: ["1", "2", "3"],
    subjects: ["Math", "Science", "Hindi", "English"],
    studentCount: 45,
    documents: 12,
    lastActivity: "2024-07-26T10:30:00Z"
  },
  {
    id: 2,
    name: "Village School - Advanced",
    grades: ["4", "5"],
    subjects: ["Math", "Science", "Social Studies"],
    studentCount: 32,
    documents: 8,
    lastActivity: "2024-07-25T14:15:00Z"
  }
];

const Classes = ({ onSelectClass }) => {
  const ClassCard = ({ classData, onClick }) => (
    <div 
      onClick={() => onClick(classData)}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{classData.name}</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Grades: {classData.grades.join(', ')}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{classData.studentCount}</div>
          <div className="text-sm text-gray-500">Students</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{classData.documents}</div>
          <div className="text-sm text-gray-500">Documents</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{classData.subjects.length}</div>
          <div className="text-sm text-gray-500">Subjects</div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Last activity: {new Date(classData.lastActivity).toLocaleDateString()}</span>
        <ChevronRight size={16} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sahayak</h1>
            <p className="text-gray-600">AI Teaching Assistant for Multi-Grade Classrooms</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Plus size={16} />
              <span>Create New Class</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Your Classes</h2>
          <p className="text-gray-600">Select a class to start teaching with AI assistance</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockClasses.map(classData => (
            <ClassCard 
              key={classData.id} 
              classData={classData} 
              onClick={onSelectClass}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Classes;