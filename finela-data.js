/**
 * ==============================================================================
 * FINELA SPORTS AGENCY - 공식 데이터 및 콘텐츠 설정 파일 (finela-data.js)
 * ==============================================================================
 * 
 * [편집 가이드]
 * 웹사이트의 모든 텍스트, 선수 명단, 스탯, 상품, 서비스 및 파트너사 정보는 
 * 본 파일에서 손쉽게 수정 및 추가할 수 있습니다.
 * HTML이나 CSS 코드를 직접 건드리지 않고도 아래 데이터 객체의 내용만 변경하면
 * 웹사이트 화면에 즉시 반영됩니다.
 * 
 * 1. 선수 추가/수정: PLAYERS_DATA 배열의 항목을 수정하거나 복사하여 추가하세요.
 * 2. 스토어 상품 수정: PRODUCTS_DATA 배열의 가격, 이미지, 설명 등을 변경하세요.
 * 3. 서비스 내용 수정: SERVICES_DATA 객체의 텍스트를 수정하세요.
 * 4. 파트너사 수정: SPONSORS_DATA 배열에 파트너사를 추가/제거하세요.
 * ==============================================================================
 */

// 1. 에이전시 기본 정보 설정
const AGENCY_CONFIG = {
  name: "FINELA SPORTS AGENCY",
  koreanName: "주식회사 피넬라 스포츠 에이전시",
  sloganEn: "PLAY WITH THE MEDALISTS",
  sloganKo: "우리는 선수의 한계를 넘어, 새로운 브랜드 가치를 창출합니다.",
  subCopy: "KBL · 해외 리그 · 국가대표 엘리트 선수를 위한 프리미엄 통합 솔루션",
  address: "서울특별시 강남구 테헤란로 123 FINELA 타워 15층 (우: 06234)",
  phone: "+82 2-1234-5678",
  fax: "+82 2-1234-5679",
  emailGeneral: "contact@finela-agency.com",
  emailPartner: "partner@finela-agency.com",
  ceo: "김정현",
  stats: {
    signedRoster: "28+",
    contractValue: "$18.5M+",
    nationalMedalists: "8★",
    satisfaction: "100%"
  },
  social: {
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
    twitter: "https://x.com",
    linkedin: "https://linkedin.com"
  }
};

