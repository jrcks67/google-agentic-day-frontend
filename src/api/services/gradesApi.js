import { gradesClient } from "../apiClients";

/**
 * Grades API Service
 * Provides methods for interacting with grades/classes endpoints
 */
export const gradesApi = {
  /**
   * Create a new class/grade
   * 
   * @param {Object} classData - Class data
   * @param {String} classData.name - School/class name
   * @param {String} classData.grade - Grade level (e.g., "Class I")
   * @param {String} classData.academic_year - Academic year (e.g., "2024-25")
   * @returns {Promise<{data: Object|null, error: Error|null}>} Response with created class or error
   */
  createClass: async (classData) => {
    try {
      const response = await gradesClient.post("/grades/", classData);
      return { data: response.data, error: null };
    } catch (error) {
      console.error("Create class error:", error);
      return { 
        data: null, 
        error: {
          message: error.response?.data?.message || error.response?.data?.detail || "Failed to create class",
          status: error.response?.status,
          originalError: error
        } 
      };
    }
  },

  /**
   * Get all classes for the current user
   * 
   * @param {Object} params - Query parameters
   * @param {Number} [params.page] - Page number for pagination
   * @param {Number} [params.limit] - Number of items per page
   * @returns {Promise<{data: Object|null, error: Error|null}>} Response with classes list or error
   */
  getClasses: async (params = {}) => {
    try {
      const response = await gradesClient.get("/grades/", { params });
      return { data: response.data, error: null };
    } catch (error) {
      console.error("Get classes error:", error);
      return { 
        data: null, 
        error: {
          message: error.response?.data?.message || error.response?.data?.detail || "Failed to get classes",
          status: error.response?.status,
          originalError: error
        } 
      };
    }
  },

  /**
   * Get a specific class by ID
   * 
   * @param {String} classId - The class ID
   * @returns {Promise<{data: Object|null, error: Error|null}>} Response with class data or error
   */
  getClass: async (classId) => {
    try {
      const response = await gradesClient.get(`/grades/${classId}`);
      return { data: response.data, error: null };
    } catch (error) {
      console.error("Get class error:", error);
      return { 
        data: null, 
        error: {
          message: error.response?.data?.message || error.response?.data?.detail || "Failed to get class",
          status: error.response?.status,
          originalError: error
        } 
      };
    }
  },

  /**
   * Update a class
   * 
   * @param {String} classId - The class ID
   * @param {Object} classData - Updated class data
   * @returns {Promise<{data: Object|null, error: Error|null}>} Response with updated class or error
   */
  updateClass: async (classId, classData) => {
    try {
      const response = await gradesClient.put(`/grades/${classId}`, classData);
      return { data: response.data, error: null };
    } catch (error) {
      console.error("Update class error:", error);
      return { 
        data: null, 
        error: {
          message: error.response?.data?.message || error.response?.data?.detail || "Failed to update class",
          status: error.response?.status,
          originalError: error
        } 
      };
    }
  },

  /**
   * Delete a class
   *
   * @param {String} classId - The class ID
   * @returns {Promise<{data: Object|null, error: Error|null}>} Response or error
   */
  deleteClass: async (classId) => {
    try {
      const response = await gradesClient.delete(`/grades/${classId}`);
      return { data: response.data, error: null };
    } catch (error) {
      console.error("Delete class error:", error);
      return {
        data: null,
        error: {
          message: error.response?.data?.message || error.response?.data?.detail || "Failed to delete class",
          status: error.response?.status,
          originalError: error
        }
      };
    }
  },

  /**
   * Create a new subject
   *
   * @param {Object} subjectData - Subject data
   * @param {String} subjectData.name - Subject name
   * @param {String} subjectData.description - Subject description
   * @returns {Promise<{data: Object|null, error: Error|null}>} Response with created subject or error
   */
  createSubject: async (subjectData) => {
    try {
      const response = await gradesClient.post("/subjects/", subjectData);
      return { data: response.data, error: null };
    } catch (error) {
      console.error("Create subject error:", error);
      return {
        data: null,
        error: {
          message: error.response?.data?.message || error.response?.data?.detail || "Failed to create subject",
          status: error.response?.status,
          originalError: error
        }
      };
    }
  },

  /**
   * Upload a document for a subject
   *
   * @param {String} subjectId - The subject ID
   * @param {File} file - The file to upload
   * @param {String} description - File description
   * @returns {Promise<{data: Object|null, error: Error|null}>} Response with upload result or error
   */
  uploadSubjectDocument: async (subjectId, file, description) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('description', description);

      const response = await gradesClient.post(`/subjects/${subjectId}/upload-document`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { data: response.data, error: null };
    } catch (error) {
      console.error("Upload subject document error:", error);
      return {
        data: null,
        error: {
          message: error.response?.data?.message || error.response?.data?.detail || "Failed to upload document",
          status: error.response?.status,
          originalError: error
        }
      };
    }
  }
};
