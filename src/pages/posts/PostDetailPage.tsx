import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { usePostQuery, useDeletePostMutation } from '../../hooks';
import { Button, Loading } from '../../components/common';
import { CATEGORY_LABELS } from '../../utils/constants';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Card = styled.div`
  padding: 32px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const TitleSection = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 12px;
`;

const Meta = styled.div`
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textLight};
`;

const CategoryBadge = styled.span<{ $category: string }>`
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

const Body = styled.div`
  font-size: 16px;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.text};
  white-space: pre-wrap;
  margin-bottom: 24px;
`;

const TagList = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 24px;
`;

const Tag = styled.span`
  padding: 6px 12px;
  background-color: ${({ theme }) => theme.colors.backgroundGray};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textLight};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const ErrorMessage = styled.div`
  padding: 20px;
  background-color: #fee;
  border: 1px solid ${({ theme }) => theme.colors.danger};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  color: ${({ theme }) => theme.colors.danger};
  text-align: center;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  max-width: 400px;
  width: 90%;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
`;

const ModalText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 24px;
`;

const ModalButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: post, isLoading, error } = usePostQuery(id || '');
  const deleteMutation = useDeletePostMutation();

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

  const handleDelete = async () => {
    if (!id) return;

    try {
      await deleteMutation.mutateAsync(id);
      navigate('/posts');
    } catch (error) {
      alert(error instanceof Error ? error.message : '삭제에 실패했습니다');
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage>{error.message}</ErrorMessage>;
  if (!post) return <ErrorMessage>게시글을 찾을 수 없습니다</ErrorMessage>;

  return (
    <Container>
      <Card>
        <Header>
          <TitleSection>
            <Title>{post.title}</Title>
            <Meta>
              <CategoryBadge $category={post.category}>
                {CATEGORY_LABELS[post.category]}
              </CategoryBadge>
              <span>작성일: {formatDate(post.createdAt)}</span>
            </Meta>
          </TitleSection>
        </Header>

        <Body>{post.body}</Body>

        {post.tags.length > 0 && (
          <TagList>
            {post.tags.map((tag, index) => (
              <Tag key={index}>{tag}</Tag>
            ))}
          </TagList>
        )}

        <ButtonGroup>
          <Button variant="secondary" onClick={() => navigate('/posts')}>
            목록으로
          </Button>
          <Button variant="secondary" onClick={() => navigate(`/posts/${id}/edit`)}>
            수정
          </Button>
          <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
            삭제
          </Button>
        </ButtonGroup>
      </Card>

      {showDeleteModal && (
        <Modal onClick={() => setShowDeleteModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>게시글 삭제</ModalTitle>
            <ModalText>정말로 이 게시글을 삭제하시겠습니까?</ModalText>
            <ModalButtonGroup>
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                취소
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? '삭제 중...' : '삭제'}
              </Button>
            </ModalButtonGroup>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default PostDetailPage;

