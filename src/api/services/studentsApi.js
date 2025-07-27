import { chatClient } from "../apiClients";

/**
 * Students API Service
 * Provides methods for interacting with students backend endpoints
 */
export const studentsApi = {
  /**
   * Get all students for a specific class
   * 
   * @param {String} classId - The class ID
   * @param {Object} params - Query parameters (page, size, etc.)
   * @returns {Promise<{data: Object|null, error: Error|null}>} Response with students or error
   */
  getStudentsByClass: async (classId, params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = `/classes/${classId}/students${queryParams ? `?${queryParams}` : ''}`;
      const response = await chatClient.get(url);
      
      // Handle API response structure
      if (response.data.success) {
        return { data: response.data.data, error: null };
      } else {
        return { 
          data: null, 
          error: {
            message: response.data.message || "Failed to get students",
            errors: response.data.errors || []
          } 
        };
      }
    } catch (error) {
      console.error("Get students by class error:", error);
      return { 
        data: null, 
        error: {
          message: error.response?.data?.message || error.message || "Failed to get students",
          status: error.response?.status,
          errors: error.response?.data?.errors || [],
          originalError: error
        } 
      };
    }
  },

  /**
   * Get a specific student by ID
   * 
   * @param {String} studentId - The student ID
   * @returns {Promise<{data: Object|null, error: Error|null}>} Response with student data or error
   */
  getStudentById: async (studentId) => {
    try {
      const response = await chatClient.get(`/students/${studentId}`);
      
      // Handle API response structure
      if (response.data.success) {
        return { data: response.data.data, error: null };
      } else {
        return { 
          data: null, 
          error: {
            message: response.data.message || "Failed to get student",
            errors: response.data.errors || []
          } 
        };
      }
    } catch (error) {
      console.error("Get student by ID error:", error);
      return { 
        data: null, 
        error: {
          message: error.response?.data?.message || error.message || "Failed to get student",
          status: error.response?.status,
          errors: error.response?.data?.errors || [],
          originalError: error
        } 
      };
    }
  },

  /**
   * Create a new student
   * 
   * @param {Object} studentData - Student creation data
   * @param {String} studentData.first_name - Student first name
   * @param {String} studentData.last_name - Student last name
   * @param {String} studentData.email - Student email
   * @param {String} studentData.student_id - Student ID
   * @param {String} studentData.phone_number - Phone number
   * @param {String} studentData.parent_name - Parent name
   * @param {String} studentData.parent_phone - Parent phone
   * @param {String} studentData.address - Address
   * @param {String} studentData.grade_id - Grade ID
   * @returns {Promise<{data: Object|null, error: Error|null}>} Response with new student or error
   */
  createStudent: async (studentData) => {
    try {
      const response = await chatClient.post("/students", studentData);
      
      // Handle API response structure
      if (response.data.success) {
        return { data: response.data.data, error: null };
      } else {
        return { 
          data: null, 
          error: {
            message: response.data.message || "Failed to create student",
            errors: response.data.errors || []
          } 
        };
      }
    } catch (error) {
      console.error("Create student error:", error);
      return { 
        data: null, 
        error: {
          message: error.response?.data?.message || error.message || "Failed to create student",
          status: error.response?.status,
          errors: error.response?.data?.errors || [],
          originalError: error
        } 
      };
    }
  },

  /**
   * Update an existing student
   * 
   * @param {String} studentId - The student ID
   * @param {Object} studentData - Updated student data
   * @returns {Promise<{data: Object|null, error: Error|null}>} Response with updated student or error
   */
  updateStudent: async (studentId, studentData) => {
    try {
      const response = await chatClient.put(`/students/${studentId}`, studentData);
      
      // Handle API response structure
      if (response.data.success) {
        return { data: response.data.data, error: null };
      } else {
        return { 
          data: null, 
          error: {
            message: response.data.message || "Failed to update student",
            errors: response.data.errors || []
          } 
        };
      }
    } catch (error) {
      console.error("Update student error:", error);
      return { 
        data: null, 
        error: {
          message: error.response?.data?.message || error.message || "Failed to update student",
          status: error.response?.status,
          errors: error.response?.data?.errors || [],
          originalError: error
        } 
      };
    }
  },

  /**
   * Delete a student
   * 
   * @param {String} studentId - The student ID
   * @returns {Promise<{data: Object|null, error: Error|null}>} Response with success or error
   */
  deleteStudent: async (studentId) => {
    try {
      const response = await chatClient.delete(`/students/${studentId}`);
      
      // Handle API response structure
      if (response.data.success) {
        return { data: response.data.data, error: null };
      } else {
        return { 
          data: null, 
          error: {
            message: response.data.message || "Failed to delete student",
            errors: response.data.errors || []
          } 
        };
      }
    } catch (error) {
      console.error("Delete student error:", error);
      return { 
        data: null, 
        error: {
          message: error.response?.data?.message || error.message || "Failed to delete student",
          status: error.response?.status,
          errors: error.response?.data?.errors || [],
          originalError: error
        } 
      };
    }
  },

  /**
   * Bulk upload students from CSV/Excel
   * 
   * @param {String} classId - The class ID
   * @param {FormData} formData - Form data containing the file
   * @returns {Promise<{data: Object|null, error: Error|null}>} Response with upload results or error
   */
  bulkUploadStudents: async (classId, formData) => {
    try {
      const response = await chatClient.post(`/classes/${classId}/students/bulk-upload`, formData, {
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
            message: response.data.message || "Failed to upload students",
            errors: response.data.errors || []
          } 
        };
      }
    } catch (error) {
      console.error("Bulk upload students error:", error);
      return { 
        data: null, 
        error: {
          message: error.response?.data?.message || error.message || "Failed to upload students",
          status: error.response?.status,
          errors: error.response?.data?.errors || [],
          originalError: error
        } 
      };
    }
  }
};
