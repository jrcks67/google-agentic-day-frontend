import { chatClient } from "../apiClients";

/**
 * Classes API Service
 * Provides methods for interacting with classes backend endpoints
 */
export const classesApi = {
  /**
   * Get all classes for the current user
   * 
   * @returns {Promise<{data: Object|null, error: Error|null}>} Response with classes or error
   */
  getClasses: async () => {
    try {
      const response = await chatClient.get("/classes");
      
      // Handle API response structure
      if (response.data.success) {
        return { data: response.data.data, error: null };
      } else {
        return { 
          data: null, 
          error: {
            message: response.data.message || "Failed to get classes",
            errors: response.data.errors || []
          } 
        };
      }
    } catch (error) {
      console.error("Get classes error:", error);
      return { 
        data: null, 
        error: {
          message: error.response?.data?.message || error.message || "Failed to get classes",
          status: error.response?.status,
          errors: error.response?.data?.errors || [],
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
  getClassById: async (classId) => {
    try {
      const response = await chatClient.get(`/classes/${classId}`);
      
      // Handle API response structure
      if (response.data.success) {
        return { data: response.data.data, error: null };
      } else {
        return { 
          data: null, 
          error: {
            message: response.data.message || "Failed to get class",
            errors: response.data.errors || []
          } 
        };
      }
    } catch (error) {
      console.error("Get class by ID error:", error);
      return { 
        data: null, 
        error: {
          message: error.response?.data?.message || error.message || "Failed to get class",
          status: error.response?.status,
          errors: error.response?.data?.errors || [],
          originalError: error
        } 
      };
    }
  },

  /**
   * Create a new class
   * 
   * @param {Object} classData - Class creation data
   * @param {String} classData.name - Class name
   * @param {String} classData.grade - Grade level
   * @param {String} classData.academic_year - Academic year
   * @returns {Promise<{data: Object|null, error: Error|null}>} Response with new class or error
   */
  createClass: async (classData) => {
    try {
      const response = await chatClient.post("/classes", classData);
      
      // Handle API response structure
      if (response.data.success) {
        return { data: response.data.data, error: null };
      } else {
        return { 
          data: null, 
          error: {
            message: response.data.message || "Failed to create class",
            errors: response.data.errors || []
          } 
        };
      }
    } catch (error) {
      console.error("Create class error:", error);
      return { 
        data: null, 
        error: {
          message: error.response?.data?.message || error.message || "Failed to create class",
          status: error.response?.status,
          errors: error.response?.data?.errors || [],
          originalError: error
        } 
      };
    }
  },

  /**
   * Update an existing class
   * 
   * @param {String} classId - The class ID
   * @param {Object} classData - Updated class data
   * @returns {Promise<{data: Object|null, error: Error|null}>} Response with updated class or error
   */
  updateClass: async (classId, classData) => {
    try {
      const response = await chatClient.put(`/classes/${classId}`, classData);
      
      // Handle API response structure
      if (response.data.success) {
        return { data: response.data.data, error: null };
      } else {
        return { 
          data: null, 
          error: {
            message: response.data.message || "Failed to update class",
            errors: response.data.errors || []
          } 
        };
      }
    } catch (error) {
      console.error("Update class error:", error);
      return { 
        data: null, 
        error: {
          message: error.response?.data?.message || error.message || "Failed to update class",
          status: error.response?.status,
          errors: error.response?.data?.errors || [],
          originalError: error
        } 
      };
    }
  },

  /**
   * Delete a class
   * 
   * @param {String} classId - The class ID
   * @returns {Promise<{data: Object|null, error: Error|null}>} Response with success or error
   */
  deleteClass: async (classId) => {
    try {
      const response = await chatClient.delete(`/classes/${classId}`);
      
      // Handle API response structure
      if (response.data.success) {
        return { data: response.data.data, error: null };
      } else {
        return { 
          data: null, 
          error: {
            message: response.data.message || "Failed to delete class",
            errors: response.data.errors || []
          } 
        };
      }
    } catch (error) {
      console.error("Delete class error:", error);
      return { 
        data: null, 
        error: {
          message: error.response?.data?.message || error.message || "Failed to delete class",
          status: error.response?.status,
          errors: error.response?.data?.errors || [],
          originalError: error
        } 
      };
    }
  }
};
