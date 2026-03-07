/**
 * 암기하기 채점 결과.
 * 채점 로직 추가 시 필드 확장.
 */
export type GradeResult = {
  totalBlanks: number;
  correctCount: number;
  /** 페이지 인덱스별 맞은 개수 등 상세 정보 (선택) */
  details?: Record<number, { correct: number; total: number }>;
};
