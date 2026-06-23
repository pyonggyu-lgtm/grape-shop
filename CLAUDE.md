# grape-shop

포도 직거래 판매 쇼핑몰

## 프로젝트 정보

- **레벨**: Dynamic
- **목적**: 포도 농장 직거래 온라인 판매 (택배)
- **주요 기능**: 상품 소개, 장바구니, 주문, 토스페이먼츠 결제, 관리자 주문 관리

## 기술 스택

- **프론트엔드**: Next.js 14+ (App Router) + TypeScript + Tailwind CSS
- **상태관리**: Zustand (장바구니), TanStack Query (서버 데이터)
- **백엔드**: bkend.ai (DB + 인증)
- **결제**: 토스페이먼츠
- **배포**: Vercel

## 개발 규칙

- 컴포넌트: `src/components/ui/` (공통), `src/components/features/` (기능별)
- 타입: `src/types/index.ts` 중앙 관리
- API 클라이언트: `src/lib/bkend.ts`
- 상태: `src/stores/` (Zustand)
- 훅: `src/hooks/`

## 환경 변수

`.env.local` 파일에 bkend.ai 프로젝트 ID와 토스페이먼츠 키 설정 필요

## bkit PDCA

현재 단계: **Phase 5 (디자인 시스템) 완료** → Phase 6 (UI 구현 + API 연동) 진행 예정

### 완료된 단계
- Phase 1: 스키마 설계 (`docs/01-plan/`)
- Phase 2: 규칙/구조 정의 (`docs/01-plan/`)
- Phase 3: 목업 구현 (`mockup/`, `docs/02-design/mockup-spec.md`)
- Phase 5: 디자인 시스템 (`src/components/ui/`, `docs/02-design/design-system.md`)

### UI 컴포넌트 (src/components/ui/)
- `Button` — variant: primary / secondary / outline / ghost / destructive
- `Badge`, `OrderStatusBadge` — 주문 상태 뱃지
- `Card`, `CardHeader`, `CardBody`, `CardFooter`
- `Input`, `Textarea` — label, error, hint 지원
- `Select` — options 배열 기반
- `Spinner`, `FullPageSpinner`
- `Dialog` — 모달
- `Drawer` — 사이드 패널 (장바구니용)
- `EmptyState`
