import { chatClient } from "../apiClients";
import { 
  validateCreateFeedRequest, 
  validateChatMessageRequest,
  transformToCreateFeedRequest,
  transformToChatMessageRequest,
  logValidationErrors 
} from "../../utils/schemaValidation";

/**
 * Chat API Service
 * Provides methods for interacting with chat backend endpoints
 */
export const chatApi = {
  /**
   * Create a new feed (chat session)
   * 
   * @param {Object} feedData - Feed creation data
   * @param {String} feedData.userId - User ID
   * @param {String} feedData.classId - Class ID
   * @param {String} feedData.title - Feed title
   * @param {String} feedData.contextData - Context text data
   * @param {Array} feedData.contextFiles - Array of file names
   * @param {Array} feedData.selectedAgents - Array of agent types
   * @returns {Promise<{data: Object|null, error: Error|null}>} Response with new feed or error
   */
  createFeed: async (feedData) => {
    try {
      // Validate the input data before sending
      const validation = validateCreateFeedRequest(feedData);
      if (!validation.isValid) {
        logValidationErrors('createFeed', validation.errors);
        return { 
          data: null, 
          error: {
            message: `Schema validation failed: ${validation.errors.join(', ')}`,
            status: 400,
            validationErrors: validation.errors
          } 
        };
      }

      // Transform to API format
      const apiData = transformToCreateFeedRequest(feedData);
      console.log('Sending createFeed request with validated data:', apiData);

      const response = await chatClient.post("/feeds", apiData);
      return { data: response.data, error: null };
    } catch (error) {
      console.error("Create feed error:", error);
      return { 
        data: null, 
        error: {
          message: error.response?.data?.detail || error.message || "Failed to create feed",
          status: error.response?.status,
          originalError: error
        } 
      };
    }
  },

  /**
   * Get all prompts for a specific feed
   * 
   * @param {String} feedId - The feed ID
   * @returns {Promise<{data: Object|null, error: Error|null}>} Response with feed prompts or error
   */
  getFeedPrompts: async (feedId) => {
    try {
      const response = await chatClient.get(`/feeds/${feedId}/prompts`);
      return { data: response.data, error: null };
    } catch (error) {
      console.error("Get feed prompts error:", error);
      return { 
        data: null, 
        error: {
          message: error.response?.data?.detail || error.message || "Failed to get feed prompts",
          status: error.response?.status,
          originalError: error
        } 
      };
    }
  },

  /**
   * Create a new prompt entry
   * 
   * @param {Object} promptData - Prompt creation data
   * @param {String} promptData.feedId - Feed ID
   * @param {String} promptData.userPrompt - User's prompt text
   * @param {String} promptData.selectedAgent - Selected agent type
   * @returns {Promise<{data: Object|null, error: Error|null}>} Response with new prompt or error
   */
  createPrompt: async (promptData) => {
    try {
      // Validate the input data before sending
      const validation = validateChatMessageRequest(promptData);
      if (!validation.isValid) {
        logValidationErrors('createPrompt', validation.errors);
        return { 
          data: null, 
          error: {
            message: `Schema validation failed: ${validation.errors.join(', ')}`,
            status: 400,
            validationErrors: validation.errors
          } 
        };
      }

      // Transform to API format
      const apiData = transformToChatMessageRequest(promptData);
      console.log('Sending createPrompt request with validated data:', apiData);

      const response = await chatClient.post("/prompts", apiData);
      return { data: response.data, error: null };
    } catch (error) {
      console.error("Create prompt error:", error);
      return { 
        data: null, 
        error: {
          message: error.response?.data?.detail || error.message || "Failed to create prompt",
          status: error.response?.status,
          originalError: error
        } 
      };
    }
  }
}
