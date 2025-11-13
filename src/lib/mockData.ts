import type {
  MockDocument,
  DocumentSummary,
  Conversation,
  Message
} from '@/types'

// ===================================
// Mock Documents (리포트 목록)
// ===================================

export const mockDocuments: MockDocument[] = [
  {
    id: 'doc-1',
    title: '2024 글로벌 경제 전망 보고서',
    author: '한국은행 경제연구원',
    published_date: '2024-01-15',
    source_type: 'pdf',
    source_url: 'https://example.com/reports/2024-global-economy.pdf',
    language: 'ko',
    processing_status: 'completed',
    importance: 'high',
    total_pages: 145,
    file_size: 5242880,
    created_at: '2024-01-15T09:00:00Z',
    updated_at: '2024-01-15T09:30:00Z',
  },
  {
    id: 'doc-2',
    title: 'AI 산업 투자 동향 분석 2024',
    author: '금융연구원',
    published_date: '2024-02-20',
    source_type: 'pdf',
    source_url: 'https://example.com/reports/ai-investment-2024.pdf',
    language: 'ko',
    processing_status: 'completed',
    importance: 'high',
    total_pages: 98,
    file_size: 3145728,
    created_at: '2024-02-20T10:30:00Z',
    updated_at: '2024-02-20T11:00:00Z',
  },
  {
    id: 'doc-3',
    title: '반도체 시장 분석 리포트',
    author: 'KDB산업은행',
    published_date: '2024-03-10',
    source_type: 'pdf',
    source_url: 'https://example.com/reports/semiconductor-market.pdf',
    language: 'ko',
    processing_status: 'completed',
    importance: 'medium',
    total_pages: 72,
    file_size: 2097152,
    created_at: '2024-03-10T14:00:00Z',
    updated_at: '2024-03-10T14:30:00Z',
  },
  {
    id: 'doc-4',
    title: '부동산 시장 전망 Q1 2024',
    author: '국토연구원',
    published_date: '2024-03-25',
    source_type: 'pdf',
    source_url: 'https://example.com/reports/real-estate-q1.pdf',
    language: 'ko',
    processing_status: 'completed',
    importance: 'medium',
    total_pages: 54,
    file_size: 1572864,
    created_at: '2024-03-25T11:00:00Z',
    updated_at: '2024-03-25T11:20:00Z',
  },
  {
    id: 'doc-5',
    title: '탄소중립 정책 동향',
    author: '환경부',
    published_date: '2024-04-05',
    source_type: 'pdf',
    source_url: 'https://example.com/reports/carbon-neutral.pdf',
    language: 'ko',
    processing_status: 'completed',
    importance: 'low',
    total_pages: 36,
    file_size: 1048576,
    created_at: '2024-04-05T09:30:00Z',
    updated_at: '2024-04-05T09:45:00Z',
  },
  {
    id: 'doc-6',
    title: 'K-뷰티 해외 진출 전략',
    author: '무역협회',
    published_date: '2024-04-12',
    source_type: 'pdf',
    source_url: 'https://example.com/reports/k-beauty-global.pdf',
    language: 'ko',
    processing_status: 'completed',
    importance: 'low',
    total_pages: 42,
    file_size: 1310720,
    created_at: '2024-04-12T15:00:00Z',
    updated_at: '2024-04-12T15:15:00Z',
  },
]

// ===================================
// Mock Document Summaries
// ===================================

