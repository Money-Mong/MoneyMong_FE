# MoneyMong FE (머니몽 프론트엔드)
> 초보 투자자 맞춤 AI 튜터 머니몽 프론트엔드 시스템

**MoneyMong**은 주식 투자에 관심은 많지만 복잡한 정보와 용어로 인해 어려움을 겪는 초보 투자자들을 위한 **AI 기반 금융 리포트 분석 및 대화 플랫폼**입니다. 증권사 애널리스트 리포트를 사용자의 수준에 맞춰 쉽게 설명하고, 체계적인 투자를 돕는 개인화된 튜터링 서비스를 제공합니다.

## 주요 기능

-   **AI 기반 리포트 분석 및 채팅**:
    -   리포트를 선택하면 채팅 화면이 문서 분석 모드로 전환됩니다.
    -   **채팅 패널**: AI 어시스턴트와 리포트 내용에 대해 자유롭게 질의응답할 수 있습니다.
    -   **컨텍스트 패널**: 채팅과 동시에 리포트의 핵심 정보를 확인할 수 있습니다.
        -   **AI 요약**: AI가 생성한 문서의 핵심 주제, 주요 정보, 주요 용어 등을 구조화된 형태로 제공합니다.
        -   **원본 PDF 뷰어**: 원본 리포트(PDF)를 바로 옆에서 확인하며 대화할 수 있습니다.

-   **지능형 리포트 갤러리**:
    -   업로드된 모든 금융 리포트를 한눈에 볼 수 있는 갤러리입니다.
    -   강력한 검색, 정렬(최신순, 제목순), 기간 필터 기능을 제공하여 원하는 문서를 빠르게 찾을 수 있습니다.

-   **Google 소셜 로그인**:
    -   간편하고 안전하게 Google 계정으로 서비스를 이용할 수 있습니다.

-   **반응형 디자인**:
    -   데스크톱에서는 2단 레이아웃(채팅 + 컨텍스트)으로 넓은 화면을 활용하고, 모바일에서는 탭 전환 방식으로 최적화된 사용자 경험을 제공합니다.

## 시스템 아키텍처
![Image](https://github.com/user-attachments/assets/eabd067b-99e2-4760-be74-3f2724529400)

## 기술 스택

-   **Core**: React, TypeScript, Vite
-   **Routing**: TanStack Router
-   **Data Fetching & State**: TanStack Query
-   **Styling**: Tailwind CSS
-   **Chat UI**: `@assistant-ui/react` 및 커스텀 컴포넌트
-   **PDF Viewer**: `react-pdf`
-   **HTTP Client**: `axios`
-   **Linting**: ESLint

## 시작하기

### 1. 프로젝트 클론

```bash
git clone https://github.com/your-repository/MoneyMong_FE.git
cd MoneyMong_FE
```

### 2. 의존성 설치

Node.js와 npm이 설치되어 있는지 확인 후, 다음 명령어를 실행합니다.

```bash
npm install
```

### 3. 환경 변수 설정

`.env.example` 파일을 복사하여 `.env` 파일을 생성하고, 발급받은 API 서버 주소와 Google Client ID를 입력합니다.

```bash
cp .env.example .env
```

```env
# .env 파일 예시
VITE_API_BASE_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

### 4. 개발 서버 실행

```bash
npm run dev
```

이제 브라우저에서 `http://localhost:5173`으로 접속하여 애플리케이션을 확인할 수 있습니다.

## 주요 NPM 스크립트

-   `npm run dev`: Vite 개발 서버를 시작합니다. (HMR 지원)
-   `npm run build`: 프로덕션 배포용으로 프로젝트를 빌드합니다. (`dist` 폴더에 결과물 생성)
-   `npm run lint`: ESLint를 사용하여 코드 포맷 및 잠재적 오류를 검사합니다.
-   `npm run preview`: `build` 명령으로 생성된 결과물을 로컬에서 미리 확인합니다.
