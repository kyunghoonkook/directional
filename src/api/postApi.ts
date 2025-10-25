import axiosInstance from './axios';
import {
  Post,
  PostListParams,
  PostListResponse,
  PostCreateRequest,
  PostUpdateRequest,
  DeleteResponse,
} from '../types/api';

// 게시글 목록 조회
export const getPosts = async (params?: PostListParams): Promise<PostListResponse> => {
  const response = await axiosInstance.get<PostListResponse>('/posts', { params });
  return response.data;
};

// 게시글 단건 조회
export const getPost = async (id: string): Promise<Post> => {
  const response = await axiosInstance.get<Post>(`/posts/${id}`);
  return response.data;
};

// 게시글 작성
export const createPost = async (data: PostCreateRequest): Promise<Post> => {
  const response = await axiosInstance.post<Post>('/posts', data);
  return response.data;
};

// 게시글 수정
export const updatePost = async (id: string, data: PostUpdateRequest): Promise<Post> => {
  const response = await axiosInstance.patch<Post>(`/posts/${id}`, data);
  return response.data;
};

// 게시글 삭제
export const deletePost = async (id: string): Promise<DeleteResponse> => {
  const response = await axiosInstance.delete<DeleteResponse>(`/posts/${id}`);
  return response.data;
};

// 모든 게시글 삭제
export const deleteAllPosts = async (): Promise<DeleteResponse> => {
  const response = await axiosInstance.delete<DeleteResponse>('/posts');
  return response.data;
};

