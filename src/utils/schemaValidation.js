/**
 * Schema validation utilities for API requests
 * Helps prevent Unprocessable Entity errors by validating data before sending
 */

/**
 * Validates feed creation request data
 * @param {Object} data - The feed data to validate
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
export const validateCreateFeedRequest = (data) => {
  const errors = [];

  // Required fields
  if (!data.userId || typeof data.userId !== 'string') {
    errors.push('user_id is required and must be a string');
  }

  if (!data.classId || typeof data.classId !== 'string') {
    errors.push('class_id is required and must be a string');
  }

  if (!data.selectedAgents || !Array.isArray(data.selectedAgents) || data.selectedAgents.length === 0) {
    errors.push('selected_agents is required and must be a non-empty array');
  }

  // Optional fields validation
  if (data.title !== undefined && data.title !== null && typeof data.title !== 'string') {
    errors.push('title must be a string if provided');
  }

  if (data.contextData !== undefined && data.contextData !== null && typeof data.contextData !== 'string') {
    errors.push('context_data must be a string if provided');
  }

  if (data.contextFiles !== undefined && data.contextFiles !== null) {
    if (!Array.isArray(data.contextFiles)) {
      errors.push('context_files must be an array if provided');
    } else {
      // Validate each file name is a string
      data.contextFiles.forEach((file, index) => {
        if (typeof file !== 'string') {
          errors.push(`context_files[${index}] must be a string`);
        }
      });
    }
  }

  // Validate agent names
  if (data.selectedAgents && Array.isArray(data.selectedAgents)) {
    const validAgents = ['rag_agent', 'hyperlocal_generator', 'quiz_generator', 'assessment_agent'];
    data.selectedAgents.forEach((agent, index) => {
      if (typeof agent !== 'string') {
        errors.push(`selected_agents[${index}] must be a string`);
      } else if (!validAgents.includes(agent)) {
        errors.push(`selected_agents[${index}] "${agent}" is not a valid agent. Valid agents: ${validAgents.join(', ')}`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates chat message request data
 * @param {Object} data - The message data to validate
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
export const validateChatMessageRequest = (data) => {
  const errors = [];

  // Required fields
  if (!data.feedId || typeof data.feedId !== 'string') {
    errors.push('feed_id is required and must be a string');
  }

  if (!data.userPrompt || typeof data.userPrompt !== 'string' || data.userPrompt.trim() === '') {
    errors.push('user_prompt is required and must be a non-empty string');
  }

  if (!data.selectedAgent || typeof data.selectedAgent !== 'string') {
    errors.push('selected_agent is required and must be a string');
  }

  // Validate agent name
  if (data.selectedAgent && typeof data.selectedAgent === 'string') {
    const validAgents = ['rag_agent', 'hyperlocal_generator', 'quiz_generator', 'assessment_agent'];
    if (!validAgents.includes(data.selectedAgent)) {
      errors.push(`selected_agent "${data.selectedAgent}" is not valid. Valid agents: ${validAgents.join(', ')}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Transforms frontend data to API format for feed creation
 * @param {Object} frontendData - Data from frontend components
 * @returns {Object} - API-formatted data
 */
export const transformToCreateFeedRequest = (frontendData) => {
  return {
    user_id: frontendData.userId,
    class_id: frontendData.classId,
    title: frontendData.title || null,
    context_data: frontendData.contextData || null,
    context_files: frontendData.contextFiles || [],
    selected_agents: frontendData.selectedAgents || []
  };
};

/**
 * Transforms frontend data to API format for chat messages
 * @param {Object} frontendData - Data from frontend components
 * @returns {Object} - API-formatted data
 */
export const transformToChatMessageRequest = (frontendData) => {
  return {
    feed_id: frontendData.feedId,
    user_prompt: frontendData.userPrompt?.trim(),
    selected_agent: frontendData.selectedAgent
  };
};

/**
 * Logs validation errors in a structured way
 * @param {string} operation - The operation being performed
 * @param {string[]} errors - Array of validation errors
 */
export const logValidationErrors = (operation, errors) => {
  console.error(`❌ Schema validation failed for ${operation}:`);
  errors.forEach((error, index) => {
    console.error(`  ${index + 1}. ${error}`);
  });
};
