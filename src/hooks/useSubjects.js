import { useState, useCallback } from 'react';
import { subjectsApi } from '../api/services/subjectsApi';

export const useSubjects = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 0,
    size: 20,
    pages: 0
  });

  // Get all subjects
  const getSubjects = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await subjectsApi.getSubjects(params);
      setLoading(false);
      
      if (result.error) {
        setError(result.error.message);
        return { data: null, error: result.error.message };
      }
      
      // Handle paginated response
      if (result.data.subjects) {
        setSubjects(result.data.subjects);
        setPagination({
          total: result.data.total,
          page: result.data.page,
          size: result.data.size,
          pages: result.data.pages
        });
      } else {
        setSubjects(result.data || []);
      }
      
      return { data: result.data, error: null };
    } catch (err) {
      const errorMessage = err.message || 'Failed to get subjects';
      setError(errorMessage);
      setLoading(false);
      return { data: null, error: errorMessage };
    }
  }, []);

  // Get subject by ID
  const getSubjectById = useCallback(async (subjectId) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await subjectsApi.getSubjectById(subjectId);
      setLoading(false);
      
      if (result.error) {
        setError(result.error.message);
        return { data: null, error: result.error.message };
      }
      
      return { data: result.data, error: null };
    } catch (err) {
      const errorMessage = err.message || 'Failed to get subject';
      setError(errorMessage);
      setLoading(false);
      return { data: null, error: errorMessage };
    }
  }, []);

  // Create a new subject
  const createSubject = useCallback(async (subjectData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await subjectsApi.createSubject(subjectData);
      setLoading(false);
      
      if (result.error) {
        setError(result.error.message);
        return { data: null, error: result.error.message };
      }
      
      // Add new subject to the list
      setSubjects(prev => [...prev, result.data]);
      return { data: result.data, error: null };
    } catch (err) {
      const errorMessage = err.message || 'Failed to create subject';
      setError(errorMessage);
      setLoading(false);
      return { data: null, error: errorMessage };
    }
  }, []);

  // Update an existing subject
  const updateSubject = useCallback(async (subjectId, subjectData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await subjectsApi.updateSubject(subjectId, subjectData);
      setLoading(false);
      
      if (result.error) {
        setError(result.error.message);
        return { data: null, error: result.error.message };
      }
      
      // Update subject in the list
      setSubjects(prev => prev.map(subject => 
        subject.id === subjectId ? result.data : subject
      ));
      
      return { data: result.data, error: null };
    } catch (err) {
      const errorMessage = err.message || 'Failed to update subject';
      setError(errorMessage);
      setLoading(false);
      return { data: null, error: errorMessage };
    }
  }, []);

  // Delete a subject
  const deleteSubject = useCallback(async (subjectId) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await subjectsApi.deleteSubject(subjectId);
      setLoading(false);
      
      if (result.error) {
        setError(result.error.message);
        return { data: null, error: result.error.message };
      }
      
      // Remove subject from the list
      setSubjects(prev => prev.filter(subject => subject.id !== subjectId));
      setSelectedSubjects(prev => prev.filter(subject => subject.id !== subjectId));
      
      return { data: result.data, error: null };
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete subject';
      setError(errorMessage);
      setLoading(false);
      return { data: null, error: errorMessage };
    }
  }, []);

  // Upload main document for a subject
  const uploadMainDocument = useCallback(async (subjectId, file) => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const result = await subjectsApi.uploadMainDocument(subjectId, formData);
      setLoading(false);
      
      if (result.error) {
        setError(result.error.message);
        return { data: null, error: result.error.message };
      }
      
      // Update subject in the list with new document info
      setSubjects(prev => prev.map(subject => 
        subject.id === subjectId ? { ...subject, ...result.data } : subject
      ));
      
      return { data: result.data, error: null };
    } catch (err) {
      const errorMessage = err.message || 'Failed to upload document';
      setError(errorMessage);
      setLoading(false);
      return { data: null, error: errorMessage };
    }
  }, []);

  // Toggle subject selection
  const toggleSubjectSelection = useCallback((subject) => {
    setSelectedSubjects(prev => {
      const isSelected = prev.some(s => s.id === subject.id);
      if (isSelected) {
        return prev.filter(s => s.id !== subject.id);
      } else {
        return [...prev, subject];
      }
    });
  }, []);

  // Select all subjects
  const selectAllSubjects = useCallback(() => {
    setSelectedSubjects([...subjects]);
  }, [subjects]);

  // Clear subject selection
  const clearSubjectSelection = useCallback(() => {
    setSelectedSubjects([]);
  }, []);

  // Find subject by ID from current subjects list
  const findSubjectById = useCallback((subjectId) => {
    return subjects.find(subject => subject.id === subjectId) || null;
  }, [subjects]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    loading,
    error,
    subjects,
    selectedSubjects,
    pagination,
    
    // Actions
    getSubjects,
    getSubjectById,
    createSubject,
    updateSubject,
    deleteSubject,
    uploadMainDocument,
    findSubjectById,
    
    // Selection management
    toggleSubjectSelection,
    selectAllSubjects,
    clearSubjectSelection,
    setSelectedSubjects,
    
    // Utils
    clearError
  };
};
