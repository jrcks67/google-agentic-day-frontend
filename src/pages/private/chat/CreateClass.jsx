import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Plus, X, Users, BookOpen,
  Upload, FileText, Check, User, GraduationCap, School
} from 'lucide-react';
import { gradesApi } from '../../../api/services/gradesApi';


const CreateClass = ({ onBack, onClassCreated }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [classData, setClassData] = useState({
    name: '',
    grade: '',
    academic_year: ''
  });
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [currentStudent, setCurrentStudent] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    parent_name: '',
    parent_email: '',
    parent_phone: '',
    address: '',
    date_of_birth: '',
    emergency_contact: '',
    emergency_phone: ''
  });
  const [currentSubject, setCurrentSubject] = useState({
    name: '',
    description: '',
    files: [], // Will store actual File objects
    fileDescriptions: {} // Map of file names to descriptions
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingClass, setIsCreatingClass] = useState(false);
  const [isCreatingSubject, setIsCreatingSubject] = useState(false);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [isCreatingStudent, setIsCreatingStudent] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [subjectError, setSubjectError] = useState(null);
  const [studentError, setStudentError] = useState(null);
  const [createdClassId, setCreatedClassId] = useState(null);
  const fileInputRef = useRef(null);

  const steps = [
    { id: 1, title: 'Class Details', icon: School },
    { id: 2, title: 'Subjects', icon: BookOpen },
    { id: 3, title: 'Students', icon: Users }
  ];

  const languages = ['Hindi', 'English', 'Gujarati', 'Marathi', 'Bengali'];
  const grades = [
    'Class I', 'Class II', 'Class III', 'Class IV', 'Class V',
    'Class VI', 'Class VII', 'Class VIII', 'Class IX', 'Class X'
  ];
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  }

  const handleAddStudent = async () => {
    // Validate required fields
    if (!currentStudent.first_name.trim() || !currentStudent.last_name.trim() ||
        !currentStudent.email.trim()) {
      setStudentError("Please fill in all required fields (First Name, Last Name, Email)");
      return;
    }

    setIsCreatingStudent(true);
    setStudentError(null);

    try {
      // Create student with grade_id
      const studentData = {
        first_name: currentStudent.first_name,
        last_name: currentStudent.last_name,
        email: currentStudent.email,
        grade_id: createdClassId, // Use the created class/grade ID
        // Optional fields - only include if they have values
        ...(currentStudent.phone_number && { phone_number: currentStudent.phone_number }),
        ...(currentStudent.parent_name && { parent_name: currentStudent.parent_name }),
        ...(currentStudent.parent_email && { parent_email: currentStudent.parent_email }),
        ...(currentStudent.parent_phone && { parent_phone: currentStudent.parent_phone }),
        ...(currentStudent.address && { address: currentStudent.address }),
        ...(currentStudent.date_of_birth && { date_of_birth: currentStudent.date_of_birth }),
        ...(currentStudent.emergency_contact && { emergency_contact: currentStudent.emergency_contact }),
        ...(currentStudent.emergency_phone && { emergency_phone: currentStudent.emergency_phone })
      };

      const { data: studentResponse, error: studentError } = await gradesApi.createStudent(studentData);

      if (studentError) {
        setStudentError(studentError.message);
        return;
      }

      if (!studentResponse?.success || !studentResponse?.data) {
        setStudentError("Failed to create student");
        return;
      }

      const createdStudent = studentResponse.data;

      // Add student to the list
      setStudents([...students, {
        id: createdStudent.id,
        name: `${createdStudent.first_name} ${createdStudent.last_name}`,
        first_name: createdStudent.first_name,
        last_name: createdStudent.last_name,
        email: createdStudent.email,
        grade_id: createdStudent.grade_id,
        phone_number: createdStudent.phone_number,
        parent_name: createdStudent.parent_name,
        parent_email: createdStudent.parent_email,
        created_at: createdStudent.created_at
      }]);

      // Reset form
      setCurrentStudent({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        parent_name: '',
        parent_email: '',
        parent_phone: '',
        address: '',
        date_of_birth: '',
        emergency_contact: '',
        emergency_phone: ''
      });

    } catch (error) {
      setStudentError("Network error occurred");
      console.error("Student creation error:", error);
    } finally {
      setIsCreatingStudent(false);
    }
  };

  const removeStudent = (studentId) => {
    setStudents(students.filter(s => s.id !== studentId));
  };

  const handleAddSubject = async () => {
    if (!currentSubject.name.trim()) return;

    setIsCreatingSubject(true);
    setSubjectError(null);

    try {
      // Step 1: Create the subject
      const { data: subjectData, error: subjectError } = await gradesApi.createSubject({
        name: currentSubject.name,
        description: currentSubject.description
      });

      if (subjectError) {
        setSubjectError(subjectError.message);
        return;
      }

      if (!subjectData?.success || !subjectData?.data) {
        setSubjectError("Failed to create subject");
        return;
      }

      const createdSubject = subjectData.data;

      // Step 2: Assign subject to grade
      if (createdClassId) {
        const { error: assignError } = await gradesApi.assignSubjectToGrade(createdClassId, createdSubject.id);

        if (assignError) {
          console.error("Failed to assign subject to grade:", assignError.message);
          setSubjectError("Failed to assign subject to grade");
          return;
        }
      }

      // Step 3: Get subject details with grades to get grade_id
      const { data: subjectDetails, error: getSubjectError } = await gradesApi.getSubject(createdSubject.id);

      if (getSubjectError) {
        console.error("Failed to get subject details:", getSubjectError.message);
        setSubjectError("Failed to get subject details");
        return;
      }

      // Step 4: Upload files if any
      const uploadedFiles = [];
      if (currentSubject.files.length > 0) {
        setIsUploadingFiles(true);

        for (const file of currentSubject.files) {
          const description = currentSubject.fileDescriptions[file.name] || `${currentSubject.name} document`;

          const { data: uploadData, error: uploadError } = await gradesApi.uploadSubjectDocument(
            createdSubject.id,
            file,
            description,
            createdClassId // Pass the grade_id
          );

          if (uploadError) {
            console.error(`Failed to upload ${file.name}:`, uploadError.message);
            // Continue with other files even if one fails
          } else if (uploadData?.success && uploadData?.data) {
            uploadedFiles.push({
              id: uploadData.data.file_upload_id,
              name: uploadData.data.filename,
              url: uploadData.data.document_url,
              size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
              type: file.type.split('/')[1] || 'unknown'
            });
          }
        }
      }

      // Add the subject to the list with uploaded files
      const newSubject = {
        id: createdSubject.id,
        name: createdSubject.name,
        description: createdSubject.description,
        files: uploadedFiles,
        created_at: createdSubject.created_at
      };

      setSubjects([...subjects, newSubject]);
      setCurrentSubject({ name: '', description: '', files: [], fileDescriptions: {} });

    } catch (error) {
      setSubjectError("Network error occurred");
      console.error("Subject creation error:", error);
    } finally {
      setIsCreatingSubject(false);
      setIsUploadingFiles(false);
    }
  };

  const handleSubjectFileUpload = (event) => {
    const files = Array.from(event.target.files);

    // Store actual File objects for API upload
    setCurrentSubject({
      ...currentSubject,
      files: [...currentSubject.files, ...files]
    });
  };

  const removeSubjectFile = (fileName) => {
    setCurrentSubject({
      ...currentSubject,
      files: currentSubject.files.filter(f => f.name !== fileName),
      fileDescriptions: Object.fromEntries(
        Object.entries(currentSubject.fileDescriptions).filter(([name]) => name !== fileName)
      )
    });
  };

  const updateFileDescription = (fileName, description) => {
    setCurrentSubject({
      ...currentSubject,
      fileDescriptions: {
        ...currentSubject.fileDescriptions,
        [fileName]: description
      }
    });
  };



  const removeSubject = (subjectId) => {
    setSubjects(subjects.filter(s => s.id !== subjectId));
  };

  const handleCreateClass = async () => {
    setIsSubmitting(true);
    try {
      // The class was already created in step 1, now we just finalize with subjects and students
      const totalFiles = subjects.reduce((total, subject) => total + subject.files.length, 0);

      const newClass = {
        id: createdClassId || Date.now(), // Use the API-created class ID
        name: classData.name,
        grades: [classData.grade],
        studentCount: students.length,
        subjects: subjects.map(s => s.name),
        documents: totalFiles,
        lastActivity: new Date().toISOString(),
        academic_year: classData.academic_year
      };

      // Here you could make additional API calls to add subjects and students
      // For now, we'll just complete the flow
      onClassCreated(newClass);
    } catch (error) {
      console.error('Failed to finalize class:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return classData.name.trim() && classData.grade && classData.academic_year.trim();
      case 2:
        return subjects.length > 0;
      case 3:
        return students.length > 0;
      default:
        return false;
    }
  };

  // Handle creating class via API when moving from step 1 to step 2
  const handleCreateClassAPI = async () => {
    setIsCreatingClass(true);
    setApiError(null);

    try {
      const { data, error } = await gradesApi.createClass({
        name: classData.name,
        grade: classData.grade,
        academic_year: classData.academic_year
      });

      if (error) {
        setApiError(error.message);
        return false;
      }

      if (data && data.success && data.data) {
        setCreatedClassId(data.data.id);
        return true;
      } else {
        setApiError("Failed to create class");
        return false;
      }
    } catch (error) {
      setApiError("Network error occurred");
      return false;
    } finally {
      setIsCreatingClass(false);
    }
  };

  // Handle next step with API call for step 1
  const handleNextStep = async () => {
    if (currentStep === 1) {
      const success = await handleCreateClassAPI();
      if (success) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => {
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;
        const IconComponent = step.icon;
        
        return (
          <div key={step.id} className="flex items-center">
            <div className={`flex flex-col items-center ${index > 0 ? 'ml-8' : ''}`}>
              <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                isCompleted ? 'bg-green-500 border-green-500 text-white' :
                isActive ? 'bg-blue-500 border-blue-500 text-white' :
                'border-gray-300 text-gray-400'
              }`}>
                {isCompleted ? <Check size={20} /> : <IconComponent size={20} />}
              </div>
              <span className={`mt-2 text-sm font-medium ${
                isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
              }`}>
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 ml-4 ${
                currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <School className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Class Details</h2>
                <p className="text-gray-600">Set up the basic information for your new class</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class Name
                  </label>
                  <input
                    type="text"
                    value={classData.name}
                    onChange={(e) => setClassData({...classData, name: e.target.value})}
                    placeholder="Enter class name (e.g., Village Primary School - Grade 3)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade
                    </label>
                    <select
                      value={classData.grade}
                      onChange={(e) => setClassData({...classData, grade: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Grade</option>
                      {grades.map(grade => (
                        <option key={grade} value={grade}>Grade {grade}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Academic Year
                    </label>
                    <input
                      type="text"
                      value={classData.academic_year}
                      onChange={(e) => setClassData({...classData, academic_year: e.target.value})}
                      placeholder="e.g., 2024-25"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Error Display */}
                {apiError && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <X className="w-5 h-5 text-red-500 mr-2" />
                      <p className="text-red-700 text-sm">{apiError}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Subjects</h2>
                <p className="text-gray-600">Define the subjects you'll be teaching and upload reference materials</p>
              </div>

              {/* Add Subject Form */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Subject</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject Name
                    </label>
                    <input
                      type="text"
                      value={currentSubject.name}
                      onChange={(e) => setCurrentSubject({...currentSubject, name: e.target.value})}
                      placeholder="e.g., Mathematics, Science, Hindi"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (Optional)
                    </label>
                    <input
                      type="text"
                      value={currentSubject.description}
                      onChange={(e) => setCurrentSubject({...currentSubject, description: e.target.value})}
                      placeholder="Brief description"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* File Upload for Current Subject */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reference Materials (Optional)
                  </label>
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className="text-sm font-medium text-gray-700">Upload subject materials</p>
                    <p className="text-xs text-gray-500">PDF, DOCX, TXT, CSV, XLSX files supported</p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.docx,.txt,.csv,.xlsx"
                    onChange={handleSubjectFileUpload}
                    className="hidden"
                  />

                  {currentSubject.files.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Selected Files:</p>
                      <div className="space-y-3">
                        {currentSubject.files.map((file, index) => (
                          <div key={`${file.name}-${index}`} className="bg-white p-3 rounded border">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <FileText size={16} className="text-blue-500" />
                                <span className="text-sm text-gray-900">{file.name}</span>
                                <span className="text-xs text-gray-500">
                                  {(file.size / 1024 / 1024).toFixed(1)} MB
                                </span>
                              </div>
                              <button
                                onClick={() => removeSubjectFile(file.name)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X size={16} />
                              </button>
                            </div>
                            <input
                              type="text"
                              placeholder="Enter file description (optional)"
                              value={currentSubject.fileDescriptions[file.name] || ''}
                              onChange={(e) => updateFileDescription(file.name, e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleAddSubject}
                    disabled={!currentSubject.name.trim() || isCreatingSubject || isUploadingFiles}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isCreatingSubject || isUploadingFiles ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>
                          {isCreatingSubject ? 'Creating Subject...' : 'Uploading Files...'}
                        </span>
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        <span>Add Subject</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Subject Error Display */}
                {subjectError && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <X className="w-5 h-5 text-red-500 mr-2" />
                      <p className="text-red-700 text-sm">{subjectError}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Subjects List */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Added Subjects ({subjects.length})
                  </h3>
                </div>

                {subjects.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No subjects added yet. Add your first subject above.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {subjects.map(subject => (
                      <div key={subject.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-purple-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{subject.name}</h4>
                                {subject.description && (
                                  <p className="text-sm text-gray-500">{subject.description}</p>
                                )}
                              </div>
                            </div>
                            
                            {subject.files.length > 0 && (
                              <div className="ml-13">
                                <p className="text-xs font-medium text-gray-700 mb-2">
                                  Reference Materials ({subject.files.length}):
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {subject.files.map(file => (
                                    <div key={file.id} className="bg-gray-50 px-2 py-1 rounded text-xs text-gray-600 flex items-center space-x-1">
                                      <FileText size={12} />
                                      <span>{file.name}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => removeSubject(subject.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Students</h2>
                <p className="text-gray-600">Add students to your class. They will automatically have access to all grade subjects.</p>
              </div>

              {subjects.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Please add subjects first before adding students.</p>
                </div>
              ) : (
                <>
                  {/* Add Student Form */}
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Student</h3>

                    {/* Required Fields */}
                    <div className="mb-6">
                      <h4 className="text-md font-medium text-gray-800 mb-3">Required Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name *
                          </label>
                          <input
                            type="text"
                            value={currentStudent.first_name}
                            onChange={(e) => setCurrentStudent({...currentStudent, first_name: e.target.value})}
                            placeholder="Enter first name"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            value={currentStudent.last_name}
                            onChange={(e) => setCurrentStudent({...currentStudent, last_name: e.target.value})}
                            placeholder="Enter last name"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            value={currentStudent.email}
                            onChange={(e) => setCurrentStudent({...currentStudent, email: e.target.value})}
                            placeholder="Enter email address"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>


                      </div>
                    </div>

                    {/* Optional Fields */}
                    <div className="mb-4">
                      <h4 className="text-md font-medium text-gray-800 mb-3">Additional Information (Optional)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={currentStudent.phone_number}
                            onChange={(e) => setCurrentStudent({...currentStudent, phone_number: e.target.value})}
                            placeholder="Enter phone number"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            value={currentStudent.date_of_birth}
                            onChange={(e) => setCurrentStudent({...currentStudent, date_of_birth: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Parent Name
                          </label>
                          <input
                            type="text"
                            value={currentStudent.parent_name}
                            onChange={(e) => setCurrentStudent({...currentStudent, parent_name: e.target.value})}
                            placeholder="Enter parent name"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Parent Email
                          </label>
                          <input
                            type="email"
                            value={currentStudent.parent_email}
                            onChange={(e) => setCurrentStudent({...currentStudent, parent_email: e.target.value})}
                            placeholder="Enter parent email"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Parent Phone
                          </label>
                          <input
                            type="tel"
                            value={currentStudent.parent_phone}
                            onChange={(e) => setCurrentStudent({...currentStudent, parent_phone: e.target.value})}
                            placeholder="Enter parent phone"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Emergency Contact
                          </label>
                          <input
                            type="text"
                            value={currentStudent.emergency_contact}
                            onChange={(e) => setCurrentStudent({...currentStudent, emergency_contact: e.target.value})}
                            placeholder="Enter emergency contact"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Emergency Phone
                          </label>
                          <input
                            type="tel"
                            value={currentStudent.emergency_phone}
                            onChange={(e) => setCurrentStudent({...currentStudent, emergency_phone: e.target.value})}
                            placeholder="Enter emergency phone"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address
                          </label>
                          <textarea
                            value={currentStudent.address}
                            onChange={(e) => setCurrentStudent({...currentStudent, address: e.target.value})}
                            placeholder="Enter address"
                            rows="3"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Note about subjects */}
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> Students will automatically have access to all subjects assigned to this grade: {subjects.map(s => s.name).join(', ')}
                      </p>
                    </div>

                    {/* Student Error Display */}
                    {studentError && (
                      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center">
                          <X className="w-5 h-5 text-red-500 mr-2" />
                          <p className="text-red-700 text-sm">{studentError}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button
                        onClick={handleAddStudent}
                        disabled={!currentStudent.first_name.trim() || !currentStudent.last_name.trim() ||
                                 !currentStudent.email.trim() || isCreatingStudent}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        {isCreatingStudent ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Creating Student...</span>
                          </>
                        ) : (
                          <>
                            <Plus size={16} />
                            <span>Add Student</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Students List */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Added Students ({students.length})
                      </h3>
                    </div>

                    {students.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No students added yet. Add your first student above.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {students.map(student => (
                          <div key={student.id} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                  <User className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900">{student.name}</h4>
                                  <p className="text-sm text-gray-500">{student.language}</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {student.subscribedSubjects.map(subjectId => {
                                      const subject = subjects.find(s => s.id === subjectId);
                                      return (
                                        <span key={subjectId} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
                                          {subject?.name}
                                        </span>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => removeStudent(student.id)}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Class</h1>
              <p className="text-gray-600">Set up your classroom for AI-powered teaching</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-8">
        <div className="max-w-6xl mx-auto px-6">
          <StepIndicator />
          {renderStepContent()}
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : handleBack()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
          >
            <ArrowLeft size={16} />
            <span>{currentStep > 1 ? 'Previous' : 'Back to Classes'}</span>
          </button>

          <div className="flex items-center space-x-4">
            {currentStep < 3 ? (
              <button
                onClick={handleNextStep}
                disabled={!canProceedToNext() || isCreatingClass}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isCreatingClass && currentStep === 1 ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Class...</span>
                  </>
                ) : (
                  <>
                    <span>Next</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleCreateClass}
                disabled={!canProceedToNext() || isSubmitting}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Class...</span>
                  </>
                ) : (
                  <>
                    <GraduationCap size={16} />
                    <span>Create Class</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateClass;
