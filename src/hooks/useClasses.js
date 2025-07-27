import { useState, useCallback } from 'react';
import { classesApi } from '../api/services/classesApi';

export const useClasses = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  // Get all classes
  const getClasses = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await classesApi.getClasses();
      setLoading(false);
      
      if (result.error) {
        setError(result.error.message);
        return { data: null, error: result.error.message };
      }
      
      setClasses(result.data);
      return { data: result.data, error: null };
    } catch (err) {
      const errorMessage = err.message || 'Failed to get classes';
      setError(errorMessage);
      setLoading(false);
      return { data: null, error: errorMessage };
    }
  }, []);

  // Get class by ID
  const getClassById = useCallback(async (classId) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await classesApi.getClassById(classId);
      setLoading(false);
      
      if (result.error) {
        setError(result.error.message);
        return { data: null, error: result.error.message };
      }
      
      setSelectedClass(result.data);
      return { data: result.data, error: null };
    } catch (err) {
      const errorMessage = err.message || 'Failed to get class';
      setError(errorMessage);
      setLoading(false);
      return { data: null, error: errorMessage };
    }
  }, []);

  // Create a new class
  const createClass = useCallback(async (classData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await classesApi.createClass(classData);
      setLoading(false);
      
      if (result.error) {
        setError(result.error.message);
        return { data: null, error: result.error.message };
      }
      
      // Add new class to the list
      setClasses(prev => [...prev, result.data]);
      return { data: result.data, error: null };
    } catch (err) {
      const errorMessage = err.message || 'Failed to create class';
      setError(errorMessage);
      setLoading(false);
      return { data: null, error: errorMessage };
    }
  }, []);

  // Update an existing class
  const updateClass = useCallback(async (classId, classData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await classesApi.updateClass(classId, classData);
      setLoading(false);
      
      if (result.error) {
        setError(result.error.message);
        return { data: null, error: result.error.message };
      }
      
      // Update class in the list
      setClasses(prev => prev.map(cls => cls.id === classId ? result.data : cls));
      if (selectedClass?.id === classId) {
        setSelectedClass(result.data);
      }
      
      return { data: result.data, error: null };
    } catch (err) {
      const errorMessage = err.message || 'Failed to update class';
      setError(errorMessage);
      setLoading(false);
      return { data: null, error: errorMessage };
    }
  }, [selectedClass]);

  // Delete a class
  const deleteClass = useCallback(async (classId) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await classesApi.deleteClass(classId);
      setLoading(false);
      
      if (result.error) {
        setError(result.error.message);
        return { data: null, error: result.error.message };
      }
      
      // Remove class from the list
      setClasses(prev => prev.filter(cls => cls.id !== classId));
      if (selectedClass?.id === classId) {
        setSelectedClass(null);
      }
      
      return { data: result.data, error: null };
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete class';
      setError(errorMessage);
      setLoading(false);
      return { data: null, error: errorMessage };
    }
  }, [selectedClass]);

  // Find class by ID from current classes list
  const findClassById = useCallback((classId) => {
    return classes.find(cls => cls.id === classId) || null;
  }, [classes]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    loading,
    error,
    classes,
    selectedClass,
    
    // Actions
    getClasses,
    getClassById,
    createClass,
    updateClass,
    deleteClass,
    findClassById,
    setSelectedClass,
    clearError
  };
};
