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
    actionHero: "assets/detail/athlete_cutout.png",
    instagram: "", // 선수 인스타그램 프로필 주소 (예: https://www.instagram.com/아이디/)
    isHighlighted: false,
    tag: "CAPTAIN & SHARPSHOOTER",
    summary: "2026 아시안게임 국가대표 핵심 에이스 · 압도적인 3점슛과 코트 비전",
    news: [
      "FINELA 전담 케어 시스템 통해 비시즌 슈팅 성공률 44.2% 달성",
      "글로벌 스포츠 브랜드 글로벌 캠페인 메인 모델 전격 발탁"
    ],
    commercials: [
      { title: "스포츠 브랜드 공식 캠페인", tag: "TV CF", img: "assets/media/cf_sports_brand.jpg", url: "" },
      { title: "예능 프로그램 특별 출연", tag: "BROADCAST", img: "assets/media/cf_variety_show.jpg", url: "" },
      { title: "음료 브랜드 앰버서더 활동", tag: "COMMERCIAL", img: "assets/media/cf_beverage_brand.jpg", url: "" }
    ],
    instagramPosts: [
      { img: "assets/media/insta_training.jpg", likes: "14.2K", caption: "새벽 훈련 완료. 항상 다음 경기를 준비합니다.", url: "" },
      { img: "assets/media/insta_buzzer_beater.jpg", likes: "28.5K", caption: "Buzzer beater moment. 팬 여러분 감사합니다!", url: "" },
      { img: "assets/media/insta_fashion.jpg", likes: "19.8K", caption: "Game day tunnel fit. #FINELA #OOTD", url: "" },
      { img: "assets/media/insta_trophy.jpg", likes: "35.1K", caption: "With my team. 우리는 하나입니다.", url: "" }
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
    actionHero: "assets/detail/athlete_cutout.png",
    instagram: "", // 선수 인스타그램 프로필 주소 (예: https://www.instagram.com/아이디/)
    isHighlighted: false,
    tag: "POINT FORWARD",
    summary: "정규리그 MVP 출신 · 코트 전체를 지배하는 다재다능한 포인트 포워드",
    news: [
      "국가대표팀 최종 엔트리 선발 및 주장단 합류",
      "FINELA 독점 미디어 인터뷰 유튜브 조회수 50만 돌파"
    ],
    commercials: [
      { title: "프리미엄 슈트 브랜드 앰버서더", tag: "TV CF", img: "assets/media/cf_sports_brand.jpg", url: "" },
      { title: "지상파 토크쇼 단독 게스트 출연", tag: "BROADCAST", img: "assets/media/cf_variety_show.jpg", url: "" },
      { title: "스포츠 영양제 공식 모델", tag: "COMMERCIAL", img: "assets/media/cf_beverage_brand.jpg", url: "" }
    ],
    instagramPosts: [
      { img: "assets/media/insta_training.jpg", likes: "12.1K", caption: "Focus on the process. 멈추지 않는다.", url: "" },
      { img: "assets/media/insta_buzzer_beater.jpg", likes: "22.4K", caption: "승리의 순간. 함께 뛰어준 동료들에게 감사.", url: "" },
      { img: "assets/media/insta_fashion.jpg", likes: "18.2K", caption: "Off the court style check.", url: "" },
      { img: "assets/media/insta_trophy.jpg", likes: "31.0K", caption: "Gold medal mission begins now.", url: "" }
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
    actionHero: "assets/detail/athlete_cutout.png",
    instagram: "", // 선수 인스타그램 프로필 주소 (예: https://www.instagram.com/아이디/)
    isHighlighted: false,
    tag: "ELITE PLAYMAKER",
    summary: "강력한 파워와 스텝백 · 승부처에서 폭발하는 클러치 능력자",
    news: [
      "KBL 이달의 선수상 수상 및 올스타 투표 상위권 랭크",
      "FA 대형 계약 체결 완료 협상 성공"
    ],
    commercials: [
      { title: "글로벌 헤드폰 브랜드 캠페인", tag: "TV CF", img: "assets/media/cf_sports_brand.jpg", url: "" },
      { title: "스포츠 다큐멘터리 '코트의 지배자'", tag: "BROADCAST", img: "assets/media/cf_variety_show.jpg", url: "" },
      { title: "에너지 드링크 메인 모델", tag: "COMMERCIAL", img: "assets/media/cf_beverage_brand.jpg", url: "" }
    ],
    instagramPosts: [
      { img: "assets/media/insta_training.jpg", likes: "9.8K", caption: "드리블 디테일 훈련. 매일 조금씩 더 강하게.", url: "" },
      { img: "assets/media/insta_buzzer_beater.jpg", likes: "18.1K", caption: "앤드원! 팬들의 함성이 만든 득점.", url: "" },
      { img: "assets/media/insta_fashion.jpg", likes: "14.5K", caption: "Tunnel walk in all black.", url: "" },
      { img: "assets/media/insta_trophy.jpg", likes: "25.3K", caption: "팀과 함께 최고의 결과를 만들겠습니다.", url: "" }
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
    actionHero: "assets/detail/athlete_cutout.png",
    instagram: "", // 선수 인스타그램 프로필 주소 (예: https://www.instagram.com/아이디/)
    isHighlighted: false,
    tag: "SCORING MACHINE",
    summary: "KBL 최고 수준의 득점력과 어시스트를 겸비한 차세대 백코트 리더",
    news: [
      "단일 경기 40득점 커리어 하이 달성",
      "국가대표팀 주전 포인트가드 낙점"
    ],
    commercials: [
      { title: "농구 전문 용품 글로벌 캠페인", tag: "TV CF", img: "assets/media/cf_sports_brand.jpg", url: "" },
      { title: "스포츠 뉴스 인터뷰 스페셜 코너", tag: "BROADCAST", img: "assets/media/cf_variety_show.jpg", url: "" },
      { title: "이온 음료 공식 파트너십", tag: "COMMERCIAL", img: "assets/media/cf_beverage_brand.jpg", url: "" }
    ],
    instagramPosts: [
      { img: "assets/media/insta_training.jpg", likes: "11.5K", caption: "슈팅 1000개 챌린지 성공.", url: "" },
      { img: "assets/media/insta_buzzer_beater.jpg", likes: "26.0K", caption: "클러치 타임. 믿어주셔서 감사합니다.", url: "" },
      { img: "assets/media/insta_fashion.jpg", likes: "17.3K", caption: "비시즌 화보 촬영 현장 스케치.", url: "" },
      { img: "assets/media/insta_trophy.jpg", likes: "28.9K", caption: "국가대표의 자부심을 가슴에 품고.", url: "" }
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
    actionHero: "assets/detail/athlete_cutout.png",
    instagram: "", // 선수 인스타그램 프로필 주소 (예: https://www.instagram.com/아이디/)
    isHighlighted: false,
    tag: "3PT SPECIALIST",
    summary: "신인 3점슛 성공 역대 1위 기록 보유자 · 빈틈없는 캐치앤슛 슈터",
    news: [
      "리그 3점슛 성공률 43.8%로 리그 선두 질주",
      "FINELA 스킬 트레이닝 캠프 우수 선수 선정"
    ],
    commercials: [
      { title: "아이웨어 스포츠 선글라스 모델", tag: "TV CF", img: "assets/media/cf_sports_brand.jpg", url: "" },
      { title: "청춘 스포츠 예능 프로그램 게스트", tag: "BROADCAST", img: "assets/media/cf_variety_show.jpg", url: "" },
      { title: "기능성 프로틴 브랜드 앰버서더", tag: "COMMERCIAL", img: "assets/media/cf_beverage_brand.jpg", url: "" }
    ],
    instagramPosts: [
      { img: "assets/media/insta_training.jpg", likes: "8.9K", caption: "완벽한 포물선을 만들기 위한 반복 훈련.", url: "" },
      { img: "assets/media/insta_buzzer_beater.jpg", likes: "15.4K", caption: "Back to back 3pt! 응원 감사합니다.", url: "" },
      { img: "assets/media/insta_fashion.jpg", likes: "12.8K", caption: "Street casual look.", url: "" },
      { img: "assets/media/insta_trophy.jpg", likes: "21.0K", caption: "아이치-나고야를 향해 달려갑니다.", url: "" }
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
    actionHero: "assets/detail/athlete_cutout.png",
    instagram: "", // 선수 인스타그램 프로필 주소 (예: https://www.instagram.com/아이디/)
    isHighlighted: false,
    tag: "ALL-ROUND FORWARD",
    summary: "골밑과 외곽을 넘나드는 탄탄한 체격과 다재다능한 연결고리 포워드",
    news: [
      "플레이오프 더블더블 연속 5경기 달성",
      "KBL 올해의 수비 5걸 선정"
    ],
    commercials: [
      { title: "아웃도어 스포츠 웨어 화보", tag: "TV CF", img: "assets/media/cf_sports_brand.jpg", url: "" },
      { title: "농구 유망주 육성 프로그램 멘토 출연", tag: "BROADCAST", img: "assets/media/cf_variety_show.jpg", url: "" },
      { title: "헬스케어 마사지기 공식 모델", tag: "COMMERCIAL", img: "assets/media/cf_beverage_brand.jpg", url: "" }
    ],
    instagramPosts: [
      { img: "assets/media/insta_training.jpg", likes: "10.2K", caption: "웨이트 트레이닝 세션 완료. 몸 상태 최상.", url: "" },
      { img: "assets/media/insta_buzzer_beater.jpg", likes: "17.9K", caption: "코트 위의 허슬 플레이는 언제나 내 몫.", url: "" },
      { img: "assets/media/insta_fashion.jpg", likes: "13.6K", caption: "편안한 일상 속 휴식 시간.", url: "" },
      { img: "assets/media/insta_trophy.jpg", likes: "24.5K", caption: "대표팀 유니폼의 무게를 잊지 않겠습니다.", url: "" }
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
    actionHero: "assets/detail/athlete_cutout.png",
    instagram: "", // 선수 인스타그램 프로필 주소 (예: https://www.instagram.com/아이디/)
    isHighlighted: false,
    tag: "TALL GUARD",
    summary: "196cm 장신 가드의 강력한 트랜지션 공격과 코트 비전",
    news: [
      "국가대표 아시안컵 활약상 아시아농구연맹 집중 조명",
      "시즌 최다 리바운드 가드 부문 1위 등극"
    ],
    commercials: [
      { title: "스마트 러닝화 글로벌 앰버서더", tag: "TV CF", img: "assets/media/cf_sports_brand.jpg", url: "" },
      { title: "스포츠 라디오 스타 초대석", tag: "BROADCAST", img: "assets/media/cf_variety_show.jpg", url: "" },
      { title: "프리미엄 미네랄 워터 CF", tag: "COMMERCIAL", img: "assets/media/cf_beverage_brand.jpg", url: "" }
    ],
    instagramPosts: [
      { img: "assets/media/insta_training.jpg", likes: "11.1K", caption: "속공 마무리 훈련. 스피드와 정확도.", url: "" },
      { img: "assets/media/insta_buzzer_beater.jpg", likes: "20.3K", caption: "원맨 패스트브레이크 덩크!", url: "" },
      { img: "assets/media/insta_fashion.jpg", likes: "16.4K", caption: "Styling with my favorite kicks.", url: "" },
      { img: "assets/media/insta_trophy.jpg", likes: "27.2K", caption: "아시안게임 메달을 향해 원팀으로!", url: "" }
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
    actionHero: "assets/detail/athlete_cutout.png",
    instagram: "", // 선수 인스타그램 프로필 주소 (예: https://www.instagram.com/아이디/)
    isHighlighted: false,
    tag: "HIGH FLYER",
    summary: "폭발적인 운동능력과 인유어페이스 덩크 · 대한민국 최고의 탄력 포워드",
    news: [
      "NCAA 무대에서 인상적인 두 자릿수 득점 활약",
      "미국 현지 스킬 트레이너 극찬 및 NBA 서머리그 루머"
    ],
    commercials: [
      { title: "글로벌 덩크 콘테스트 메인 비주얼", tag: "TV CF", img: "assets/media/cf_sports_brand.jpg", url: "" },
      { title: "해외 스포츠 채널 특집 다큐 방영", tag: "BROADCAST", img: "assets/media/cf_variety_show.jpg", url: "" },
      { title: "피트니스 리커버리 장비 전속 모델", tag: "COMMERCIAL", img: "assets/media/cf_beverage_brand.jpg", url: "" }
    ],
    instagramPosts: [
      { img: "assets/media/insta_training.jpg", likes: "18.5K", caption: "Vertical jump training day. 더 높이.", url: "" },
      { img: "assets/media/insta_buzzer_beater.jpg", likes: "42.0K", caption: "Windmill dunk in transition!", url: "" },
      { img: "assets/media/insta_fashion.jpg", likes: "25.1K", caption: "Seattle vibe. #FINELA", url: "" },
      { img: "assets/media/insta_trophy.jpg", likes: "48.9K", caption: "태극마크를 달고 최고의 퍼포먼스를 약속합니다.", url: "" }
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
    actionHero: "assets/detail/athlete_cutout.png",
    instagram: "", // 선수 인스타그램 프로필 주소 (예: https://www.instagram.com/아이디/)
    isHighlighted: false,
    tag: "RISING STAR",
    summary: "대담한 승부사 기질과 전광석화 같은 스틸 · 차세대 대한민국 넘버원 가드",
    news: [
      "대학리그 챔피언결정전 MVP 및 득점/어시스트 더블 타이틀",
      "FINELA 루키 매니지먼트 계약 체결"
    ],
    commercials: [
      { title: "영 제너레이션 스트릿웨어 캠페인", tag: "TV CF", img: "assets/media/cf_sports_brand.jpg", url: "" },
      { title: "대학 스포츠 스타 특집 토크쇼 출연", tag: "BROADCAST", img: "assets/media/cf_variety_show.jpg", url: "" },
      { title: "에너지 젤 영양 보충제 모델", tag: "COMMERCIAL", img: "assets/media/cf_beverage_brand.jpg", url: "" }
    ],
    instagramPosts: [
      { img: "assets/media/insta_training.jpg", likes: "9.2K", caption: "선배들과 함께하는 훈련, 배울 점이 너무 많습니다.", url: "" },
      { img: "assets/media/insta_buzzer_beater.jpg", likes: "16.8K", caption: "게임 위닝 레이업. 끝까지 포기하지 않았습니다.", url: "" },
      { img: "assets/media/insta_fashion.jpg", likes: "11.4K", caption: "Weekend campus look.", url: "" },
      { img: "assets/media/insta_trophy.jpg", likes: "23.0K", caption: "더 높은 무대를 향해 멈추지 않고 전진합니다.", url: "" }
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
    actionHero: "assets/detail/athlete_cutout.png",
    instagram: "", // 선수 인스타그램 프로필 주소 (예: https://www.instagram.com/아이디/)
    isHighlighted: false,
    tag: "PAINT TOWER",
    summary: "풍부한 국제대회 경험과 탄탄한 스크린 · 골밑을 지키는 든든한 빅맨",
    news: [
      "KBL 통산 500블록 돌파 기념식 거행",
      "대표팀 골밑 안정화의 핵심 베테랑으로 활약"
    ],
    commercials: [
      { title: "프리미엄 남성 헬스케어 브랜드", tag: "TV CF", img: "assets/media/cf_sports_brand.jpg", url: "" },
      { title: "베테랑 스포츠 스타 인터뷰 다큐", tag: "BROADCAST", img: "assets/media/cf_variety_show.jpg", url: "" },
      { title: "관절 케어 건강기능식품 모델", tag: "COMMERCIAL", img: "assets/media/cf_beverage_brand.jpg", url: "" }
    ],
    instagramPosts: [
      { img: "assets/media/insta_training.jpg", likes: "7.8K", caption: "베테랑의 무게감. 후배들을 이끌고 솔선수범.", url: "" },
      { img: "assets/media/insta_buzzer_beater.jpg", likes: "13.2K", caption: "골밑 블록슛으로 지켜낸 승리.", url: "" },
      { img: "assets/media/insta_fashion.jpg", likes: "9.5K", caption: "Family time.", url: "" },
      { img: "assets/media/insta_trophy.jpg", likes: "19.8K", caption: "마지막 아시안게임이라는 마음가짐으로.", url: "" }
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
    actionHero: "assets/detail/athlete_cutout.png",
    instagram: "", // 선수 인스타그램 프로필 주소 (예: https://www.instagram.com/아이디/)
    isHighlighted: false,
    tag: "DUGUMBO / ANCHOR",
    summary: "두목호랑이의 헌신적인 수비와 미드레인지 점퍼 · 팀의 정신적 지주",
    news: [
      "국가대표팀 아시안게임 은메달 주역 및 핵심 앵커",
      "팬들이 뽑은 가장 투지 넘치는 선수 1위"
    ],
    commercials: [
      { title: "스포츠 테이핑 & 보호대 공식 모델", tag: "TV CF", img: "assets/media/cf_sports_brand.jpg", url: "" },
      { title: "스포츠 명사 특강 강연 프로그램 출연", tag: "BROADCAST", img: "assets/media/cf_variety_show.jpg", url: "" },
      { title: "정통 스포츠 타월 브랜드 캠페인", tag: "COMMERCIAL", img: "assets/media/cf_beverage_brand.jpg", url: "" }
    ],
    instagramPosts: [
      { img: "assets/media/insta_training.jpg", likes: "12.3K", caption: "땀은 배신하지 않는다. 오늘도 묵묵하게.", url: "" },
      { img: "assets/media/insta_buzzer_beater.jpg", likes: "24.1K", caption: "리바운드 하나가 승부를 바꿉니다.", url: "" },
      { img: "assets/media/insta_fashion.jpg", likes: "15.0K", caption: "Post-game chill.", url: "" },
      { img: "assets/media/insta_trophy.jpg", likes: "32.4K", caption: "우리의 목표는 오직 금메달 하나뿐입니다.", url: "" }
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
    actionHero: "assets/detail/athlete_cutout.png",
    instagram: "", // 선수 인스타그램 프로필 주소 (예: https://www.instagram.com/아이디/)
    isHighlighted: false,
    tag: "POWER ATHELETE",
    summary: "경이로운 윙스팬과 체공력 · 공수 양면에서 판도를 바꾸는 슈퍼 유망주",
    news: [
      "고교/대학 무대 압도적 활약에 KBL 스카우터 총출동",
      "FINELA 글로벌 유망주 육성 프로그램 1기 장학생"
    ],
    commercials: [
      { title: "글로벌 스포츠 슈즈 넥스트 제너레이션", tag: "TV CF", img: "assets/media/cf_sports_brand.jpg", url: "" },
      { title: "스포츠 루키 다큐멘터리 '더 넥스트'", tag: "BROADCAST", img: "assets/media/cf_variety_show.jpg", url: "" },
      { title: "에너지 바 & 뉴트리션 메인 스폰서십", tag: "COMMERCIAL", img: "assets/media/cf_beverage_brand.jpg", url: "" }
    ],
    instagramPosts: [
      { img: "assets/media/insta_training.jpg", likes: "15.2K", caption: "Grinding every single day. No shortcuts.", url: "" },
      { img: "assets/media/insta_buzzer_beater.jpg", likes: "33.7K", caption: "Posterize dunk! Loving the energy.", url: "" },
      { img: "assets/media/insta_fashion.jpg", likes: "20.1K", caption: "Seoul street culture. 🔥", url: "" },
      { img: "assets/media/insta_trophy.jpg", likes: "38.5K", caption: "Ready to represent with everything I got.", url: "" }
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
    category: "lifestyle"
  },
  {
    id: 2,
    title: "#1 이현중 Replica Jersey",
    titleKo: "2026 아시안게임 #1 이현중 공식 레플리카 져지 (홈)",
    price: 89000,
    priceStr: "89,000",
    description: "국가대표 이현중 선수의 2026 아이치-나고야 아시안게임 공식 레플리카 져지입니다. 실제 선수들이 착용하는 유니폼과 동일한 흡한속건 기능성 소재가 적용되었으며, 등면에는 등번호 1번과 이름이 마킹되어 있습니다.",
    hasSize: true,
    sizes: ["S", "M", "L", "XL", "2XL"],
    image: "assets/store/product_jersey.jpg",
    tag: "OFFICIAL ROSTER",
    category: "apparel"
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
    category: "lifestyle"
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
    category: "cheer"
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

/* ------------------------------------------------------------------------------
   STORE 링 카테고리 8종 + 카테고리별 상품 (store-ring.js 가 사용)
   - 위 PRODUCTS_DATA 6개(id 1~6) 외 나머지 상품은 "가상 상품"(이름·가격·설명 모두 예시)이며 사진이 아직 없다.
   - 사진 넣는 법: 상품은 image(대표 1장) 또는 images(배열, 갤러리용)에 경로를 적는다.
     카테고리 대표 사진은 STORE_CATEGORIES 각 항목의 photo 에 적는다.
     비어 있으면 화면에 "PHOTO" 빈 사진칸이 표시된다.
   ------------------------------------------------------------------------------ */
(function () {
  // mk(id, 카테고리, 영문명, 국문명, 가격, 태그, 사이즈(없으면 null), 설명)
  const mk = (id, category, title, titleKo, price, tag, sizes, description) => ({
    id, title, titleKo, price,
    priceStr: price.toLocaleString('en-US'),
    description,
    hasSize: !!sizes,
    sizes: sizes || [],
    image: "",
    tag,
    category
  });
  const CL = ["S", "M", "L", "XL"];
  const CL2 = ["S", "M", "L", "XL", "2XL"];
  const SML = ["S", "M", "L"];

  PRODUCTS_DATA.push(
    // ── 한정판: 특정 기록 달성 시 생성되는 굿즈 ──
    mk(7, "limited", "FINELA Gold Keyring", "FINELA 1,400점 한정 골드 키링", 49000, "1,400 PCS", null, "선수가 1,400점을 달성했을 때만 제작되는 골드 키링입니다. 달성 기록과 개별 시리얼 넘버가 뒷면에 각인되며 1,400점 한정으로 생산됩니다."),
    mk(8, "limited", "Triple-Double Edition Ball", "트리플더블 달성 기념 농구공", 99000, "RECORD", null, "트리플더블 달성 경기 날짜와 기록이 각인된 기념 농구공입니다. 전용 케이스와 인증서가 함께 제공됩니다."),
    mk(9, "limited", "Gold Medal Replica", "금메달 획득 기념 메달 레플리카", 59000, "MEDALIST", null, "금메달 획득을 기념해 제작되는 레플리카 메달입니다. 리본과 전용 보관 케이스가 포함됩니다."),
    mk(10, "limited", "Season MVP Jersey", "시즌 MVP 기념 한정 져지", 139000, "MVP", CL2, "시즌 MVP 선정 시에만 제작되는 골드 포인트 져지입니다. 등번호 아래에 MVP 시즌 표기가 들어갑니다."),

    // ── 스포츠 의류 ──
    mk(11, "apparel", "Away Replica Jersey", "선수 유니폼 어웨이 레플리카 (블랙)", 89000, "AWAY", CL2, "블랙 바디에 레드 포인트가 들어간 어웨이 레플리카 져지입니다. 흡한속건 기능성 소재입니다."),
    mk(12, "apparel", "Shooting Shirt", "슈팅복", 69000, "WARM-UP", CL, "경기 전 워밍업에 입는 롱슬리브 슈팅 셔츠입니다. 어깨 움직임이 편한 패턴으로 재단했습니다."),
    mk(13, "apparel", "Training Set", "트레이닝복 세트", 119000, "TEAM WEAR", CL2, "상하의 세트로 구성된 팀 트레이닝복입니다. 측면 라인과 가슴 로고가 포인트입니다."),
    mk(14, "apparel", "Performance Short Sleeve Tee", "기능성 반팔티", 35000, "FUNCTIONAL", CL2, "땀을 빠르게 배출하는 경량 기능성 반팔 티셔츠입니다."),
    mk(15, "apparel", "Performance Shorts", "기능성 반바지", 39000, "FUNCTIONAL", CL2, "무릎 위로 오는 길이의 농구용 기능성 반바지입니다. 허리 밴딩과 양옆 포켓이 있습니다."),
    mk(16, "apparel", "Performance Long Sleeve Tee", "기능성 긴팔티", 42000, "FUNCTIONAL", CL2, "쌀쌀한 날 훈련용으로 좋은 기능성 긴팔 티셔츠입니다. 신축성이 좋아 이너로도 입을 수 있습니다."),
    mk(17, "apparel", "Performance Training Pants", "기능성 츄리닝 바지", 59000, "FUNCTIONAL", CL2, "발목 지퍼가 달린 기능성 트레이닝 바지입니다. 가볍고 신축성이 좋습니다."),
    mk(18, "apparel", "Basketball Crew Socks", "농구 양말 (3켤레)", 19000, "3 PACK", null, "쿠션 밑창을 적용한 농구용 크루 삭스 3켤레 세트입니다."),

    // ── 라이프 스타일 ──
    mk(19, "lifestyle", "FINELA Eco Bag", "FINELA 에코백", 19000, "DAILY", null, "두꺼운 캔버스 원단에 로고를 프린트한 에코백입니다."),
    mk(20, "lifestyle", "FINELA Sweatpants", "FINELA 데일리 바지", 59000, "NEW", CL2, "기모 안감 없이 사계절 입기 좋은 데일리 스웻 팬츠입니다."),
    mk(21, "lifestyle", "FINELA Tumbler", "FINELA 텀블러", 29000, "NEW", null, "보온·보냉이 되는 스테인리스 텀블러(500ml)입니다."),
    mk(22, "lifestyle", "FINELA Crewneck Sweatshirt", "FINELA 맨투맨", 69000, "NEW", CL2, "도톰한 코튼 소재의 크루넥 맨투맨입니다. 가슴에 작은 자수 로고가 들어갑니다."),
    mk(23, "lifestyle", "FINELA Varsity Jacket", "FINELA 자켓", 129000, "OUTER", CL2, "블랙 바디에 레드 라인이 들어간 바시티 스타일 자켓입니다."),
    mk(24, "lifestyle", "FINELA Gym Sack", "FINELA 짐색 가방", 25000, "DAILY", null, "끈으로 여닫는 가벼운 짐색입니다. 농구화와 간단한 짐을 넣기 좋습니다."),
    mk(25, "lifestyle", "FINELA Mug", "FINELA 머그컵", 15000, "NEW", null, "로고가 새겨진 세라믹 머그컵입니다."),
    mk(26, "lifestyle", "FINELA Snapback Cap", "FINELA 캡모자", 39000, "BESTSELLER", null, "플랫 브림 스냅백 캡입니다. 뒷면 스냅으로 사이즈를 조절합니다."),
    mk(27, "lifestyle", "FINELA 2027 Calendar", "FINELA 2027 캘린더", 18000, "SEASON", null, "선수 사진으로 구성한 2027년 탁상 캘린더입니다. 경기 일정이 함께 표시됩니다."),

    // ── 농구 용품 ──
    mk(28, "gear", "FINELA Duffle Bag", "FINELA 더플백", 89000, "TRAVEL", null, "원정 경기 짐을 모두 담을 수 있는 대용량 더플백입니다. 신발 수납 칸이 따로 있습니다."),
    mk(29, "gear", "FINELA Sports Towel", "스포츠 타월", 15000, "ESSENTIAL", null, "땀 흡수가 좋은 속건 스포츠 타월입니다."),
    mk(30, "gear", "FINELA Arm Sleeve", "암슬리브", 17000, "SLEEVE", SML, "팔 근육을 잡아주는 압박 암슬리브입니다. 자외선 차단 기능이 있습니다."),
    mk(31, "gear", "FINELA Leg Sleeve", "레그슬리브", 22000, "SLEEVE", SML, "종아리를 감싸는 압박 레그슬리브입니다. 훈련과 경기 모두 사용할 수 있습니다."),
    mk(32, "gear", "FINELA Knee Support", "무릎 보호대", 29000, "SUPPORT", SML, "무릎 충격을 줄여주는 패드형 무릎 보호대입니다."),
    mk(33, "gear", "FINELA Ankle Support", "발목 보호대", 25000, "SUPPORT", SML, "발목 움직임을 잡아주는 밴딩형 발목 보호대입니다."),
    mk(34, "gear", "FINELA Wrist Support", "손목 아대", 15000, "SUPPORT", null, "손목을 안정적으로 잡아주는 신축성 아대입니다."),

    // ── 응원 용품 ──
    mk(35, "cheer", "Cheering Clapper", "응원 클래퍼", 12000, "GAME DAY", null, "경기장 직관용 막대 풍선 클래퍼 2개 세트입니다."),
    mk(36, "cheer", "Light Stick", "응원봉", 25000, "GAME DAY", null, "FINELA 레드 컬러로 빛나는 응원봉입니다. 건전지가 포함되어 있습니다."),
    mk(37, "cheer", "Cheering Headband", "응원 머리띠", 14000, "GAME DAY", null, "로고가 들어간 응원 머리띠입니다. 길이 조절이 가능합니다."),
    mk(38, "cheer", "Cheering Fan", "응원 부채", 8000, "GAME DAY", null, "선수 사진이 들어간 응원 부채입니다."),
    mk(39, "cheer", "Cheering Flag", "응원 깃발", 22000, "GAME DAY", null, "경기장에서 흔들 수 있는 대형 응원 깃발입니다."),
    mk(40, "cheer", "Cheering Sketchbook", "응원 스케치북", 7000, "GAME DAY", null, "직접 문구를 써서 드는 응원용 스케치북입니다. 마커가 함께 제공됩니다."),
    mk(41, "cheer", "Cheering Picket", "응원 피켓", 9000, "GAME DAY", null, "선수 이름과 등번호가 들어간 응원 피켓입니다."),

    // ── 굿즈 ──
    mk(42, "goods", "FINELA Keyring", "FINELA 키링", 12000, "BASIC", null, "FINELA 로고를 새긴 기본 키링입니다."),
    mk(43, "goods", "Mini Diorama", "미니 디오라마", 39000, "COLLECTION", null, "선수의 명장면을 미니어처로 재현한 탁상용 디오라마입니다."),
    mk(44, "goods", "Can Badge", "캔뱃지", 4000, "COLLECTION", null, "선수별 일러스트가 들어간 캔뱃지입니다."),
    mk(45, "goods", "Phone Grip", "그립톡", 9000, "NEW", null, "로고와 선수 일러스트가 들어간 스마트폰 그립톡입니다."),
    mk(46, "goods", "Sticker Pack", "스티커 팩", 8000, "PACK", null, "방수 소재의 로고·선수 스티커 10종 모음입니다."),
    mk(47, "goods", "Photocard Book", "포토카드북", 25000, "COLLECTION", null, "포토카드를 보관하는 수납 북입니다. 20장을 넣을 수 있습니다."),
    mk(48, "goods", "Metal Pin Badge", "뱃지", 7000, "COLLECTION", null, "금속 소재의 핀 뱃지입니다."),
    mk(49, "goods", "Embroidered Patch", "와펜", 8000, "COLLECTION", null, "옷이나 가방에 붙이는 자수 와펜입니다."),
    mk(50, "goods", "Last Season Photobook", "지난시즌 사진첩", 45000, "PHOTOBOOK", null, "지난 시즌 경기와 훈련 사진을 담은 하드커버 사진첩입니다."),

    // ── 마스코트 ──
    mk(51, "mascot", "Mascot Plush", "마스코트 봉제인형", 29000, "MASCOT", null, "FINELA 마스코트를 부드러운 봉제인형으로 만들었습니다. 높이 약 25cm입니다."),
    mk(52, "mascot", "Mascot Keyring", "마스코트 키링", 12000, "MASCOT", null, "마스코트 모양의 아크릴 키링입니다."),
    mk(53, "mascot", "Mascot Sticker", "마스코트 스티커", 6000, "MASCOT", null, "마스코트 표정 시리즈 스티커 팩입니다."),
    mk(54, "mascot", "Mascot Can Badge", "마스코트 캔뱃지", 4000, "MASCOT", null, "마스코트 일러스트가 들어간 캔뱃지입니다."),
    mk(55, "mascot", "Mascot Pin Badge", "마스코트 뱃지", 7000, "MASCOT", null, "마스코트를 금속으로 만든 핀 뱃지입니다."),
    mk(56, "mascot", "Mascot Patch", "마스코트 와펜", 8000, "MASCOT", null, "마스코트 자수 와펜입니다.")
  );
})();

// STORE 링 카테고리 (8종, 순서대로 링에 배치) — photo: 카테고리 대표 사진 경로(비어 있으면 빈 사진칸)
const STORE_CATEGORIES = [
  { key: "limited",   name: "LIMITED",    nameKo: "한정판",       tagline: "기록을 달성해야 만들어지는 한정 굿즈", desc: "선수가 특정 기록을 달성했을 때만 제작되는 한정 수량 굿즈입니다. 시리얼 넘버가 새겨지며 소진되면 재생산하지 않습니다.", photo: "" },
  { key: "apparel",   name: "SPORTS WEAR", nameKo: "스포츠 의류",  tagline: "선수가 입는 그대로",                   desc: "홈·어웨이 유니폼부터 슈팅복, 트레이닝복, 기능성 의류와 양말까지 훈련과 경기에서 입는 라인업입니다.", photo: "" },
  { key: "lifestyle", name: "LIFE STYLE", nameKo: "라이프 스타일", tagline: "일상에서 입고 쓰는 FINELA",            desc: "에코백, 티셔츠, 후드, 텀블러, 머그컵, 캘린더까지 평소에 쓰는 생활 아이템입니다.", photo: "" },
  { key: "gear",      name: "BASKET BALL",  nameKo: "농구 용품",    tagline: "코트 위에서 쓰는 장비",                desc: "농구공, 더플백, 슬리브, 보호대 등 경기와 훈련에서 바로 쓰는 용품입니다.", photo: "" },
  { key: "cheer",     name: "SUPPORTERS", nameKo: "응원 용품",    tagline: "관중석을 채우는 응원 도구",            desc: "클래퍼, 응원봉, 머리띠, 부채, 깃발, 피켓까지 경기장 직관을 위한 응원 용품입니다.", photo: "" },
  { key: "goods",     name: "GOODS",      nameKo: "굿즈",         tagline: "모으고 싶은 FINELA 굿즈",              desc: "키링, 미니 디오라마, 캔뱃지, 포토카드, 와펜, 사진첩 등 팬을 위한 수집 굿즈입니다.", photo: "" },
  { key: "mascot",    name: "MASCOT",     nameKo: "마스코트",     tagline: "FINELA 마스코트와 함께",               desc: "마스코트 봉제인형과 키링, 스티커, 뱃지, 와펜 등 마스코트 캐릭터 상품입니다.", photo: "" },
  { key: "collab",    name: "COLLAB",     nameKo: "콜라보",       tagline: "COMING SOON",                          desc: "다른 브랜드·아티스트와 함께 만드는 콜라보 컬렉션입니다. 준비가 끝나면 공개됩니다.", photo: "", comingSoon: true }
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

// ==============================================================================
// SERVICES 상세 창 데이터 (센터 · 코치 · 숙소 · 식음료)
// ※ 가상 홈페이지용 가상 정보입니다. 인물·경력·수치는 모두 가상이며,
//   사진은 Unsplash 무료 라이선스 사진입니다 (assets/services/CREDITS.md).
// ==============================================================================
const SERVICE_DETAILS = {

  // ---------------------------------------------------------------- 퍼포먼스 센터
  center: {
    eyebrow: "PERFORMANCE TRAINING",
    title: "FINELA 퍼포먼스 센터",
    subtitle: "선수 전용 데이터 기반 트레이닝 센터 · 서울 강남",
    gallery: [
      { img: "assets/services/center/center_1.jpg", caption: "메인 트레이닝 존 — 프리웨이트 & 머신 라인" },
      { img: "assets/services/center/center_2.jpg", caption: "근력 머신 존 — 플레이트 로디드 머신" },
      { img: "assets/services/center/center_3.jpg", caption: "파워 랙 존 — 올림픽 리프팅 플랫폼" },
      { img: "assets/services/center/center_4.jpg", caption: "케이블 & 기능성 트레이닝 존" },
      { img: "assets/services/center/center_5.jpg", caption: "스트렝스 랩 — 파워랙 · 바벨 · 범퍼 플레이트" },
      { img: "assets/services/center/center_6.jpg", caption: "덤벨 존 — 2.5kg~60kg 풀 라인업" },
      { img: "assets/services/center/center_7.jpg", caption: "컨디셔닝 존 — 유산소 & 회복 장비" },
      { img: "assets/services/center/center_8.jpg", caption: "머신 라인 — 하체·후면 사슬 전용 장비" }
    ],
    stats: [
      { value: "1,980㎡", label: "센터 전용 면적" },
      { value: "24H", label: "선수 전용 운영" },
      { value: "120+", label: "트레이닝 장비" },
      { value: "4단계", label: "분석 → 설계 → 적용 → 피드백" }
    ],
    zones: [
      { icon: "fa-solid fa-dumbbell", title: "스트렝스 랩", desc: "파워랙 8대, 올림픽 플랫폼, 포스 플레이트로 근력과 점프 출력을 측정하며 훈련합니다." },
      { icon: "fa-solid fa-person-running", title: "스피드 & 어질리티 트랙", desc: "레이저 타이밍 게이트가 설치된 30m 인조잔디 트랙에서 첫 스텝과 방향 전환을 훈련합니다." },
      { icon: "fa-solid fa-chart-line", title: "모션 분석실", desc: "3D 모션 캡처와 영상 분석으로 슈팅 폼·착지 자세를 수치화해 부상 위험을 사전에 줄입니다." },
      { icon: "fa-solid fa-heart-pulse", title: "리커버리 존", desc: "공압 마사지, 냉온 교대욕, 스트레칭 존을 갖춘 훈련 후 회복 전용 공간입니다." }
    ]
  },

  // ---------------------------------------------------------------- 전담 코치진 (카테고리별)
  // 코치 팝업의 좌우 이동은 같은 카테고리 안에서만 이루어집니다.
  coachGroups: [
    {
      key: "physical",
      role: "피지컬 트레이닝 코치",
      coaches: [
        {
          name: "강태오", nameEn: "TAEO KANG",
          title: "수석 피지컬 코치 (Head of Strength & Conditioning)",
          photo: "assets/services/people/coach_physical.jpg",
          quote: "강한 몸은 부상을 막는 가장 확실한 기술입니다.",
          career: ["前 KBL 프로구단 S&C 코치 (7시즌)", "前 남자농구 국가대표팀 피지컬 트레이너 (2022–2024)", "NSCA-CSCS 공인 스트렝스 & 컨디셔닝 전문가", "체육학 석사 — 운동생리학 전공"],
          programs: ["맞춤형 웨이트 트레이닝", "수직 점프 · 파워 향상", "가동성 · 유연성 루틴", "부상 예방 · 재활 연계", "시즌 중 컨디션 관리"]
        },
        {
          name: "류지환", nameEn: "JIHWAN RYU",
          title: "스트렝스 코치 (Strength Coach)",
          photo: "assets/services/people/coach_physical_2.jpg",
          quote: "기록은 거짓말을 하지 않습니다. 매주 숫자로 성장을 증명합니다.",
          career: ["前 프로배구 구단 스트렝스 코치 (5시즌)", "NSCA-CSCS · USAW 역도 지도자 자격", "포스 플레이트 기반 근력 평가 프로그램 설계"],
          programs: ["최대 근력 · 파워 블록 훈련", "올림픽 리프팅 테크닉", "웨이트 기록 관리 · 피드백", "하체 · 코어 강화"]
        },
        {
          name: "서윤아", nameEn: "YUNA SEO",
          title: "스피드 & 어질리티 코치 (Speed & Agility Coach)",
          photo: "assets/services/people/coach_physical_3.jpg",
          quote: "한 발 먼저 움직이는 선수가 경기를 지배합니다.",
          career: ["前 육상 단거리 국가대표 상비군", "前 대학 농구부 스피드 · 컨디셔닝 코치 (4년)", "레이저 타이밍 기반 스프린트 분석 전문"],
          programs: ["첫 스텝 · 가속 훈련", "방향 전환 · 사이드 스텝", "점프 착지 메커니즘", "코트 컨디셔닝 인터벌"]
        },
        {
          name: "박도현", nameEn: "DOHYUN PARK",
          title: "재활 트레이너 · 물리치료사 (Rehab Trainer, PT)",
          photo: "assets/services/people/coach_physical_4.jpg",
          quote: "복귀가 목표가 아니라, 다치기 전보다 강해지는 것이 목표입니다.",
          career: ["물리치료사 면허 · 스포츠재활 석사", "前 정형외과 스포츠재활센터 수석 트레이너 (6년)", "ACL · 발목 부상 선수 복귀 프로그램 120건+"],
          programs: ["부상 후 단계별 복귀 프로그램", "도수 치료 · 근막 이완", "발목 · 무릎 안정화 훈련", "부상 위험 스크리닝"]
        },
        {
          name: "한지민", nameEn: "JIMIN HAN",
          title: "모빌리티 & 리커버리 코치 (Mobility & Recovery Coach)",
          photo: "assets/services/people/coach_physical_5.jpg",
          quote: "잘 쉬는 것도 훈련입니다. 회복이 다음 경기력을 만듭니다.",
          career: ["필라테스 · 요가 국제 지도자 자격", "前 프로축구 구단 리커버리 코치 (3시즌)", "수면 · 회복 데이터 기반 컨디셔닝 설계"],
          programs: ["가동 범위 · 유연성 루틴", "회복일 리커버리 세션", "호흡 · 코어 컨트롤", "수면 · 컨디션 모니터링"]
        }
      ]
    },
    {
      key: "skill",
      role: "스킬 & 전술 트레이너",
      coaches: [
        {
          name: "마이클 정", nameEn: "MICHAEL JUNG",
          title: "스킬 디벨롭먼트 디렉터 (Skill & Tactics Director)",
          photo: "assets/services/people/coach_skill.jpg",
          quote: "좋은 슛은 반복이 아니라 정확한 반복에서 나옵니다.",
          career: ["前 미국 NCAA Division I 어시스턴트 코치 (5년)", "前 NBA G리그 플레이어 디벨롭먼트 코치", "FIBA 공인 코치 라이선스 Level 3", "국내외 프로 선수 1:1 스킬 트레이닝 400회+"],
          programs: ["슈팅 폼 교정 · 영상 분석", "핸들링 · 드리블 콤보", "포지션별 실전 전술", "픽앤롤 · 오프볼 무브", "상대 팀 스카우팅 리포트"]
        },
        {
          name: "이준호", nameEn: "JUNHO LEE",
          title: "슈팅 코치 (Shooting Coach)",
          photo: "assets/services/people/coach_skill_2.jpg",
          quote: "슛은 손끝이 아니라 발끝에서 시작됩니다.",
          career: ["前 KBL 프로구단 슈팅 코치 (4시즌)", "前 3x3 농구 국가대표 선수", "슈팅 트래킹 장비 기반 폼 분석 전문"],
          programs: ["캐치 앤 슛 · 풀업 점퍼", "자유투 루틴 교정", "3점 슛 릴리스 속도 향상", "슈팅 데이터 리포트"]
        },
        {
          name: "에밀리 카터", nameEn: "EMILY CARTER",
          title: "전술 분석 코치 (Tactical Analyst)",
          photo: "assets/services/people/coach_skill_3.jpg",
          quote: "경기는 코트에 서기 전, 영상 속에서 먼저 이깁니다.",
          career: ["前 WNBA 구단 비디오 코디네이터 (3시즌)", "前 유럽 프로리그 전술 분석관", "시너지 스포츠 데이터 분석 전문가"],
          programs: ["상대 팀 전술 영상 분석", "포지션별 수비 로테이션", "세트 오펜스 이해", "개인 경기 리뷰 미팅"]
        }
      ]
    },
    {
      key: "mental",
      role: "멘탈 퍼포먼스 코치",
      coaches: [
        {
          name: "한도윤", nameEn: "DOYUN HAN, Ph.D.",
          title: "스포츠 심리 전문가 (Mental Performance Coach)",
          photo: "assets/services/people/coach_mental.jpg",
          quote: "압박감은 피하는 것이 아니라 다루는 것입니다.",
          career: ["스포츠심리학 박사", "前 국가대표 선수촌 심리 상담 위원", "한국스포츠심리학회 공인 스포츠심리상담사 1급", "프로·국가대표 선수 상담 1,200회기+"],
          programs: ["경기 전 루틴 · 집중력 훈련", "슬럼프 · 번아웃 회복 상담", "압박 상황 시뮬레이션", "수면 · 스트레스 관리", "커리어 전환 멘토링"]
        },
        {
          name: "정수아", nameEn: "SUA JUNG",
          title: "임상 · 상담 심리사 (Clinical Counselor)",
          photo: "assets/services/people/coach_mental_2.jpg",
          quote: "마음이 편해야 몸이 기억한 대로 움직입니다.",
          career: ["임상심리전문가 · 상담심리 석사", "前 대학병원 스포츠 정신건강 클리닉 상담사", "운동선수 불안 · 수면 장애 상담 600회기+"],
          programs: ["경기 불안 · 긴장 완화", "부상 후 심리 회복 상담", "수면 · 생활 리듬 관리", "가족 · 대인관계 상담"]
        },
        {
          name: "최재원", nameEn: "JAEWON CHOI",
          title: "퍼포먼스 & 커리어 멘토 (Performance & Career Mentor)",
          photo: "assets/services/people/coach_mental_3.jpg",
          quote: "은퇴 이후까지 설계해야 지금의 경기에 온전히 집중할 수 있습니다.",
          career: ["前 프로농구 선수 (11시즌) · 구단 프런트 출신", "코칭 심리 국제 자격 (ICF PCC)", "선수 커리어 전환 멘토링 200명+"],
          programs: ["목표 설정 · 동기 관리", "리더십 · 팀 커뮤니케이션", "미디어 인터뷰 멘탈 트레이닝", "은퇴 후 커리어 설계"]
        }
      ]
    }
  ],

  // ---------------------------------------------------------------- 프라이빗 숙소 (+ 부대시설)
  suite: {
    eyebrow: "PREMIUM ACCOMMODATION",
    title: "프라이빗 하이엔드 숙소",
    subtitle: "1인 1실 · 회복과 수면에 최적화된 선수 전용 레지던스",
    gallery: [
      { img: "assets/services/suite/suite_1.jpg", caption: "디럭스 룸 — 킹 사이즈 회복 전용 매트리스" },
      { img: "assets/services/suite/suite_2.jpg", caption: "스위트 룸 — 조명·온도 자동 수면 모드" },
      { img: "assets/services/suite/suite_3.jpg", caption: "스위트 룸 — 리빙 & 워크 스페이스" },
      { img: "assets/services/suite/suite_4.jpg", caption: "스위트 룸 — 리빙 다이닝 공간" },
      { img: "assets/services/suite/suite_5.jpg", caption: "스탠다드 룸 — 완전 방음 · 암막 설계" },
      { img: "assets/services/suite/suite_6.jpg", caption: "라운지 — 선수 전용 휴식 공간" }
    ],
    stats: [
      { value: "1인 1실", label: "모든 선수 개인 객실" },
      { value: "42㎡", label: "기본 객실 면적" },
      { value: "24H", label: "컨시어지 · 보안" },
      { value: "3분", label: "트레이닝 센터까지 도보" }
    ],
    features: [
      "인체공학 회복 매트리스 · 체형별 맞춤 베개",
      "수면 데이터 연동 스마트 조명 · 온습도 자동 조절",
      "완전 방음 · 암막 설계, 외부인 출입 통제",
      "객실 내 회복 키트 (마사지건 · 폼롤러 · 컴프레션 기어)"
    ],
    amenities: [
      { img: "assets/services/amenity/amenity_pool.jpg", icon: "fa-solid fa-person-swimming", title: "인피니티 풀 & 하이드로 테라피", desc: "관절에 무리를 주지 않는 수중 재활 훈련과 젖산 분해를 돕는 냉온 교대욕 시설을 갖추고 있습니다." },
      { img: "assets/services/amenity/amenity_pool_lounge.jpg", icon: "fa-solid fa-water", title: "아쿠아 리커버리 라운지", desc: "수영장과 연결된 휴식 라운지에서 훈련 후 스트레칭과 회복 세션을 진행합니다." },
      { img: "assets/services/facility_physical.jpg", icon: "fa-solid fa-dumbbell", title: "24h 프라이빗 헬스장", desc: "외부인 출입이 통제된 선수 전용 프리웨이트·유산소 존으로, 원하는 시간에 개인 훈련이 가능합니다." },
      { img: "assets/services/facility_cryo.jpg", icon: "fa-solid fa-child-reaching", title: "리커버리 스튜디오", desc: "요가 · 필라테스 · 모빌리티 클래스로 훈련 후 유연성과 관절 가동 범위를 회복합니다." },
      { img: "assets/services/amenity/amenity_sauna.jpg", icon: "fa-solid fa-snowflake", title: "크라이오테라피 & 건식 사우나", desc: "영하 130도 전신 냉각 장비로 근육 염증을 빠르게 진정시키고, 핀란드식 건식 사우나로 혈액순환과 근육 이완을 돕습니다." },
      { img: "assets/services/amenity/amenity_sauna_2.jpg", icon: "fa-solid fa-spa", title: "스파 & 릴랙스 룸", desc: "아로마 스팀과 명상 존을 갖춘 휴식 공간에서 수면 전 긴장을 풀어줍니다." }
    ]
  },

  // ---------------------------------------------------------------- 맞춤형 식음료 (F&B)
  fnb: {
    eyebrow: "PREMIUM ACCOMMODATION",
    title: "맞춤형 식음료 (F&B) 케어",
    subtitle: "호텔 셰프 × 스포츠 영양사 — 선수별 체성분·훈련량 기반 식단",
    // 사진마다 메뉴 이름 · 영양 성분 (1인분 기준, 가상 수치)
    gallery: [
      { img: "assets/services/fnb/fnb_1.jpg", caption: "치킨 퀴노아 파워 볼", nutrition: { kcal: 640, protein: 48, carbs: 62, fat: 20, sodium: 720 }, tag: "훈련 후 회복식" },
      { img: "assets/services/fnb/fnb_2.jpg", caption: "그릴드 연어 & 퀴노아 플레이트", nutrition: { kcal: 580, protein: 42, carbs: 45, fat: 24, sodium: 540 }, tag: "경기 전날 저녁" },
      { img: "assets/services/fnb/fnb_3.jpg", caption: "수란 & 아보카도 브렉퍼스트", nutrition: { kcal: 520, protein: 28, carbs: 48, fat: 24, sodium: 610 }, tag: "아침 식사" },
      { img: "assets/services/fnb/fnb_4.jpg", caption: "레인보우 그린 샐러드 볼", nutrition: { kcal: 430, protein: 22, carbs: 46, fat: 18, sodium: 480 }, tag: "회복일 점심" },
      { img: "assets/services/fnb/fnb_5.jpg", caption: "하이프로틴 브런치 세트", nutrition: { kcal: 760, protein: 52, carbs: 78, fat: 26, sodium: 830 }, tag: "고강도 훈련일" },
      { img: "assets/services/fnb/fnb_6.jpg", caption: "스테이크 & 고구마 리커버리 플레이트", nutrition: { kcal: 820, protein: 58, carbs: 72, fat: 30, sodium: 760 }, tag: "경기 후 회복식" }
    ],
    principles: [
      "정밀 혈액 검사 · 체성분 기반 1:1 식단 설계",
      "훈련 · 경기 일정에 맞춘 칼로리와 수분 공급",
      "도핑 프리(Doping-Free) 인증 커스텀 보충제",
      "알레르기 · 종교 · 선호를 반영한 개인 메뉴"
    ],
    staff: [
      {
        role: "총괄 셰프",
        name: "오세훈",
        nameEn: "SEHOON OH",
        photo: "assets/services/people/chef.jpg",
        desc: "5성급 호텔 레스토랑 수셰프 출신으로, 고단백·저염 조리법을 바탕으로 맛과 영양을 모두 잡은 선수 전용 메뉴를 개발합니다.",
        career: ["前 5성급 호텔 레스토랑 수셰프 (12년)", "스포츠 다이어트 메뉴 개발 150종+", "조리기능장"]
      },
      {
        role: "스포츠 영양사",
        name: "김하린",
        nameEn: "HARIN KIM",
        photo: "assets/services/people/nutritionist.jpg",
        desc: "선수별 혈액 검사와 체성분 데이터를 분석해 시즌·훈련 단계에 맞는 영양 계획과 보충제 프로그램을 설계합니다.",
        career: ["임상영양사 · 스포츠영양학 석사", "前 국가대표 선수촌 영양 관리 담당", "ISSN 공인 스포츠 영양 전문가"]
      }
    ]
  }
};
