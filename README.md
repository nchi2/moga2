# ChoonMarket

ChoonMarket은 중고 거래를 위한 플랫폼입니다.

## 주요 기능

- 소셜 로그인 (GitHub, Kakao)
- 상품 등록 및 관리
- 실시간 채팅
- 리뷰 시스템

## 기술 스택

- **Frontend**: Next.js 14, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Neon DB)
- **Authentication**: NextAuth.js
- **Real-time**: Supabase Realtime
- **Deployment**: Vercel

## 환경 설정

### 필수 요구사항

- Node.js 18.0.0 이상
- npm 또는 yarn
- PostgreSQL 데이터베이스 (Neon DB 사용)

### 환경 변수 설정

`.env` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# Database
DATABASE_URL="your-neon-db-url"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GITHUB_CALLBACK_URL="http://localhost:3000/github/complete"

# Kakao OAuth
KAKAO_CLIENT_ID="your-kakao-client-id"
KAKAO_CLIENT_SECRET="your-kakao-client-secret"
KAKAO_CALLBACK_URL="http://localhost:3000/kakao/complete"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 설치 및 실행

1. 저장소 클론
```bash
git clone https://github.com/azerckid/choonMarket.git
cd choonMarket
```

2. 의존성 설치
```bash
npm install
# or
yarn install
```

3. 데이터베이스 마이그레이션
```bash
npx prisma generate
npx prisma db push
```

4. 개발 서버 실행
```bash
npm run dev
# or
yarn dev
```

## 라이선스

MIT