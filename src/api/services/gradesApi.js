// Grades/Classes API service
import { getAuthHeader } from '../../utils/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Get all grades/classes for the authenticated user
 * @returns {Promise<{data: any, error: any}>}
 */
export const getGrades = async () => {
  try {
    const authHeaders = getAuthHeader();
    
    const response = await fetch(`${API_BASE_URL}/api/grades/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
    });

    const data = await response.json();
    console.log('Get grades response:', data);

    if (!response.ok) {
      return { 
        data: null, 
        error: { 
          message: data.message || data.detail || 'Failed to fetch grades',
          status: response.status 
        } 
      };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Get grades error:', error);
    return { data: null, error: { message: 'Network error occurred' } };
  }
};

/**
 * Create a new grade/class
 * @param {Object} gradeData - Grade data {name, academic_year}
 * @returns {Promise<{data: any, error: any}>}
 */
export const createGrade = async (gradeData) => {
  try {
    const authHeaders = getAuthHeader();
    
    console.log('Creating grade with data:', gradeData);
    
    const response = await fetch(`${API_BASE_URL}/api/grades/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(gradeData),
    });

    const data = await response.json();
    console.log('Create grade response:', data);

    if (!response.ok) {
      return { 
        data: null, 
        error: { 
          message: data.message || data.detail || 'Failed to create grade',
          status: response.status 
        } 
      };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Create grade error:', error);
    return { data: null, error: { message: 'Network error occurred' } };
  }
};

/**
 * Update a grade/class
 * @param {string} gradeId - Grade ID
 * @param {Object} gradeData - Updated grade data
 * @returns {Promise<{data: any, error: any}>}
 */
export const updateGrade = async (gradeId, gradeData) => {
  try {
    const authHeaders = getAuthHeader();
    
    const response = await fetch(`${API_BASE_URL}/api/grades/${gradeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(gradeData),
    });

    const data = await response.json();

    if (!response.ok) {
      return { 
        data: null, 
        error: { 
          message: data.message || data.detail || 'Failed to update grade',
          status: response.status 
        } 
      };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Update grade error:', error);
    return { data: null, error: { message: 'Network error occurred' } };
  }
};

/**
 * Delete a grade/class
 * @param {string} gradeId - Grade ID
 * @returns {Promise<{data: any, error: any}>}
 */
export const deleteGrade = async (gradeId) => {
  try {
    const authHeaders = getAuthHeader();
    
    const response = await fetch(`${API_BASE_URL}/api/grades/${gradeId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      return { 
        data: null, 
        error: { 
          message: data.message || data.detail || 'Failed to delete grade',
          status: response.status 
        } 
      };
    }

    return { data: { success: true }, error: null };
  } catch (error) {
    console.error('Delete grade error:', error);
    return { data: null, error: { message: 'Network error occurred' } };
  }
};
