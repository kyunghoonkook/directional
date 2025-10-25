import { FORBIDDEN_WORDS } from './constants';

// 금칙어 체크
export const checkForbiddenWords = (text: string): string | null => {
  const lowerText = text.toLowerCase();
  for (const word of FORBIDDEN_WORDS) {
    if (lowerText.includes(word.toLowerCase())) {
      return word;
    }
  }
  return null;
};

// 제목 유효성 검사
export const validateTitle = (title: string): string | null => {
  if (!title.trim()) {
    return '제목을 입력해주세요';
  }
  if (title.length > 80) {
    return '제목은 최대 80자까지 입력 가능합니다';
  }
  const forbiddenWord = checkForbiddenWords(title);
  if (forbiddenWord) {
    return `금칙어가 포함되어 있습니다: "${forbiddenWord}"`;
  }
  return null;
};

// 본문 유효성 검사
export const validateBody = (body: string): string | null => {
  if (!body.trim()) {
    return '본문을 입력해주세요';
  }
  if (body.length > 2000) {
    return '본문은 최대 2000자까지 입력 가능합니다';
  }
  const forbiddenWord = checkForbiddenWords(body);
  if (forbiddenWord) {
    return `금칙어가 포함되어 있습니다: "${forbiddenWord}"`;
  }
  return null;
};

// 태그 유효성 검사
export const validateTags = (tags: string[]): string | null => {
  if (tags.length > 5) {
    return '태그는 최대 5개까지 입력 가능합니다';
  }
  for (const tag of tags) {
    if (tag.length > 24) {
      return '각 태그는 최대 24자까지 입력 가능합니다';
    }
  }
  return null;
};

