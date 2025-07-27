import { chatClient } from "../apiClients";

/**
 * Subjects API Service
 * Provides methods for interacting with subjects backend endpoints
 */
export const subjectsApi = {
  /**
   * Get all subjects with pagination
   * 
   * @param {Object} params - Query parameters (page, size, etc.)
   * @returns {Promise<{data: Object|null, error: Error|null}>} Response with subjects or error
   */
  getSubjects: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = `/subjects${queryParams ? `?${queryParams}` : ''}`;
      const response = await chatClient.get(url);
      
      // Handle API response structure
      if (response.data.success) {
        return { data: response.data.data, error: null };
      } else {
        return { 
          data: null, 
          error: {
            message: response.data.message || "Failed to get subjects",
            errors: response.data.errors || []
          } 
        };
      }
    } catch (error) {
      console.error("Get subjects error:", error);
      return { 
        data: null, 
        error: {
          message: error.response?.data?.message || error.message || "Failed to get subjects",
          status: error.response?.status,
          errors: error.response?.data?.errors || [],
          originalError: error
        } 
      };
    }
  },

  /**
   * Get a specific subject by ID
   * 
   * @param {String} subjectId - The subject ID
   * @returns {Promise<{data: Object|null, error: Error|null}>} Response with subject data or error
   */
  getSubjectById: async (subjectId) => {
    try {
      const response = await chatClient.get(`/subjects/${subjectId}`);
      
      // Handle API response structure
      if (response.data.success) {
        return { data: response.data.data, error: null };
      } else {
        return { 
          data: null, 
          error: {
            message: response.data.message || "Failed to get subject",
            errors: response.data.errors || []
          } 
        };
      }
    } catch (error) {
      console.error("Get subject by ID error:", error);
      return { 
        data: null, 
        error: {
          message: error.response?.data?.message || error.message || "Failed to get subject",
          status: error.response?.status,
          errors: error.response?.data?.errors || [],
          originalError: error
        } 
      };
    }
  },

  /**
   * Create a new subject
   * 
   * @param {Object} subjectData - Subject creation data
   * @param {String} subjectData.name - Subject name
   * @param {String} subjectData.description - Subject description
   * @returns {Promise<{data: Object|null, error: Error|null}>} Response with new subject or error
   */
  createSubject: async (subjectData) => {
    try {
      const response = await chatClient.post("/subjects", subjectData);
      
      // Handle API response structure
      if (response.data.success) {
        return { data: response.data.data, error: null };
      } else {
        return { 
          data: null, 
          error: {
            message: response.data.message || "Failed to create subject",
            errors: response.data.errors || []
          } 
        };
      }
    } catch (error) {
      console.error("Create subject error:", error);
      return { 
        data: null, 
        error: {
          message: error.response?.data?.message || error.message || "Failed to create subject",
          status: error.response?.status,
          errors: error.response?.data?.errors || [],
          originalError: error
        } 
      };
    }
  },

  /**
   * Update an existing subject
   * 
   * @param {String} subjectId - The subject ID
   * @param {Object} subjectData - Updated subject data
   * @returns {Promise<{data: Object|null, error: Error|null}>} Response with updated subject or error
   */
  updateSubject: async (subjectId, subjectData) => {
    try {
      const response = await chatClient.put(`/subjects/${subjectId}`, subjectData);
      
      // Handle API response structure
      if (response.data.success) {
        return { data: response.data.data, error: null };
      } else {
        return { 
          data: null, 
          error: {
            message: response.data.message || "Failed to update subject",
            errors: response.data.errors || []
          } 
        };
      }
    } catch (error) {
      console.error("Update subject error:", error);
      return { 
        data: null, 
        error: {
          message: error.response?.data?.message || error.message || "Failed to update subject",
          status: error.response?.status,
          errors: error.response?.data?.errors || [],
          originalError: error
        } 
      };
    }
  },

  /**
   * Delete a subject
   * 
   * @param {String} subjectId - The subject ID
   * @returns {Promise<{data: Object|null, error: Error|null}>} Response with success or error
   */
  deleteSubject: async (subjectId) => {
    try {
      const response = await chatClient.delete(`/subjects/${subjectId}`);
      
      // Handle API response structure
      if (response.data.success) {
        return { data: response.data.data, error: null };
      } else {
        return { 
          data: null, 
          error: {
            message: response.data.message || "Failed to delete subject",
            errors: response.data.errors || []
          } 
        };
      }
    } catch (error) {
      console.error("Delete subject error:", error);
      return { 
        data: null, 
        error: {
          message: error.response?.data?.message || error.message || "Failed to delete subject",
          status: error.response?.status,
          errors: error.response?.data?.errors || [],
          originalError: error
        } 
      };
    }
  },

  /**
   * Upload main document for a subject
   * 
   * @param {String} subjectId - The subject ID
   * @param {FormData} formData - Form data containing the file
   * @returns {Promise<{data: Object|null, error: Error|null}>} Response with upload results or error
   */
  uploadMainDocument: async (subjectId, formData) => {
    try {
      const response = await chatClient.post(`/subjects/${subjectId}/upload-document`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Handle API response structure
      if (response.data.success) {
        return { data: response.data.data, error: null };
      } else {
        return { 
          data: null, 
          error: {
            message: response.data.message || "Failed to upload document",
            errors: response.data.errors || []
          } 
        };
      }
    } catch (error) {
      console.error("Upload main document error:", error);
      return { 
        data: null, 
        error: {
          message: error.response?.data?.message || error.message || "Failed to upload document",
          status: error.response?.status,
          errors: error.response?.data?.errors || [],
          originalError: error
        } 
      };
    }
  }
};