export const mockSummaries: Record<string, DocumentSummary> = {
  'doc-1': {
    id: 'summary-1',
    document_id: 'doc-1',
    summary_short: '2024년 글로벌 경제는 불확실성 속에서도 점진적 회복세를 보일 것으로 전망되며, 아시아 지역의 성장세가 두드러질 것으로 예상됩니다.',
    summary_long: `2024년 글로벌 경제는 높은 불확실성 속에서도 점진적 회복세를 나타낼 것으로 예상됩니다. 주요 선진국의 통화정책 정상화와 공급망 안정화가 긍정적 요인으로 작용하나, 지정학적 리스크와 금융시장 변동성은 여전히 주의가 필요합니다.

특히 아시아 지역의 성장세가 두드러질 것으로 보이며, 중국의 경제 회복과 인도의 지속적인 성장이 주요 동력으로 작용할 전망입니다. 디지털 전환과 친환경 산업이 새로운 성장 동력으로 부상하고 있으며, 각국 정부의 적극적인 산업 정책이 이를 뒷받침하고 있습니다.

인플레이션은 점진적으로 완화될 것으로 보이나, 에너지 가격과 식량 가격의 변동성은 여전히 주요 리스크 요인입니다. 중앙은행들의 정책 전환 시점과 속도가 향후 경제 성장의 핵심 변수가 될 것입니다.`,
    key_points: [
      '글로벌 GDP 성장률 3.2% 예상',
      '인플레이션 점진적 완화 전망',
      '아시아 경제 성장 지속',
      '디지털·친환경 산업 부상',
      '지정학적 리스크 지속 주의 필요'
    ],
    entities: {
      countries: ['미국', '중국', '인도', '한국'],
      sectors: ['디지털', '친환경', '제조업'],
      keywords: ['인플레이션', 'GDP', '통화정책', '공급망']
    },
    model_version: 'gpt-4-turbo',
    created_at: '2024-01-15T09:30:00Z',
    updated_at: '2024-01-15T09:30:00Z',
  },
  'doc-2': {
    id: 'summary-2',
    document_id: 'doc-2',
    summary_short: 'AI 산업에 대한 글로벌 투자가 급증하며, 생성형 AI를 중심으로 다양한 산업 분야에서 혁신이 가속화되고 있습니다.',
    summary_long: `인공지능 산업은 2024년에도 폭발적 성장을 지속할 것으로 전망됩니다. ChatGPT 등 생성형 AI의 확산으로 다양한 산업 분야에서 AI 도입이 가속화되고 있으며, 글로벌 빅테크 기업들의 투자가 집중되고 있습니다.

특히 AI 반도체 시장은 전년 대비 40% 이상 성장할 것으로 예상되며, 엔비디아, AMD 등 주요 기업들의 경쟁이 치열해지고 있습니다. 한국은 반도체 강국의 이점을 활용하여 AI 칩 개발과 데이터센터 인프라 구축에 주력해야 할 것입니다.

생성형 AI는 콘텐츠 제작, 고객 서비스, 소프트웨어 개발 등 다양한 분야에서 생산성 향상을 이끌고 있으며, 이에 따른 일자리 구조 변화도 예상됩니다. AI 윤리와 규제 마련이 산업 발전과 함께 중요한 과제로 부상하고 있습니다.`,
    key_points: [
      '글로벌 AI 투자 전년 대비 40% 증가',
      '생성형 AI 시장 급성장',
      'AI 반도체 수요 폭증',
      '한국 AI 인프라 투자 확대 필요',
      'AI 윤리 및 규제 마련 시급'
    ],
    entities: {
      companies: ['OpenAI', 'NVIDIA', 'AMD', '삼성전자', 'SK하이닉스'],
      technologies: ['ChatGPT', '생성형 AI', 'AI 반도체', 'LLM'],
      keywords: ['투자', '혁신', '생산성', '규제']
    },
    model_version: 'gpt-4-turbo',
    created_at: '2024-02-20T11:00:00Z',
    updated_at: '2024-02-20T11:00:00Z',
  },
  'doc-3': {
    id: 'summary-3',
    document_id: 'doc-3',
    summary_short: '반도체 시장은 AI 수요 증가와 메모리 반도체 회복으로 2024년 강한 성장세를 보일 것으로 전망됩니다.',
    summary_long: `2024년 글로벌 반도체 시장은 전년 대비 15% 이상 성장할 것으로 예상됩니다. AI 칩 수요 급증과 메모리 반도체 시장의 회복이 주요 성장 동력입니다. 특히 HBM(고대역폭 메모리) 시장은 AI 서버 수요 증가로 공급 부족 현상이 지속될 전망입니다.`,
    key_points: [
      '반도체 시장 15% 성장 예상',
      'HBM 공급 부족 지속',
      'AI 칩 수요 급증',
      '메모리 반도체 회복세'
    ],
    model_version: 'gpt-4-turbo',
    created_at: '2024-03-10T14:30:00Z',
    updated_at: '2024-03-10T14:30:00Z',
  },
}

// ===================================
// Mock Conversations (채팅 이력)
// ===================================

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    user_id: 'user-1',
    title: '글로벌 경제 전망 질문',
    session_type: 'report_based',
    primary_document_id: 'doc-1',
    is_active: true,
    created_at: '2024-04-01T10:00:00Z',
    updated_at: '2024-04-01T10:35:00Z',
  },
  {
    id: 'conv-2',
    user_id: 'user-1',
    title: 'AI 투자 전략 문의',
    session_type: 'general',
    is_active: true,
    created_at: '2024-04-02T14:00:00Z',
    updated_at: '2024-04-02T15:20:00Z',
  },
  {
    id: 'conv-3',
    user_id: 'user-1',
    title: '반도체 산업 분석',
    session_type: 'report_based',
    primary_document_id: 'doc-3',
    is_active: true,
    created_at: '2024-04-05T09:00:00Z',
    updated_at: '2024-04-05T09:45:00Z',
  },
]

// ===================================
// Mock Messages
// ===================================