// 2. 2026 아이치-나고야 아시안게임 소속 선수단 데이터 (12인)
const PLAYERS_DATA = [
  {
    id: 1,
    number: 1,
    nameEn: "LEE HYUN JUNG",
    nameKo: "이현중",
    category: "forward",
    position: "FORWARD / GUARD",
    positionKo: "포워드 / 가드",
    team: "국가대표 · 일라와라 호크스",
    height: "201CM",
    weight: "95KG",
    age: "24",
    pts: "22.4",
    ast: "8.2",
    reb: "6.8",
    stl: "1.8",
    photo: "assets/players/player_1_photo.jpg",
    cardImg: "assets/players/player_1_card.jpg",
    actionHero: "assets/detail/athlete_hero_action.jpg",
    isHighlighted: false,
    tag: "CAPTAIN & SHARPSHOOTER",
    summary: "2026 아시안게임 국가대표 핵심 에이스 · 압도적인 3점슛과 코트 비전",
    news: [
      "FINELA 전담 케어 시스템 통해 비시즌 슈팅 성공률 44.2% 달성",
      "글로벌 스포츠 브랜드 글로벌 캠페인 메인 모델 전격 발탁"
    ],
    commercials: [
      { title: "스포츠 브랜드 공식 캠페인", tag: "TV CF", img: "assets/media/cf_sports_brand.jpg" },
      { title: "예능 프로그램 특별 출연", tag: "BROADCAST", img: "assets/media/cf_variety_show.jpg" },
      { title: "음료 브랜드 앰버서더 활동", tag: "COMMERCIAL", img: "assets/media/cf_beverage_brand.jpg" }
    ],
    instagramPosts: [
      { img: "assets/media/insta_training.jpg", likes: "14.2K", caption: "새벽 훈련 완료. 항상 다음 경기를 준비합니다." },
      { img: "assets/media/insta_buzzer_beater.jpg", likes: "28.5K", caption: "Buzzer beater moment. 팬 여러분 감사합니다!" },
      { img: "assets/media/insta_fashion.jpg", likes: "19.8K", caption: "Game day tunnel fit. #FINELA #OOTD" },
      { img: "assets/media/insta_trophy.jpg", likes: "35.1K", caption: "With my team. 우리는 하나입니다." }
    ]
  },
  {
    id: 2,
    number: 2,
    nameEn: "CHOI JUN YONG",
    nameKo: "최준용",
    category: "forward",
    position: "FORWARD",
    positionKo: "포워드",
    team: "국가대표 · KBL 올스타",
    height: "200CM",
    weight: "94KG",
    age: "30",
    pts: "18.7",
    ast: "6.5",
    reb: "7.4",
    stl: "1.5",
    photo: "assets/players/player_2_photo.jpg",
    cardImg: "assets/players/player_2_card.jpg",
    actionHero: "assets/detail/athlete_hero_action.jpg",
    isHighlighted: false,
    tag: "POINT FORWARD",
    summary: "정규리그 MVP 출신 · 코트 전체를 지배하는 다재다능한 포인트 포워드",
    news: [
      "국가대표팀 최종 엔트리 선발 및 주장단 합류",
      "FINELA 독점 미디어 인터뷰 유튜브 조회수 50만 돌파"
    ],
    commercials: [
      { title: "프리미엄 슈트 브랜드 앰버서더", tag: "TV CF", img: "assets/media/cf_sports_brand.jpg" },
      { title: "지상파 토크쇼 단독 게스트 출연", tag: "BROADCAST", img: "assets/media/cf_variety_show.jpg" },
      { title: "스포츠 영양제 공식 모델", tag: "COMMERCIAL", img: "assets/media/cf_beverage_brand.jpg" }
    ],
    instagramPosts: [
      { img: "assets/media/insta_training.jpg", likes: "12.1K", caption: "Focus on the process. 멈추지 않는다." },
      { img: "assets/media/insta_buzzer_beater.jpg", likes: "22.4K", caption: "승리의 순간. 함께 뛰어준 동료들에게 감사." },
      { img: "assets/media/insta_fashion.jpg", likes: "18.2K", caption: "Off the court style check." },
      { img: "assets/media/insta_trophy.jpg", likes: "31.0K", caption: "Gold medal mission begins now." }
    ]
  },
  {
    id: 3,
    number: 5,
    nameEn: "BYEON JUN HYEONG",
    nameKo: "변준형",
    category: "guard",
    position: "GUARD",
    positionKo: "가드",
    team: "국가대표 · KBL 올스타",
    height: "188CM",
    weight: "88KG",
    age: "28",
    pts: "16.4",
    ast: "7.8",
    reb: "4.2",
    stl: "2.1",
    photo: "assets/players/player_3_photo.jpg",
    cardImg: "assets/players/player_3_card.jpg",
    actionHero: "assets/detail/athlete_hero_action.jpg",
    isHighlighted: false,
    tag: "ELITE PLAYMAKER",
    summary: "강력한 파워와 스텝백 · 승부처에서 폭발하는 클러치 능력자",
    news: [
      "KBL 이달의 선수상 수상 및 올스타 투표 상위권 랭크",
      "FA 대형 계약 체결 완료 협상 성공"
    ],
    commercials: [
      { title: "글로벌 헤드폰 브랜드 캠페인", tag: "TV CF", img: "assets/media/cf_sports_brand.jpg" },
      { title: "스포츠 다큐멘터리 '코트의 지배자'", tag: "BROADCAST", img: "assets/media/cf_variety_show.jpg" },
      { title: "에너지 드링크 메인 모델", tag: "COMMERCIAL", img: "assets/media/cf_beverage_brand.jpg" }
    ],
    instagramPosts: [
      { img: "assets/media/insta_training.jpg", likes: "9.8K", caption: "드리블 디테일 훈련. 매일 조금씩 더 강하게." },
      { img: "assets/media/insta_buzzer_beater.jpg", likes: "18.1K", caption: "앤드원! 팬들의 함성이 만든 득점." },
      { img: "assets/media/insta_fashion.jpg", likes: "14.5K", caption: "Tunnel walk in all black." },
      { img: "assets/media/insta_trophy.jpg", likes: "25.3K", caption: "팀과 함께 최고의 결과를 만들겠습니다." }
    ]
  },
  {
    id: 4,
    number: 6,
    nameEn: "LEE JUNG HYUN",
    nameKo: "이정현",
    category: "guard",
    position: "GUARD",
    positionKo: "가드",
    team: "국가대표 · KBL 득점왕 후보",
    height: "187CM",
    weight: "84KG",
    age: "25",
    pts: "21.8",
    ast: "6.9",
    reb: "3.9",
    stl: "1.9",
    photo: "assets/players/player_4_photo.jpg",
    cardImg: "assets/players/player_4_card.jpg",
    actionHero: "assets/detail/athlete_hero_action.jpg",
    isHighlighted: false,
    tag: "SCORING MACHINE",
    summary: "KBL 최고 수준의 득점력과 어시스트를 겸비한 차세대 백코트 리더",
    news: [
      "단일 경기 40득점 커리어 하이 달성",
      "국가대표팀 주전 포인트가드 낙점"
    ],
    commercials: [
      { title: "농구 전문 용품 글로벌 캠페인", tag: "TV CF", img: "assets/media/cf_sports_brand.jpg" },
      { title: "스포츠 뉴스 인터뷰 스페셜 코너", tag: "BROADCAST", img: "assets/media/cf_variety_show.jpg" },
      { title: "이온 음료 공식 파트너십", tag: "COMMERCIAL", img: "assets/media/cf_beverage_brand.jpg" }
    ],
    instagramPosts: [
      { img: "assets/media/insta_training.jpg", likes: "11.5K", caption: "슈팅 1000개 챌린지 성공." },
      { img: "assets/media/insta_buzzer_beater.jpg", likes: "26.0K", caption: "클러치 타임. 믿어주셔서 감사합니다." },
      { img: "assets/media/insta_fashion.jpg", likes: "17.3K", caption: "비시즌 화보 촬영 현장 스케치." },
      { img: "assets/media/insta_trophy.jpg", likes: "28.9K", caption: "국가대표의 자부심을 가슴에 품고." }
    ]
  },
  {
    id: 5,
    number: 7,
    nameEn: "YOO KI SANG",
    nameKo: "유기상",
    category: "guard",
    position: "GUARD",
    positionKo: "가드",
    team: "국가대표 · 3점슛 신기록",
    height: "189CM",
    weight: "83KG",
    age: "24",
    pts: "15.9",
    ast: "3.2",
    reb: "4.1",
    stl: "1.4",
    photo: "assets/players/player_5_photo.jpg",
    cardImg: "assets/players/player_5_card.jpg",
    actionHero: "assets/detail/athlete_hero_action.jpg",
    isHighlighted: false,
    tag: "3PT SPECIALIST",
    summary: "신인 3점슛 성공 역대 1위 기록 보유자 · 빈틈없는 캐치앤슛 슈터",
    news: [
      "리그 3점슛 성공률 43.8%로 리그 선두 질주",
      "FINELA 스킬 트레이닝 캠프 우수 선수 선정"
    ],
    commercials: [
      { title: "아이웨어 스포츠 선글라스 모델", tag: "TV CF", img: "assets/media/cf_sports_brand.jpg" },
      { title: "청춘 스포츠 예능 프로그램 게스트", tag: "BROADCAST", img: "assets/media/cf_variety_show.jpg" },
      { title: "기능성 프로틴 브랜드 앰버서더", tag: "COMMERCIAL", img: "assets/media/cf_beverage_brand.jpg" }
    ],
    instagramPosts: [
      { img: "assets/media/insta_training.jpg", likes: "8.9K", caption: "완벽한 포물선을 만들기 위한 반복 훈련." },
      { img: "assets/media/insta_buzzer_beater.jpg", likes: "15.4K", caption: "Back to back 3pt! 응원 감사합니다." },
      { img: "assets/media/insta_fashion.jpg", likes: "12.8K", caption: "Street casual look." },
      { img: "assets/media/insta_trophy.jpg", likes: "21.0K", caption: "아이치-나고야를 향해 달려갑니다." }
    ]
  },
  {
    id: 6,
    number: 8,
    nameEn: "MOON JEONG HYEON",
    nameKo: "문정현",
    category: "forward",
    position: "FORWARD",
    positionKo: "포워드",
    team: "국가대표 · KBL 신인왕",
    height: "194CM",
    weight: "96KG",
    age: "24",
    pts: "14.2",
    ast: "4.8",
    reb: "7.1",
    stl: "1.6",
    photo: "assets/players/player_6_photo.jpg",
    cardImg: "assets/players/player_6_card.jpg",
    actionHero: "assets/detail/athlete_hero_action.jpg",
    isHighlighted: false,
    tag: "ALL-ROUND FORWARD",
    summary: "골밑과 외곽을 넘나드는 탄탄한 체격과 다재다능한 연결고리 포워드",
    news: [
      "플레이오프 더블더블 연속 5경기 달성",
      "KBL 올해의 수비 5걸 선정"
    ],
    commercials: [
      { title: "아웃도어 스포츠 웨어 화보", tag: "TV CF", img: "assets/media/cf_sports_brand.jpg" },
      { title: "농구 유망주 육성 프로그램 멘토 출연", tag: "BROADCAST", img: "assets/media/cf_variety_show.jpg" },
      { title: "헬스케어 마사지기 공식 모델", tag: "COMMERCIAL", img: "assets/media/cf_beverage_brand.jpg" }
    ],
    instagramPosts: [
      { img: "assets/media/insta_training.jpg", likes: "10.2K", caption: "웨이트 트레이닝 세션 완료. 몸 상태 최상." },
      { img: "assets/media/insta_buzzer_beater.jpg", likes: "17.9K", caption: "코트 위의 허슬 플레이는 언제나 내 몫." },
      { img: "assets/media/insta_fashion.jpg", likes: "13.6K", caption: "편안한 일상 속 휴식 시간." },
      { img: "assets/media/insta_trophy.jpg", likes: "24.5K", caption: "대표팀 유니폼의 무게를 잊지 않겠습니다." }
    ]
  },
  {
    id: 7,
    number: 11,
    nameEn: "LEE WOO SUK",
    nameKo: "이우석",
    category: "guard",
    position: "GUARD / FORWARD",
    positionKo: "가드 / 포워드",
    team: "국가대표 · KBL 올스타",
    height: "196CM",
    weight: "91KG",
    age: "26",
    pts: "17.5",
    ast: "5.1",
    reb: "6.3",
    stl: "1.7",
    photo: "assets/players/player_7_photo.jpg",
    cardImg: "assets/players/player_7_card.jpg",
    actionHero: "assets/detail/athlete_hero_action.jpg",
    isHighlighted: false,
    tag: "TALL GUARD",
    summary: "196cm 장신 가드의 강력한 트랜지션 공격과 코트 비전",
    news: [
      "국가대표 아시안컵 활약상 아시아농구연맹 집중 조명",
      "시즌 최다 리바운드 가드 부문 1위 등극"
    ],
    commercials: [
      { title: "스마트 러닝화 글로벌 앰버서더", tag: "TV CF", img: "assets/media/cf_sports_brand.jpg" },
      { title: "스포츠 라디오 스타 초대석", tag: "BROADCAST", img: "assets/media/cf_variety_show.jpg" },
      { title: "프리미엄 미네랄 워터 CF", tag: "COMMERCIAL", img: "assets/media/cf_beverage_brand.jpg" }
    ],
    instagramPosts: [
      { img: "assets/media/insta_training.jpg", likes: "11.1K", caption: "속공 마무리 훈련. 스피드와 정확도." },
      { img: "assets/media/insta_buzzer_beater.jpg", likes: "20.3K", caption: "원맨 패스트브레이크 덩크!" },
      { img: "assets/media/insta_fashion.jpg", likes: "16.4K", caption: "Styling with my favorite kicks." },
      { img: "assets/media/insta_trophy.jpg", likes: "27.2K", caption: "아시안게임 메달을 향해 원팀으로!" }
    ]
  },
  {
    id: 8,
    number: 22,
    nameEn: "YEO JUN SEOK",
    nameKo: "여준석",
    category: "forward",
    position: "FORWARD",
    positionKo: "포워드",
    team: "NCAA 디비전1 · 국가대표",
    height: "203CM",
    weight: "102KG",
    age: "23",
    pts: "23.1",
    ast: "4.2",
    reb: "8.9",
    stl: "1.8",
    photo: "assets/players/player_8_photo.jpg",
    cardImg: "assets/players/player_8_card.jpg",
    actionHero: "assets/detail/athlete_hero_action.jpg",
    isHighlighted: false,
    tag: "HIGH FLYER",
    summary: "폭발적인 운동능력과 인유어페이스 덩크 · 대한민국 최고의 탄력 포워드",
    news: [
      "NCAA 무대에서 인상적인 두 자릿수 득점 활약",
      "미국 현지 스킬 트레이너 극찬 및 NBA 서머리그 루머"
    ],
    commercials: [
      { title: "글로벌 덩크 콘테스트 메인 비주얼", tag: "TV CF", img: "assets/media/cf_sports_brand.jpg" },
      { title: "해외 스포츠 채널 특집 다큐 방영", tag: "BROADCAST", img: "assets/media/cf_variety_show.jpg" },
      { title: "피트니스 리커버리 장비 전속 모델", tag: "COMMERCIAL", img: "assets/media/cf_beverage_brand.jpg" }
    ],
    instagramPosts: [
      { img: "assets/media/insta_training.jpg", likes: "18.5K", caption: "Vertical jump training day. 더 높이." },
      { img: "assets/media/insta_buzzer_beater.jpg", likes: "42.0K", caption: "Windmill dunk in transition!" },
      { img: "assets/media/insta_fashion.jpg", likes: "25.1K", caption: "Seattle vibe. #FINELA" },
      { img: "assets/media/insta_trophy.jpg", likes: "48.9K", caption: "태극마크를 달고 최고의 퍼포먼스를 약속합니다." }
    ]
  },
  {
    id: 9,
    number: 24,
    nameEn: "MOON YU HYEON",
    nameKo: "문유현",
    category: "guard",
    position: "GUARD",
    positionKo: "가드",
    team: "대학농구 MVP · 국가대표 신예",
    height: "182CM",
    weight: "78KG",
    age: "21",
    pts: "19.3",
    ast: "8.5",
    reb: "3.7",
    stl: "2.4",
    photo: "assets/players/player_9_photo.jpg",
    cardImg: "assets/players/player_9_card.jpg",
    actionHero: "assets/detail/athlete_hero_action.jpg",
    isHighlighted: false,
    tag: "RISING STAR",
    summary: "대담한 승부사 기질과 전광석화 같은 스틸 · 차세대 대한민국 넘버원 가드",
    news: [
      "대학리그 챔피언결정전 MVP 및 득점/어시스트 더블 타이틀",
      "FINELA 루키 매니지먼트 계약 체결"
    ],
    commercials: [
      { title: "영 제너레이션 스트릿웨어 캠페인", tag: "TV CF", img: "assets/media/cf_sports_brand.jpg" },
      { title: "대학 스포츠 스타 특집 토크쇼 출연", tag: "BROADCAST", img: "assets/media/cf_variety_show.jpg" },
      { title: "에너지 젤 영양 보충제 모델", tag: "COMMERCIAL", img: "assets/media/cf_beverage_brand.jpg" }
    ],
    instagramPosts: [
      { img: "assets/media/insta_training.jpg", likes: "9.2K", caption: "선배들과 함께하는 훈련, 배울 점이 너무 많습니다." },
      { img: "assets/media/insta_buzzer_beater.jpg", likes: "16.8K", caption: "게임 위닝 레이업. 끝까지 포기하지 않았습니다." },
      { img: "assets/media/insta_fashion.jpg", likes: "11.4K", caption: "Weekend campus look." },
      { img: "assets/media/insta_trophy.jpg", likes: "23.0K", caption: "더 높은 무대를 향해 멈추지 않고 전진합니다." }
    ]
  },
  {
    id: 10,
    number: 31,
    nameEn: "JANG JAE SEOK",
    nameKo: "장재석",
    category: "center",
    position: "CENTER",
    positionKo: "센터",
    team: "국가대표 베테랑 · KBL 골밑 수호신",
    height: "204CM",
    weight: "105KG",
    age: "33",
    pts: "13.8",
    ast: "3.4",
    reb: "8.2",
    stl: "1.2",
    photo: "assets/players/player_10_photo.jpg",
    cardImg: "assets/players/player_10_card.jpg",
    actionHero: "assets/detail/athlete_hero_action.jpg",
    isHighlighted: false,
    tag: "PAINT TOWER",
    summary: "풍부한 국제대회 경험과 탄탄한 스크린 · 골밑을 지키는 든든한 빅맨",
    news: [
      "KBL 통산 500블록 돌파 기념식 거행",
      "대표팀 골밑 안정화의 핵심 베테랑으로 활약"
    ],
    commercials: [
      { title: "프리미엄 남성 헬스케어 브랜드", tag: "TV CF", img: "assets/media/cf_sports_brand.jpg" },
      { title: "베테랑 스포츠 스타 인터뷰 다큐", tag: "BROADCAST", img: "assets/media/cf_variety_show.jpg" },
      { title: "관절 케어 건강기능식품 모델", tag: "COMMERCIAL", img: "assets/media/cf_beverage_brand.jpg" }
    ],
    instagramPosts: [
      { img: "assets/media/insta_training.jpg", likes: "7.8K", caption: "베테랑의 무게감. 후배들을 이끌고 솔선수범." },
      { img: "assets/media/insta_buzzer_beater.jpg", likes: "13.2K", caption: "골밑 블록슛으로 지켜낸 승리." },
      { img: "assets/media/insta_fashion.jpg", likes: "9.5K", caption: "Family time." },
      { img: "assets/media/insta_trophy.jpg", likes: "19.8K", caption: "마지막 아시안게임이라는 마음가짐으로." }
    ]
  },
  {
    id: 11,
    number: 33,
    nameEn: "LEE SEUNG HYUN",
    nameKo: "이승현",
    category: "forward",
    position: "FORWARD / CENTER",
    positionKo: "포워드 / 센터",
    team: "국가대표 · KBL 플레이오프 MVP",
    height: "197CM",
    weight: "104KG",
    age: "32",
    pts: "15.6",
    ast: "4.1",
    reb: "7.8",
    stl: "1.3",
    photo: "assets/players/player_11_photo.jpg",
    cardImg: "assets/players/player_11_card.jpg",
    actionHero: "assets/detail/athlete_hero_action.jpg",
    isHighlighted: false,
    tag: "DUGUMBO / ANCHOR",
    summary: "두목호랑이의 헌신적인 수비와 미드레인지 점퍼 · 팀의 정신적 지주",
    news: [
      "국가대표팀 아시안게임 은메달 주역 및 핵심 앵커",
      "팬들이 뽑은 가장 투지 넘치는 선수 1위"
    ],
    commercials: [
      { title: "스포츠 테이핑 & 보호대 공식 모델", tag: "TV CF", img: "assets/media/cf_sports_brand.jpg" },
      { title: "스포츠 명사 특강 강연 프로그램 출연", tag: "BROADCAST", img: "assets/media/cf_variety_show.jpg" },
      { title: "정통 스포츠 타월 브랜드 캠페인", tag: "COMMERCIAL", img: "assets/media/cf_beverage_brand.jpg" }
    ],
    instagramPosts: [
      { img: "assets/media/insta_training.jpg", likes: "12.3K", caption: "땀은 배신하지 않는다. 오늘도 묵묵하게." },
      { img: "assets/media/insta_buzzer_beater.jpg", likes: "24.1K", caption: "리바운드 하나가 승부를 바꿉니다." },
      { img: "assets/media/insta_fashion.jpg", likes: "15.0K", caption: "Post-game chill." },
      { img: "assets/media/insta_trophy.jpg", likes: "32.4K", caption: "우리의 목표는 오직 금메달 하나뿐입니다." }
    ]
  },
  {
    id: 12,
    number: 36,
    nameEn: "EDDIE DANIEL",
    nameKo: "에디 다니엘",
    category: "forward",
    position: "FORWARD",
    positionKo: "포워드",
    team: "국가대표 특별 귀화 추진 · 압도적 탄력",
    height: "198CM",
    weight: "98KG",
    age: "22",
    pts: "20.5",
    ast: "3.8",
    reb: "9.4",
    stl: "1.7",
    photo: "assets/players/player_12_photo.jpg",
    cardImg: "assets/players/player_12_card.jpg",
    actionHero: "assets/detail/athlete_hero_action.jpg",
    isHighlighted: false,
    tag: "POWER ATHELETE",
    summary: "경이로운 윙스팬과 체공력 · 공수 양면에서 판도를 바꾸는 슈퍼 유망주",
    news: [
      "고교/대학 무대 압도적 활약에 KBL 스카우터 총출동",
      "FINELA 글로벌 유망주 육성 프로그램 1기 장학생"
    ],
    commercials: [
      { title: "글로벌 스포츠 슈즈 넥스트 제너레이션", tag: "TV CF", img: "assets/media/cf_sports_brand.jpg" },
      { title: "스포츠 루키 다큐멘터리 '더 넥스트'", tag: "BROADCAST", img: "assets/media/cf_variety_show.jpg" },
      { title: "에너지 바 & 뉴트리션 메인 스폰서십", tag: "COMMERCIAL", img: "assets/media/cf_beverage_brand.jpg" }
    ],
    instagramPosts: [
      { img: "assets/media/insta_training.jpg", likes: "15.2K", caption: "Grinding every single day. No shortcuts." },
      { img: "assets/media/insta_buzzer_beater.jpg", likes: "33.7K", caption: "Posterize dunk! Loving the energy." },
      { img: "assets/media/insta_fashion.jpg", likes: "20.1K", caption: "Seoul street culture. 🔥" },
      { img: "assets/media/insta_trophy.jpg", likes: "38.5K", caption: "Ready to represent with everything I got." }
    ]
  }
];

