import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} from '../api';
import {
  PostListParams,
  PostCreateRequest,
  PostUpdateRequest,
} from '../types/api';

// Query Keys
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (params?: PostListParams) => [...postKeys.lists(), params] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
};

// 게시글 목록 조회
export const usePostsQuery = (params?: PostListParams) => {
  return useQuery({
    queryKey: postKeys.list(params),
    queryFn: () => getPosts(params),
    staleTime: 30000, // 30초
  });
};

// 게시글 단건 조회
export const usePostQuery = (id: string) => {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => getPost(id),
    enabled: !!id,
  });
};

// 게시글 작성
export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PostCreateRequest) => createPost(data),
    onSuccess: () => {
      // 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
};

// 게시글 수정
export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PostUpdateRequest }) => updatePost(id, data),
    onSuccess: (_, variables) => {
      // 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      // 상세 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.id) });
    },
  });
};

// 게시글 삭제
export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: () => {
      // 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
};