export const mockMessages: Record<string, Message[]> = {
  'conv-1': [
    {
      id: 'msg-1',
      conversation_id: 'conv-1',
      role: 'user',
      content: '2024년 글로벌 경제 성장률은 어떻게 전망되나요?',
      created_at: '2024-04-01T10:00:00Z',
    },
    {
      id: 'msg-2',
      conversation_id: 'conv-1',
      role: 'assistant',
      content: `보고서에 따르면 2024년 글로벌 GDP 성장률은 **3.2%**로 전망됩니다.

## 주요 포인트

### 지역별 성장률
- **선진국**: 평균 1.8% 성장
- **신흥국**: 평균 4.5% 성장
- **아시아**: 가장 높은 성장세 예상

### 긍정적 요인
- 통화정책 정상화
- 공급망 안정화
- 디지털·친환경 산업 부상

### 주의 사항
- 지정학적 리스크 지속
- 인플레이션 변동성
- 에너지 가격 불확실성`,
      follow_up_questions: [
        '각 지역별 성장률 차이의 원인은 무엇인가요?',
        '인플레이션 전망은 어떻게 되나요?',
        '투자 전략은 어떻게 세워야 하나요?'
      ],
      model_version: 'gpt-4-turbo',
      created_at: '2024-04-01T10:01:30Z',
    },
    {
      id: 'msg-3',
      conversation_id: 'conv-1',
      role: 'user',
      content: '인플레이션 전망은 어떻게 되나요?',
      created_at: '2024-04-01T10:05:00Z',
    },
    {
      id: 'msg-4',
      conversation_id: 'conv-1',
      role: 'assistant',
      content: `인플레이션은 **점진적으로 완화**될 것으로 전망됩니다.

## 전망 요약

### 2024년 예상
- 선진국 인플레이션: 3% 수준으로 하락
- 신흥국 인플레이션: 4-5% 범위 유지

### 완화 요인
1. 중앙은행의 긴축 정책 효과
2. 공급망 정상화
3. 에너지 가격 안정화

### 리스크 요인
⚠️ 에너지 가격 급등 가능성
⚠️ 식량 가격 변동성
⚠️ 임금 상승 압력

보고서는 각국 중앙은행의 정책 전환 시점이 인플레이션 추이의 핵심 변수라고 강조하고 있습니다.`,
      follow_up_questions: [
        '중앙은행의 금리 인하 시점은 언제인가요?',
        '에너지 가격 전망은 어떻게 되나요?',
        '한국의 인플레이션 상황은 어떤가요?'
      ],
      model_version: 'gpt-4-turbo',
      created_at: '2024-04-01T10:06:15Z',
    },
  ],
  'conv-2': [
    {
      id: 'msg-5',
      conversation_id: 'conv-2',
      role: 'user',
      content: 'AI 관련 주식 투자 어떻게 해야 할까요?',
      created_at: '2024-04-02T14:00:00Z',
    },
    {
      id: 'msg-6',
      conversation_id: 'conv-2',
      role: 'assistant',
      content: `AI 투자 전략을 제안드립니다:

## 🎯 투자 섹터별 전략

### 1. 반도체 섹터
- **해외**: NVIDIA, AMD, Intel
- **국내**: 삼성전자, SK하이닉스
- **전망**: AI 칩 수요 급증으로 강한 성장세

### 2. 클라우드 인프라
- Microsoft, Google, Amazon
- AI 서비스 확산에 따른 데이터센터 수요 증가

### 3. AI 소프트웨어
- OpenAI 투자 기업들 (Microsoft 등)
- 생성형 AI 플랫폼 기업

## 💡 투자 원칙

### 분산 투자
여러 섹터에 분산하여 리스크 관리

### 장기 관점
AI 산업은 장기 성장 산업으로 최소 3-5년 투자

### 기술 이해
투자 전 해당 기업의 기술과 경쟁력 분석 필수

⚠️ **주의사항**: AI 버블 가능성을 고려하여 과도한 집중 투자는 지양하세요.`,
      follow_up_questions: [
        '국내 AI 기업 전망은 어떤가요?',
        '단기 투자와 장기 투자 차이는?',
        'AI 버블 가능성은 없나요?'
      ],
      model_version: 'gpt-4-turbo',
      created_at: '2024-04-02T14:02:45Z',
    },
  ],
  'conv-3': [
    {
      id: 'msg-7',
      conversation_id: 'conv-3',
      role: 'user',
      content: 'HBM 시장 전망에 대해 알려주세요',
      created_at: '2024-04-05T09:00:00Z',
    },
    {
      id: 'msg-8',
      conversation_id: 'conv-3',
      role: 'assistant',
      content: `HBM(고대역폭 메모리) 시장은 **폭발적 성장**이 예상됩니다.

## 📈 시장 전망

### 성장 동력
- AI 서버 수요 급증
- GPU 성능 향상 필요
- 데이터센터 확대

### 공급 현황
⚠️ **공급 부족 심화**
- 삼성전자, SK하이닉스 생산 증설 중
- 2024년 하반기까지 타이트한 공급

### 주요 업체
1. **SK하이닉스**: 시장 점유율 1위
2. **삼성전자**: 공격적 투자 진행
3. **마이크론**: 후발주자로 시장 진입

## 💰 투자 기회

HBM 생산 역량을 갖춘 국내 메모리 반도체 기업들의 수혜가 예상되며, 관련 장비 및 소재 기업들도 주목할 만합니다.`,
      follow_up_questions: [
        'HBM3와 HBM4의 차이는 무엇인가요?',
        '국내 기업들의 경쟁력은 어떤가요?',
        '향후 가격 전망은 어떻게 되나요?'
      ],
      model_version: 'gpt-4-turbo',
      created_at: '2024-04-05T09:02:20Z',
    },
  ],
}