// 3. 공식 스토어 (FINELA STORE) 굿즈 상품 데이터
const PRODUCTS_DATA = [
  {
    id: 1,
    title: "FINELA Official Logo T-shirt",
    titleKo: "FINELA 시그니처 로고 티셔츠",
    price: 39000,
    priceStr: "39,000",
    description: "FINELA의 시그니처 로고가 가슴에 새겨진 프리미엄 반팔 티셔츠입니다. 최고급 100% 코튼 소재를 사용하여 부드러운 촉감과 뛰어난 내구성을 자랑하며, 일상과 훈련 중 언제나 편안하게 착용할 수 있습니다.",
    hasSize: true,
    sizes: ["S", "M", "L", "XL"],
    image: "assets/store/product_tshirt.jpg",
    tag: "BESTSELLER",
    category: "apparel"
  },
  {
    id: 2,
    title: "#1 이현중 Replica Jersey",
    titleKo: "2026 아시안게임 #1 이현중 공식 레플리카 져지",
    price: 89000,
    priceStr: "89,000",
    description: "국가대표 이현중 선수의 2026 아이치-나고야 아시안게임 공식 레플리카 져지입니다. 실제 선수들이 착용하는 유니폼과 동일한 흡한속건 기능성 소재가 적용되었으며, 등면에는 등번호 1번과 이름이 마킹되어 있습니다.",
    hasSize: true,
    sizes: ["S", "M", "L", "XL", "2XL"],
    image: "assets/store/product_jersey.jpg",
    tag: "OFFICIAL ROSTER",
    category: "jersey"
  },
  {
    id: 3,
    title: "FINELA Signature Basketball",
    titleKo: "FINELA 시그니처 프리미엄 농구공",
    price: 65000,
    priceStr: "65,000",
    description: "FINELA 에이전시 공식 로고와 슬로건 'PLAY WITH THE MEDALISTS'가 정밀 각인된 프리미엄 실내외 겸용 농구공입니다. 최고급 마이크로파이버 합성 가죽으로 제작되어 뛰어난 그립감을 제공합니다.",
    hasSize: false,
    image: "assets/store/product_basketball.jpg",
    tag: "LIMITED EDITION",
    category: "gear"
  },
  {
    id: 4,
    title: "FINELA Agency Logo Hoodie",
    titleKo: "FINELA 헤비웨이트 시그니처 후디",
    price: 75000,
    priceStr: "75,000",
    description: "편안한 착용감과 도톰한 기모 안감(800g 헤비웨이트 텐타/덤블 워싱)으로 제작된 겨울용 시그니처 후디입니다. 올블랙 바디에 FINELA 레드 컬러의 자수 로고가 포인트로 들어가 있어 스트릿 무드를 완성합니다.",
    hasSize: true,
    sizes: ["M", "L", "XL", "2XL"],
    image: "assets/store/product_hoodie.jpg",
    tag: "HOT ITEM",
    category: "apparel"
  },
  {
    id: 5,
    title: "National Team Cheering Towel",
    titleKo: "국가대표 슬로건 응원 머플러 타월",
    price: 15000,
    priceStr: "15,000",
    description: "소속 선수들을 응원하기 위해 제작된 특별 한정판 슬로건 타월입니다. 강렬한 피넬라 레드 바탕에 고해상도 타이포그래피가 새겨져 있어 경기장 직관 시 완벽한 응원 분위기를 연출합니다.",
    hasSize: false,
    image: "assets/store/product_towel.jpg",
    tag: "FAN ESSENTIAL",
    category: "goods"
  },
  {
    id: 6,
    title: "Premium Player Photo Card Set",
    titleKo: "2026 아시안게임 12인 홀로그램 포토카드 세트",
    price: 25000,
    priceStr: "25,000",
    description: "FINELA 소속 국가대표 12인의 미공개 훈련 사진 및 프로필 컷이 담긴 프리미엄 홀로그램 포토카드 세트(12장 1세트)입니다. 뒷면에는 각 선수의 친필 싸인(인쇄)과 2026 금메달 각오가 적혀 있습니다.",
    hasSize: false,
    image: "assets/store/product_photocards.jpg",
    tag: "COLLECTORS",
    category: "goods"
  }
];

