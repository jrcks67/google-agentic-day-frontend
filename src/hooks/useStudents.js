import { useState, useCallback } from 'react';
import { studentsApi } from '../api/services/studentsApi';

export const useStudents = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 0,
    size: 20,
    pages: 0
  });

  // Get students by class
  const getStudentsByClass = useCallback(async (classId, params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await studentsApi.getStudentsByClass(classId, params);
      setLoading(false);
      
      if (result.error) {
        setError(result.error.message);
        return { data: null, error: result.error.message };
      }
      
      // Handle paginated response
      if (result.data.students) {
        setStudents(result.data.students);
        setPagination({
          total: result.data.total,
          page: result.data.page,
          size: result.data.size,
          pages: result.data.pages
        });
      } else {
        setStudents(result.data || []);
      }
      
      return { data: result.data, error: null };
    } catch (err) {
      const errorMessage = err.message || 'Failed to get students';
      setError(errorMessage);
      setLoading(false);
      return { data: null, error: errorMessage };
    }
  }, []);

  // Get student by ID
  const getStudentById = useCallback(async (studentId) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await studentsApi.getStudentById(studentId);
      setLoading(false);
      
      if (result.error) {
        setError(result.error.message);
        return { data: null, error: result.error.message };
      }
      
      return { data: result.data, error: null };
    } catch (err) {
      const errorMessage = err.message || 'Failed to get student';
      setError(errorMessage);
      setLoading(false);
      return { data: null, error: errorMessage };
    }
  }, []);

  // Create a new student
  const createStudent = useCallback(async (studentData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await studentsApi.createStudent(studentData);
      setLoading(false);
      
      if (result.error) {
        setError(result.error.message);
        return { data: null, error: result.error.message };
      }
      
      // Add new student to the list
      setStudents(prev => [...prev, result.data]);
      return { data: result.data, error: null };
    } catch (err) {
      const errorMessage = err.message || 'Failed to create student';
      setError(errorMessage);
      setLoading(false);
      return { data: null, error: errorMessage };
    }
  }, []);

  // Update an existing student
  const updateStudent = useCallback(async (studentId, studentData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await studentsApi.updateStudent(studentId, studentData);
      setLoading(false);
      
      if (result.error) {
        setError(result.error.message);
        return { data: null, error: result.error.message };
      }
      
      // Update student in the list
      setStudents(prev => prev.map(student => 
        student.id === studentId ? result.data : student
      ));
      
      return { data: result.data, error: null };
    } catch (err) {
      const errorMessage = err.message || 'Failed to update student';
      setError(errorMessage);
      setLoading(false);
      return { data: null, error: errorMessage };
    }
  }, []);

  // Delete a student
  const deleteStudent = useCallback(async (studentId) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await studentsApi.deleteStudent(studentId);
      setLoading(false);
      
      if (result.error) {
        setError(result.error.message);
        return { data: null, error: result.error.message };
      }
      
      // Remove student from the list
      setStudents(prev => prev.filter(student => student.id !== studentId));
      setSelectedStudents(prev => prev.filter(student => student.id !== studentId));
      
      return { data: result.data, error: null };
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete student';
      setError(errorMessage);
      setLoading(false);
      return { data: null, error: errorMessage };
    }
  }, []);

  // Bulk upload students
  const bulkUploadStudents = useCallback(async (classId, file) => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const result = await studentsApi.bulkUploadStudents(classId, formData);
      setLoading(false);
      
      if (result.error) {
        setError(result.error.message);
        return { data: null, error: result.error.message };
      }
      
      // Refresh students list after bulk upload
      await getStudentsByClass(classId);
      
      return { data: result.data, error: null };
    } catch (err) {
      const errorMessage = err.message || 'Failed to upload students';
      setError(errorMessage);
      setLoading(false);
      return { data: null, error: errorMessage };
    }
  }, [getStudentsByClass]);

  // Toggle student selection
  const toggleStudentSelection = useCallback((student) => {
    setSelectedStudents(prev => {
      const isSelected = prev.some(s => s.id === student.id);
      if (isSelected) {
        return prev.filter(s => s.id !== student.id);
      } else {
        return [...prev, student];
      }
    });
  }, []);

  // Select all students
  const selectAllStudents = useCallback(() => {
    setSelectedStudents([...students]);
  }, [students]);

  // Clear student selection
  const clearStudentSelection = useCallback(() => {
    setSelectedStudents([]);
  }, []);

  // Find student by ID from current students list
  const findStudentById = useCallback((studentId) => {
    return students.find(student => student.id === studentId) || null;
  }, [students]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    loading,
    error,
    students,
    selectedStudents,
    pagination,
    
    // Actions
    getStudentsByClass,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    bulkUploadStudents,
    findStudentById,
    
    // Selection management
    toggleStudentSelection,
    selectAllStudents,
    clearStudentSelection,
    setSelectedStudents,
    
    // Utils
    clearError
  };
};
