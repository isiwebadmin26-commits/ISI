// src/hooks/useChatHistory.ts
import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchUserConversations, 
  createConversation, 
  updateConversationTitle, 
  togglePinConversation, 
  deleteConversation,
  groupConversationsByDate 
} from '../services/chatService';
import { Conversation, GroupedConversations } from '../types/chat';
import { toast } from 'sonner';

export function useChatHistory(userId?: string | null) {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search query by 250ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Query: Fetch conversations
  const { 
    data: conversations = [], 
    isLoading, 
    isError, 
    refetch 
  } = useQuery({
    queryKey: ['conversations', userId],
    queryFn: () => fetchUserConversations(userId),
    staleTime: 1000 * 60 * 2 // 2 minutes
  });

  // Filtered by debounced search
  const filteredConversations = useMemo(() => {
    if (!debouncedSearch.trim()) return conversations;
    const lower = debouncedSearch.toLowerCase().trim();
    return conversations.filter((c) => c.title.toLowerCase().includes(lower));
  }, [conversations, debouncedSearch]);

  // Grouped by Date & Pinned
  const grouped: GroupedConversations = useMemo(() => {
    return groupConversationsByDate(filteredConversations);
  }, [filteredConversations]);

  // Mutation: Create Conversation
  const createMutation = useMutation({
    mutationFn: (title?: string) => createConversation(title || 'New Security Consultation', userId),
    onSuccess: (newConv) => {
      if (newConv) {
        queryClient.setQueryData<Conversation[]>(['conversations', userId], (old = []) => [
          newConv,
          ...old
        ]);
      }
    }
  });

  // Mutation: Rename Conversation (Optimistic Update)
  const renameMutation = useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) => updateConversationTitle(id, title),
    onMutate: async ({ id, title }) => {
      await queryClient.cancelQueries({ queryKey: ['conversations', userId] });
      const previous = queryClient.getQueryData<Conversation[]>(['conversations', userId]);

      queryClient.setQueryData<Conversation[]>(['conversations', userId], (old = []) =>
        old.map((c) => (c.id === id ? { ...c, title, updated_at: new Date().toISOString() } : c))
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['conversations', userId], context.previous);
      }
      toast.error('Failed to rename conversation');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations', userId] });
    }
  });

  // Mutation: Toggle Pin (Optimistic Update)
  const pinMutation = useMutation({
    mutationFn: ({ id, currentPinned }: { id: string; currentPinned: boolean }) =>
      togglePinConversation(id, currentPinned),
    onMutate: async ({ id, currentPinned }) => {
      await queryClient.cancelQueries({ queryKey: ['conversations', userId] });
      const previous = queryClient.getQueryData<Conversation[]>(['conversations', userId]);

      queryClient.setQueryData<Conversation[]>(['conversations', userId], (old = []) =>
        old.map((c) => (c.id === id ? { ...c, pinned: !currentPinned } : c))
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['conversations', userId], context.previous);
      }
      toast.error('Failed to pin conversation');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations', userId] });
    }
  });

  // Mutation: Delete Conversation (Optimistic Update)
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteConversation(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['conversations', userId] });
      const previous = queryClient.getQueryData<Conversation[]>(['conversations', userId]);

      queryClient.setQueryData<Conversation[]>(['conversations', userId], (old = []) =>
        old.filter((c) => c.id !== id)
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['conversations', userId], context.previous);
      }
      toast.error('Failed to delete conversation');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations', userId] });
    }
  });

  return {
    conversations,
    filteredConversations,
    grouped,
    searchQuery,
    setSearchQuery,
    isLoading,
    isError,
    refetch,
    createConversation: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    renameConversation: (id: string, title: string) => renameMutation.mutateAsync({ id, title }),
    togglePin: (id: string, currentPinned: boolean) => pinMutation.mutateAsync({ id, currentPinned }),
    deleteConversation: (id: string) => deleteMutation.mutateAsync(id)
  };
}
