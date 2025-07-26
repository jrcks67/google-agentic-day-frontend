import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { chatApi } from '../api/services/chatApi';

/**
 * Hook to send chat prompts to the API
 * @returns {Object} mutation object for sending prompts
 */
export const useChat = () => {
  return useMutation({
    mutationFn: ({ prompt, conversationId, options }) => 
      chatApi.sendPrompt({ prompt, conversationId, options })
  });
};

/**
 * Hook to get chat history for a conversation
 * @param {String} conversationId - The conversation ID
 * @returns {Object} query object for chat history
 */
export const useChatHistory = (conversationId) => {
  return useQuery({
    queryKey: ['chat-history', conversationId],
    queryFn: () => chatApi.getChatHistory(conversationId),
    enabled: !!conversationId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to get all conversations for the current user
 * @returns {Object} query object for conversations
 */
export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: chatApi.getConversations,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

/**
 * Hook to create a new conversation
 * @returns {Object} mutation object for creating conversations
 */
export const useCreateConversation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (title) => chatApi.createConversation(title),
    onSuccess: () => {
      // Invalidate conversations list to refresh
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
  });
};

/**
 * Hook to delete a conversation
 * @returns {Object} mutation object for deleting conversations
 */
export const useDeleteConversation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (conversationId) => chatApi.deleteConversation(conversationId),
    onSuccess: (data, conversationId) => {
      // Invalidate conversations list and specific chat history
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.removeQueries({ queryKey: ['chat-history', conversationId] });
    }
  });
};

/**
 * Hook to update a conversation
 * @returns {Object} mutation object for updating conversations
 */
export const useUpdateConversation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ conversationId, title }) => 
      chatApi.updateConversation(conversationId, title),
    onSuccess: () => {
      // Invalidate conversations list to refresh
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
  });
};

/**
 * Hook to send a message and update chat history
 * @param {String} conversationId - The conversation ID
 * @returns {Object} mutation object for sending messages
 */
export const useSendMessage = (conversationId) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ prompt, options }) => 
      chatApi.sendPrompt({ prompt, conversationId, options }),
    onSuccess: () => {
      // Invalidate chat history to refresh with new message
      queryClient.invalidateQueries({ queryKey: ['chat-history', conversationId] });
      // Also invalidate conversations in case this was a new conversation
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
  });
};
