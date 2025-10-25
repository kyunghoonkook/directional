import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { usePostsQuery } from '../../hooks';
import { Button, Input, Select, Loading } from '../../components/common';
import { Category, SortField, SortOrder, PostListParams } from '../../types/api';
import { CATEGORY_LABELS } from '../../utils/constants';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
`;

const FilterSection = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-end;
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PostCard = styled.div`
  padding: 24px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.small};
  cursor: pointer;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const PostTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const CategoryBadge = styled.span<{ $category: Category }>`
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: 12px;
  font-weight: 500;
  color: white;
  background-color: ${({ theme, $category }) => {
    switch ($category) {
      case 'NOTICE':
        return theme.colors.notice;
      case 'QNA':
        return theme.colors.qna;
      case 'FREE':
        return theme.colors.free;
      default:
        return theme.colors.secondary;
    }
  }};
`;

const PostBody = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PostMeta = styled.div`
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textLighter};
`;

const TagList = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
`;

const Tag = styled.span`
  padding: 4px 8px;
  background-color: ${({ theme }) => theme.colors.backgroundGray};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textLight};
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
`;

const EmptyMessage = styled.div`
  padding: 60px 20px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textLighter};
  font-size: 16px;
`;

const ErrorMessage = styled.div`
  padding: 20px;
  background-color: #fee;
  border: 1px solid ${({ theme }) => theme.colors.danger};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  color: ${({ theme }) => theme.colors.danger};
  text-align: center;
`;

const PostListPage: React.FC = () => {
  const navigate = useNavigate();
  const [params, setParams] = useState<PostListParams>({
    limit: 10,
    sort: 'createdAt',
    order: 'desc',
  });

  const { data, isLoading, error } = usePostsQuery(params);

  const handleSearch = (search: string) => {
    setParams((prev) => ({ ...prev, search, nextCursor: undefined, prevCursor: undefined }));
  };

  const handleCategoryChange = (category: string) => {
    setParams((prev) => ({
      ...prev,
      category: category === 'ALL' ? undefined : (category as Category),
      nextCursor: undefined,
      prevCursor: undefined,
    }));
  };

  const handleSortChange = (sort: string) => {
    setParams((prev) => ({
      ...prev,
      sort: sort as SortField,
      nextCursor: undefined,
      prevCursor: undefined,
    }));
  };

  const handleOrderChange = (order: string) => {
    setParams((prev) => ({
      ...prev,
      order: order as SortOrder,
      nextCursor: undefined,
      prevCursor: undefined,
    }));
  };

  const handleNextPage = () => {
    if (data?.nextCursor) {
      setParams((prev) => ({ ...prev, nextCursor: data.nextCursor!, prevCursor: undefined }));
    }
  };

  const handlePrevPage = () => {
    if (data?.prevCursor) {
      setParams((prev) => ({ ...prev, prevCursor: data.prevCursor!, nextCursor: undefined }));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage>{error.message}</ErrorMessage>;

  return (
    <Container>
      <Header>
        <Title>게시글 목록</Title>
        <Button onClick={() => navigate('/posts/new')}>새 글 작성</Button>
      </Header>

      <FilterSection>
        <FilterGroup>
          <Input
            placeholder="검색어를 입력하세요"
            value={params.search || ''}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </FilterGroup>
        <FilterGroup>
          <Select
            value={params.category || 'ALL'}
            onChange={(e) => handleCategoryChange(e.target.value)}
            options={[
              { value: 'ALL', label: '전체' },
              { value: 'NOTICE', label: CATEGORY_LABELS.NOTICE },
              { value: 'QNA', label: CATEGORY_LABELS.QNA },
              { value: 'FREE', label: CATEGORY_LABELS.FREE },
            ]}
          />
        </FilterGroup>
        <FilterGroup>
          <Select
            value={params.sort || 'createdAt'}
            onChange={(e) => handleSortChange(e.target.value)}
            options={[
              { value: 'createdAt', label: '작성일' },
              { value: 'title', label: '제목' },
            ]}
          />
          <Select
            value={params.order || 'desc'}
            onChange={(e) => handleOrderChange(e.target.value)}
            options={[
              { value: 'desc', label: '내림차순' },
              { value: 'asc', label: '오름차순' },
            ]}
          />
        </FilterGroup>
      </FilterSection>

      {data?.items && data.items.length > 0 ? (
        <>
          <PostList>
            {data.items.map((post) => (
              <PostCard key={post.id} onClick={() => navigate(`/posts/${post.id}`)}>
                <PostHeader>
                  <PostTitle>{post.title}</PostTitle>
                  <CategoryBadge $category={post.category}>
                    {CATEGORY_LABELS[post.category]}
                  </CategoryBadge>
                </PostHeader>
                <PostBody>{post.body}</PostBody>
                <PostMeta>
                  <span>작성일: {formatDate(post.createdAt)}</span>
                </PostMeta>
                {post.tags.length > 0 && (
                  <TagList>
                    {post.tags.map((tag, index) => (
                      <Tag key={index}>{tag}</Tag>
                    ))}
                  </TagList>
                )}
              </PostCard>
            ))}
          </PostList>
          <Pagination>
            <Button
              onClick={handlePrevPage}
              disabled={!data.prevCursor}
              variant="secondary"
            >
              이전 페이지
            </Button>
            <Button
              onClick={handleNextPage}
              disabled={!data.nextCursor}
              variant="secondary"
            >
              다음 페이지
            </Button>
          </Pagination>
        </>
      ) : (
        <EmptyMessage>게시글이 없습니다</EmptyMessage>
      )}
    </Container>
  );
};

export default PostListPage;