// 4. 공식 파트너사 (OUR PARTNERS & SPONSORS) 데이터
const SPONSORS_DATA = [
  {
    name: "NIKE",
    role: "Official Kit Sponsor",
    roleKo: "공식 유니폼 및 용품 스폰서",
    url: "https://www.nike.com/kr",
    iconClass: "fa-solid fa-check",
    accentColor: "#ffffff",
    glowColor: "rgba(255, 255, 255, 0.4)"
  },
  {
    name: "GATORADE",
    role: "Beverage Partner",
    roleKo: "공식 이온음료 & 뉴트리션 파트너",
    url: "https://gatorade.co.kr/",
    iconClass: "fa-solid fa-bolt",
    accentColor: "#ff5e00",
    glowColor: "rgba(255, 94, 0, 0.5)"
  },
  {
    name: "SAMSUNG",
    role: "Main Sponsor",
    roleKo: "공식 메인 테크놀로지 스폰서",
    url: "https://www.samsung.com/",
    iconClass: "fa-solid fa-mobile-screen-button",
    accentColor: "#1428a0",
    glowColor: "rgba(20, 40, 160, 0.5)"
  },
  {
    name: "SK TELECOM",
    role: "5G & Tech Partner",
    roleKo: "AI 스포츠 데이터 & 5G 파트너",
    url: "https://www.sktelecom.com/",
    iconClass: "fa-solid fa-signal",
    accentColor: "#ed0000",
    glowColor: "rgba(237, 0, 0, 0.5)"
  },
  {
    name: "KB BANK",
    role: "Financial Partner",
    roleKo: "선수 자산관리 & 공식 금융 파트너",
    url: "https://www.kbstar.com/",
    iconClass: "fa-solid fa-building-columns",
    accentColor: "#ffbc00",
    glowColor: "rgba(255, 188, 0, 0.5)"
  },
  {
    name: "KOREAN AIR",
    role: "Official Airline",
    roleKo: "국제대회 & 원정 공식 항공사",
    url: "https://www.koreanair.com/",
    iconClass: "fa-solid fa-plane-up",
    accentColor: "#0080ff",
    glowColor: "rgba(0, 128, 255, 0.5)"
  },
  {
    name: "HYUNDAI",
    role: "Mobility Partner",
    roleKo: "선수 전용 의전 모빌리티 파트너",
    url: "https://www.hyundai.com/",
    iconClass: "fa-solid fa-car",
    accentColor: "#002c6c",
    glowColor: "rgba(0, 44, 108, 0.5)"
  },
  {
    name: "RED BULL",
    role: "Energy Partner",
    roleKo: "공식 에너지 드링크 파트너",
    url: "https://www.redbull.com/",
    iconClass: "fa-solid fa-bullhorn",
    accentColor: "#ff1824",
    glowColor: "rgba(255, 24, 36, 0.5)"
  }
];

