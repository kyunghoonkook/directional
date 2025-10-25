import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { usePostQuery, useCreatePostMutation, useUpdatePostMutation } from '../../hooks';
import { Button, Input, Textarea, Select, Loading } from '../../components/common';
import { Category } from '../../types/api';
import { CATEGORY_LABELS } from '../../utils/constants';
import { validateTitle, validateBody, validateTags } from '../../utils/validation';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 32px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const TagInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TagList = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const TagItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background-color: ${({ theme }) => theme.colors.backgroundGray};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: 14px;
`;

const RemoveTagButton = styled.button`
  padding: 0;
  background: none;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 16px;
  
  &:hover {
    color: ${({ theme }) => theme.colors.danger};
  }
`;

const TagInputWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const ErrorMessage = styled.div`
  padding: 12px;
  background-color: #fee;
  border: 1px solid ${({ theme }) => theme.colors.danger};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  color: ${({ theme }) => theme.colors.danger};
  font-size: 14px;
`;

const PostFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<Category>('FREE');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitError, setSubmitError] = useState('');

  const { data: post, isLoading: isLoadingPost } = usePostQuery(id || '');
  const createMutation = useCreatePostMutation();
  const updateMutation = useUpdatePostMutation();

  useEffect(() => {
    if (isEditMode && post) {
      setTitle(post.title);
      setBody(post.body);
      setCategory(post.category);
      setTags(post.tags);
    }
  }, [isEditMode, post]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    const titleError = validateTitle(title);
    if (titleError) newErrors.title = titleError;

    const bodyError = validateBody(body);
    if (bodyError) newErrors.body = bodyError;

    const tagsError = validateTags(tags);
    if (tagsError) newErrors.tags = tagsError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (!trimmedTag) return;

    if (tags.includes(trimmedTag)) {
      setErrors((prev) => ({ ...prev, tags: '이미 추가된 태그입니다' }));
      return;
    }

    if (tags.length >= 5) {
      setErrors((prev) => ({ ...prev, tags: '태그는 최대 5개까지 추가할 수 있습니다' }));
      return;
    }

    if (trimmedTag.length > 24) {
      setErrors((prev) => ({ ...prev, tags: '각 태그는 최대 24자까지 입력 가능합니다' }));
      return;
    }

    setTags([...tags, trimmedTag]);
    setTagInput('');
    setErrors((prev) => ({ ...prev, tags: '' }));
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    try {
      const postData = {
        title,
        body,
        category,
        tags,
      };

      if (isEditMode && id) {
        await updateMutation.mutateAsync({ id, data: postData });
      } else {
        await createMutation.mutateAsync(postData);
      }

      navigate('/posts');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : '저장에 실패했습니다');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  if (isEditMode && isLoadingPost) {
    return <Loading />;
  }

  return (
    <Container>
      <Header>
        <Title>{isEditMode ? '게시글 수정' : '새 게시글 작성'}</Title>
      </Header>

      <Form onSubmit={handleSubmit}>
        <Input
          label="제목"
          placeholder="제목을 입력하세요 (최대 80자)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
        />

        <Select
          label="카테고리"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          options={[
            { value: 'NOTICE', label: CATEGORY_LABELS.NOTICE },
            { value: 'QNA', label: CATEGORY_LABELS.QNA },
            { value: 'FREE', label: CATEGORY_LABELS.FREE },
          ]}
        />

        <Textarea
          label="본문"
          placeholder="본문을 입력하세요 (최대 2000자)"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          error={errors.body}
          rows={10}
        />

        <TagInputContainer>
          <label>태그 (최대 5개, 각 24자 이내)</label>
          {tags.length > 0 && (
            <TagList>
              {tags.map((tag, index) => (
                <TagItem key={index}>
                  {tag}
                  <RemoveTagButton type="button" onClick={() => handleRemoveTag(tag)}>
                    ×
                  </RemoveTagButton>
                </TagItem>
              ))}
            </TagList>
          )}
          <TagInputWrapper>
            <Input
              placeholder="태그를 입력하고 Enter를 누르세요"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleKeyPress}
              error={errors.tags}
            />
            <Button type="button" onClick={handleAddTag} variant="secondary">
              추가
            </Button>
          </TagInputWrapper>
        </TagInputContainer>

        {submitError && <ErrorMessage>{submitError}</ErrorMessage>}

        <ButtonGroup>
          <Button type="button" variant="secondary" onClick={() => navigate('/posts')}>
            취소
          </Button>
          <Button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending
              ? '저장 중...'
              : isEditMode
              ? '수정'
              : '작성'}
          </Button>
        </ButtonGroup>
      </Form>
    </Container>
  );
};

export default PostFormPage;

