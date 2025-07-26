import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as gradesApi from '../api/services/gradesApi';

/**
 * Hook to fetch all grades/classes
 */
export const useGrades = () => {
  return useQuery({
    queryKey: ['grades'],
    queryFn: async () => {
      const { data, error } = await gradesApi.getGrades();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to create a new grade/class
 */
export const useCreateGrade = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (gradeData) => {
      const { data, error } = await gradesApi.createGrade(gradeData);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch grades list
      queryClient.invalidateQueries({ queryKey: ['grades'] });
    },
    onError: (error) => {
      console.error('Create grade mutation error:', error);
    }
  });
};

/**
 * Hook to update a grade/class
 */
export const useUpdateGrade = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ gradeId, gradeData }) => {
      const { data, error } = await gradesApi.updateGrade(gradeId, gradeData);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch grades list
      queryClient.invalidateQueries({ queryKey: ['grades'] });
    },
    onError: (error) => {
      console.error('Update grade mutation error:', error);
    }
  });
};

/**
 * Hook to delete a grade/class
 */
export const useDeleteGrade = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (gradeId) => {
      const { data, error } = await gradesApi.deleteGrade(gradeId);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch grades list
      queryClient.invalidateQueries({ queryKey: ['grades'] });
    },
    onError: (error) => {
      console.error('Delete grade mutation error:', error);
    }
  });
};