// 5. 통합 서비스 (TOTAL SERVICES) 상세 데이터
const SERVICES_DATA = {
  training: {
    title: "최첨단 퍼포먼스 센터",
    subtitle: "데이터 기반의 체계적인 훈련 프로세스",
    desc: "FINELA 전용 훈련 센터는 NBA 및 유럽 명문 구단에서 사용하는 최신 모션 트래킹 시스템과 생체 데이터 분석 장비를 갖추고 있습니다. '정밀 분석 ➔ 맞춤형 프로그램 설계 ➔ 실전 적용 ➔ 피드백'의 4단계 훈련 프로세스를 통해 선수의 약점을 지우고 강점을 극대화합니다.",
    image: "assets/services/facility_hightech.jpg",
    coaches: [
      {
        icon: "fa-solid fa-dumbbell",
        title: "피지컬 트레이닝 코치",
        sub: "근력 강화 및 부상 방지",
        desc: "개인별 신체 데이터(근력, 유연성, 체공 시간 등)를 정밀 분석하여 최적화된 웨이트 트레이닝과 가동성 훈련을 전담합니다."
      },
      {
        icon: "fa-solid fa-basketball",
        title: "스킬 & 전술 트레이너",
        sub: "포지션별 맞춤 실전 기술",
        desc: "슈팅 폼 교정, 드리블 스킬, 포지션별 맞춤 전술 등 코트 위에서 즉시 활용 가능한 디테일한 기술 향상을 1:1 지도합니다."
      },
      {
        icon: "fa-solid fa-brain",
        title: "멘탈 퍼포먼스 코치",
        sub: "심리 상담 및 마인드 컨트롤",
        desc: "큰 경기를 앞둔 중압감 극복, 슬럼프 탈출, 번아웃 방지를 위한 전문적인 스포츠 심리 상담을 정기적으로 진행합니다."
      }
    ]
  },
  accommodation: {
    room: {
      title: "프라이빗 하이엔드 숙소",
      desc: "최상의 수면과 완전한 휴식을 위해 인체공학적으로 설계된 1인 1실 프리미엄 룸을 제공합니다. 최고급 매트리스와 방음 설계로 훈련 외 시간에는 완벽한 사생활과 재충전의 시간을 보장합니다.",
      image: "assets/services/facility_suite.jpg"
    },
    fnb: {
      title: "맞춤형 식음료 (F&B) 케어",
      desc: "전담 호텔 셰프와 스포츠 전문 영양사가 상주하여 선수 개개인의 체질과 경기 일정에 맞춘 프리미엄 식단을 직접 조리합니다.",
      image: "assets/services/facility_fnb.jpg",
      points: [
        "정밀 혈액 검사 및 체성분 기반 맞춤형 식단 설계",
        "훈련/경기 당일 컨디션에 맞춘 칼로리 및 수분 공급",
        "도핑 프리(Doping-Free) 인증 커스텀 보충제 전담 제작"
      ]
    },
    amenities: [
      {
        icon: "fa-solid fa-person-swimming",
        title: "인피니티 풀 & 하이드로 테라피",
        desc: "관절에 무리를 주지 않는 수중 재활 훈련과 빠른 젖산 분해를 돕는 냉온욕 교대 테라피 시설을 완비하고 있습니다.",
        img: "assets/services/facility_pool.jpg"
      },
      {
        icon: "fa-solid fa-dumbbell",
        title: "24h 프라이빗 헬스장",
        desc: "일반인의 출입이 완벽히 통제된 선수 전용 프리웨이트 및 유산소 존입니다. 언제든 원하는 시간에 개인 훈련이 가능합니다.",
        img: "assets/services/facility_physical.jpg"
      },
      {
        icon: "fa-solid fa-snowflake",
        title: "크라이오테라피 & 건식 사우나",
        desc: "영하 130도의 환경에서 극도로 지친 근육의 염증을 3분 만에 치료하는 첨단 장비와 혈액순환을 돕는 사우나를 운영합니다.",
        img: "assets/services/facility_cryo.jpg"
      }
    ]
  },
  management: {
    lifestyle: {
      title: "1:1 라이프스타일 매니저",
      subtitle: "오직 경기에만 집중할 수 있는 완벽한 일상",
      desc: "운동 외적인 모든 행정적, 일상적 번거로움을 매니저가 직접 해결합니다. 선수는 오직 코트 위에서의 퍼포먼스에만 집중하면 됩니다.",
      items: [
        { icon: "fa-solid fa-plane-departure", text: "차량 지원, 항공권 및 원정 숙박 완벽 대행" },
        { icon: "fa-solid fa-camera", text: "광고 화보 촬영 및 미디어 인터뷰 일정 조율" },
        { icon: "fa-solid fa-calculator", text: "파트너 세무사 연계를 통한 종합소득세 및 자산 관리" }
      ]
    },
    legal: {
      title: "스포츠 법률 및 계약 자문단",
      subtitle: "최고의 대우와 철저한 리스크 관리",
      desc: "국제 스포츠 중재 재단(CAS) 규정 및 각 리그 샐러리캡에 정통한 변호인단이 가장 유리한 조건으로 선수의 권리를 입증하고 보호합니다.",
      items: [
        { icon: "fa-solid fa-file-signature", text: "국내외 구단 연봉 협상, FA 이적 및 바이아웃 조율" },
        { icon: "fa-solid fa-copyright", text: "브랜드 스폰서십, 초상권 및 상업 광고 계약 검토" },
        { icon: "fa-solid fa-shield-halved", text: "악성 루머, 명예훼손에 대한 신속한 법적 대응 및 권익 보호" }
      ]
    }
  }
};
