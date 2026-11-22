/* 킹링고 입문 — 러시아어 · 스페인어 · 베트남어
 * 완전 처음 시작하는 사람을 위한 14단원 × 5문장 + 읽기·쓰기(문자·발음 규칙)
 */
(function (global) {
  "use strict";

  var RU_UNITS = [
    {
      id: "ru-01", no: 1, title: "인사", emoji: "👋",
      goal: "러시아어로 처음 만난 사람에게 인사해요",
      items: [
        { id: "ru-01-1", text: "Здравствуйте! Очень приятно.", read: "즈드라스트부이테! 오첸 프리얏나.", ko: "안녕하세요! 만나서 반가워요.", tip: "Здравствуйте의 в는 소리 내지 않아 '즈드라스트부이테'." },
        { id: "ru-01-2", text: "Доброе утро, как дела?", read: "도브라예 우트라, 깍 델라?", ko: "좋은 아침이에요, 어떻게 지내세요?", tip: "Доброе утро는 '도브라예 우트라', 아침 인사예요." },
        { id: "ru-01-3", text: "Хорошо, спасибо.", read: "하라쇼, 스파시바.", ko: "잘 지내요, 고마워요.", tip: "спасибо의 о는 약하게 'ㅏ'로 읽어요." },
        { id: "ru-01-4", text: "До завтра!", read: "다 자프트라!", ko: "내일 봐요!", tip: "До는 '다', завтра는 '자프트라'." },
        { id: "ru-01-5", text: "Хорошего дня!", read: "하로셰바 드냐!", ko: "좋은 하루 보내세요!", tip: "Хорошего의 г는 'ㅂ'처럼 부드럽게 나요." }
      ]
    },
    {
      id: "ru-02", no: 2, title: "자기소개", emoji: "🙋",
      goal: "이름과 나라, 하는 일을 말해요",
      items: [
        { id: "ru-02-1", text: "Меня зовут Сынъу.", read: "미냐 자부트 승우.", ko: "제 이름은 승우예요.", tip: "Меня зовут은 '미냐 자부트', 이름을 말할 때 써요." },
        { id: "ru-02-2", text: "Я из Кореи.", read: "야 이즈 카레이.", ko: "저는 한국에서 왔어요.", tip: "из는 '이즈', ~에서 왔다는 뜻." },
        { id: "ru-02-3", text: "Я работаю в компании.", read: "야 라보타유 프 캄파니이.", ko: "저는 회사에서 일해요.", tip: "работаю는 '라보타유', 일해요." },
        { id: "ru-02-4", text: "Я люблю кофе и музыку.", read: "야 류블류 코페 이 무지쿠.", ko: "저는 커피와 음악을 좋아해요.", tip: "люблю는 '류블류', 매우 좋아한다는 말." },
        { id: "ru-02-5", text: "Приятно познакомиться со всеми.", read: "프리얏나 파즈나코미차 사 프셈미.", ko: "모두 만나서 반가워요.", tip: "познакомиться는 '파즈나코미차', 처음 만날 때 써요." }
      ]
    },
    {
      id: "ru-03", no: 3, title: "카페에서", emoji: "☕",
      goal: "카페에서 주문하고 계산해요",
      items: [
        { id: "ru-03-1", text: "Один айс американо, пожалуйста.", read: "아딘 아이스 아메리카나, 파잘루스타.", ko: "아이스 아메리카노 한 잔 주세요.", tip: "пожалуйста는 '파잘루스타', 부탁할 때 붙여요." },
        { id: "ru-03-2", text: "Сколько это стоит?", read: "스콜카 에타 스토이트?", ko: "이거 얼마예요?", tip: "Сколько는 '스콜카', 얼마라는 뜻." },
        { id: "ru-03-3", text: "Я буду здесь.", read: "야 부두 즈데스.", ko: "여기서 먹을게요.", tip: "здесь는 '즈데스', 여기서." },
        { id: "ru-03-4", text: "Можно чек?", read: "모즈나 첵?", ko: "영수증 주시겠어요?", tip: "Можно는 '모즈나', ~해도 되나요." },
        { id: "ru-03-5", text: "Очень вкусно!", read: "오첸 프쿠스나!", ko: "아주 맛있어요!", tip: "вкусно의 в는 'ㅍ'처럼 발음해 '프쿠스나'." }
      ]
    },
    {
      id: "ru-04", no: 4, title: "식당에서", emoji: "🍜",
      goal: "자리를 잡고 음식을 주문해요",
      items: [
        { id: "ru-04-1", text: "У вас есть столик на двоих?", read: "우 바스 예스티 스톨릭 나 드바이흐?", ko: "두 명 자리 있나요?", tip: "на двоих는 '나 드바이흐', 두 명 몫." },
        { id: "ru-04-2", text: "Можно посмотреть меню?", read: "모즈나 파스마트레티 미뉴?", ko: "메뉴판 좀 볼 수 있을까요?", tip: "посмотреть는 '파스마트레티', 보다." },
        { id: "ru-04-3", text: "Я буду это, пожалуйста.", read: "야 부두 에타, 파잘루스타.", ko: "이걸로 주세요.", tip: "это는 '에타', 이것." },
        { id: "ru-04-4", text: "Не очень остро, пожалуйста.", read: "니 오첸 오스트라, 파잘루스타.", ko: "너무 맵지 않게 해주세요.", tip: "остро는 '오스트라', 맵게." },
        { id: "ru-04-5", text: "Счёт, пожалуйста.", read: "숏, 파잘루스타.", ko: "계산해 주세요.", tip: "Счёт은 '숏', 계산서." }
      ]
    },
    {
      id: "ru-05", no: 5, title: "길 묻기", emoji: "🗺️",
      goal: "길을 묻고 방향을 알아들어요",
      items: [
        { id: "ru-05-1", text: "Извините, где вокзал?", read: "이즈비니테, 그데 박잘?", ko: "실례합니다, 역이 어디예요?", tip: "Извините는 '이즈비니테', 실례합니다." },
        { id: "ru-05-2", text: "Это далеко отсюда?", read: "에타 달리코 앗슈다?", ko: "여기서 먼가요?", tip: "далеко는 '달리코', 멀다." },
        { id: "ru-05-3", text: "Идите прямо и поверните налево.", read: "이디테 프랴마 이 파베르니테 날레바.", ko: "직진해서 왼쪽으로 도세요.", tip: "прямо는 '프랴마', налево는 '날레바'." },
        { id: "ru-05-4", text: "Пять минут пешком.", read: "뱌티 미누트 페슈콤.", ko: "걸어서 5분쯤 걸려요.", tip: "пешком은 '페슈콤', 걸어서." },
        { id: "ru-05-5", text: "Спасибо за помощь.", read: "스파시바 자 포마슈.", ko: "도와주셔서 고마워요.", tip: "помощь는 '포마슈', 도움." }
      ]
    },
    {
      id: "ru-06", no: 6, title: "쇼핑", emoji: "🛍️",
      goal: "가격과 사이즈를 물어보고 계산해요",
      items: [
        { id: "ru-06-1", text: "Сколько стоит эта рубашка?", read: "스콜카 스토이트 에타 루바슈카?", ko: "이 셔츠 얼마예요?", tip: "рубашка는 '루바슈카', 셔츠." },
        { id: "ru-06-2", text: "Есть размер больше?", read: "예스티 라즈메르 볼셰?", ko: "더 큰 사이즈 있나요?", tip: "размер는 '라즈메르', 사이즈." },
        { id: "ru-06-3", text: "Можно примерить?", read: "모즈나 프리메리티?", ko: "입어봐도 될까요?", tip: "примерить는 '프리메리티', 입어 보다." },
        { id: "ru-06-4", text: "Я возьму это.", read: "야 바즈무 에타.", ko: "이걸로 할게요.", tip: "возьму는 '바즈무', 살게요." },
        { id: "ru-06-5", text: "Можно оплатить картой?", read: "모즈나 아플라티티 카르타이?", ko: "카드로 계산할 수 있나요?", tip: "картой는 '카르타이', 카드로." }
      ]
    },
    {
      id: "ru-07", no: 7, title: "하루 일과", emoji: "⏰",
      goal: "내 하루를 순서대로 말해요",
      items: [
        { id: "ru-07-1", text: "Я встаю в семь.", read: "야 프스타유 프 셈.", ko: "저는 7시에 일어나요.", tip: "встаю는 '프스타유', 일어나다." },
        { id: "ru-07-2", text: "Я езжу на работу на метро.", read: "야 예즈후 나 라보투 나 메트라.", ko: "지하철로 출근해요.", tip: "на метро는 '나 메트라', 지하철로." },
        { id: "ru-07-3", text: "Я обедаю в полдень.", read: "야 아베다유 프 폴딘.", ko: "정오에 점심을 먹어요.", tip: "полдень는 '폴딘', 정오." },
        { id: "ru-07-4", text: "Я прихожу домой около шести.", read: "야 프리하주 다모이 오칼라 셰스티.", ko: "6시쯤 집에 와요.", tip: "около는 '오칼라', ~쯤." },
        { id: "ru-07-5", text: "Я ложусь спать до одиннадцати.", read: "야 라주스 스파티 다 아딘낫차티.", ko: "11시 전에 자요.", tip: "ложусь спать는 '라주스 스파티', 자다." }
      ]
    },
    {
      id: "ru-08", no: 8, title: "날씨", emoji: "🌤️",
      goal: "오늘과 내일 날씨를 이야기해요",
      items: [
        { id: "ru-08-1", text: "Сегодня солнечно.", read: "시보드냐 솔네치나.", ko: "오늘은 맑아요.", tip: "солнечно는 '솔네치나', 맑음." },
        { id: "ru-08-2", text: "Завтра будет дождь.", read: "자프트라 부데트 도슈티.", ko: "내일은 비가 올 거예요.", tip: "дождь는 '도슈티', 비." },
        { id: "ru-08-3", text: "На улице очень холодно.", read: "나 울리체 오첸 홀라드나.", ko: "밖이 아주 추워요.", tip: "холодно는 '홀라드나', 춥다." },
        { id: "ru-08-4", text: "Возьмите зонт.", read: "바즈미테 존트.", ko: "우산 챙기세요.", tip: "зонт는 '존트', 우산." },
        { id: "ru-08-5", text: "Сегодня воздух очень чистый.", read: "시보드냐 보즈두흐 오첸 치스티이.", ko: "오늘 공기가 정말 깨끗해요.", tip: "воздух는 '보즈두흐', 공기." }
      ]
    },
    {
      id: "ru-09", no: 9, title: "취미", emoji: "🎸",
      goal: "좋아하는 것과 주말 계획을 말해요",
      items: [
        { id: "ru-09-1", text: "Я люблю слушать музыку.", read: "야 류블류 슬루샤티 무지쿠.", ko: "저는 음악 듣는 걸 좋아해요.", tip: "слушать는 '슬루샤티', 듣다." },
        { id: "ru-09-2", text: "По выходным я играю на гитаре.", read: "파 비하드님 야 이그라유 나 기타레.", ko: "주말에는 기타를 쳐요.", tip: "по выходным은 '파 비하드님', 주말마다." },
        { id: "ru-09-3", text: "Вы любите спорт?", read: "븨 류비테 스포트?", ko: "운동 좋아하세요?", tip: "Вы는 '븨', 손윗사람에게 쓰는 너." },
        { id: "ru-09-4", text: "Обычно я гуляю в парке.", read: "아븨치나 야 굴랴유 프 파르케.", ko: "보통 공원에서 산책해요.", tip: "гуляю는 '굴랴유', 산책하다." },
        { id: "ru-09-5", text: "Здорово!", read: "즈다로바!", ko: "멋지네요!", tip: "Здорово는 '즈다로바', 멋지다." }
      ]
    },
    {
      id: "ru-10", no: 10, title: "전화와 약속", emoji: "📞",
      goal: "전화로 약속을 잡고 미뤄요",
      items: [
        { id: "ru-10-1", text: "Алло, это Сынъу.", read: "알로, 에타 승우.", ko: "여보세요, 승우입니다.", tip: "전화에서는 Алло로 시작해요." },
        { id: "ru-10-2", text: "У вас есть время сегодня вечером?", read: "우 바스 예스티 브레먀 시보드냐 베체람?", ko: "오늘 저녁 시간 있어요?", tip: "вечером은 '베체람', 저녁에." },
        { id: "ru-10-3", text: "Давайте встретимся в шесть.", read: "다바이테 프스트레팀샤 프 셰스티.", ko: "6시에 만나요.", tip: "встретимся는 '프스트레팀샤', 만나다." },
        { id: "ru-10-4", text: "Я немного опоздаю.", read: "야 니모가 아파즈다유.", ko: "조금 늦을 것 같아요.", tip: "опоздаю는 '아파즈다유', 늦을 거예요." },
        { id: "ru-10-5", text: "Вы можете перезвонить мне?", read: "븨 모제테 페리즈바니티 므녜?", ko: "다시 전화해 주시겠어요?", tip: "перезвонить는 '페리즈바니티', 다시 전화하다." }
      ]
    },
    {
      id: "ru-11", no: 11, title: "감정과 상태", emoji: "😊",
      goal: "내 기분과 상태를 말해요",
      items: [
        { id: "ru-11-1", text: "Сегодня я очень счастлив.", read: "시보드냐 야 오첸 스차슬리프.", ko: "오늘 정말 행복해요.", tip: "счастлив는 '스차슬리프', 행복한." },
        { id: "ru-11-2", text: "Я немного устал.", read: "야 니모가 우스탈.", ko: "조금 피곤해요.", tip: "устал는 '우스탈', 피곤한." },
        { id: "ru-11-3", text: "Не волнуйтесь.", read: "니 발누이테스.", ko: "걱정하지 마세요.", tip: "волнуйтесь는 '발누이테스', 걱정하다." },
        { id: "ru-11-4", text: "Я так рад!", read: "야 탁 라트!", ko: "너무 신나요!", tip: "рад는 '라트', 기쁜." },
        { id: "ru-11-5", text: "Мне от этого хорошо.", read: "므녜 앗 에타바 하라쇼.", ko: "그건 기분이 좋아져요.", tip: "от этого는 '앗 에타바', 그것 때문에." }
      ]
    },
    {
      id: "ru-12", no: 12, title: "가족과 친구", emoji: "👨‍👩‍👧",
      goal: "가족과 친구를 소개해요",
      items: [
        { id: "ru-12-1", text: "Это фотография моей семьи.", read: "에타 파타그라피야 마예이 심이.", ko: "이건 우리 가족 사진이에요.", tip: "семьи는 '심이', 가족의." },
        { id: "ru-12-2", text: "У меня есть старшая сестра.", read: "우 미냐 예스티 스타르샤야 시스트라.", ko: "저는 누나가 한 명 있어요.", tip: "старшая сестра는 '스타르샤야 시스트라', 누나." },
        { id: "ru-12-3", text: "Мои родители живут в Пусане.", read: "마이 라디텔리 지부트 프 푸사네.", ko: "부모님은 부산에 사세요.", tip: "родители는 '라디텔리', 부모님." },
        { id: "ru-12-4", text: "Мы встречаемся каждое воскресенье.", read: "믜 프스트레차임샤 카즈다예 바스크레센예.", ko: "우리는 매주 일요일에 만나요.", tip: "воскресенье는 '바스크레센예', 일요일." },
        { id: "ru-12-5", text: "Мой друг очень добрый.", read: "모이 드루크 오첸 도브리이.", ko: "제 친구는 아주 친절해요.", tip: "добрый는 '도브리이', 친절한." }
      ]
    },
    {
      id: "ru-13", no: 13, title: "여행", emoji: "✈️",
      goal: "공항과 호텔에서 필요한 말을 해요",
      items: [
        { id: "ru-13-1", text: "Где автобус до аэропорта?", read: "그데 아프토부스 다 아이라포르타?", ko: "공항 버스는 어디예요?", tip: "аэропорта는 '아이라포르타', 공항의." },
        { id: "ru-13-2", text: "Я хочу зарегистрироваться.", read: "야 하추 자리기스트리라바차.", ko: "체크인하고 싶어요.", tip: "зарегистрироваться는 '자리기스트리라바차'." },
        { id: "ru-13-3", text: "Сколько это займёт?", read: "스콜카 에타 자이묫?", ko: "얼마나 걸려요?", tip: "займёт는 '자이묫', 걸릴 거예요." },
        { id: "ru-13-4", text: "Можно место у окна?", read: "모즈나 메스타 우 악나?", ko: "창가 자리로 주시겠어요?", tip: "у окна는 '우 악나', 창가." },
        { id: "ru-13-5", text: "Я здесь на три дня.", read: "야 즈데스 나 트리 드냐.", ko: "3일 동안 여기 있어요.", tip: "на три дня는 '나 트리 드냐', 사흘 동안." }
      ]
    },
    {
      id: "ru-14", no: 14, title: "숫자와 시간", emoji: "🔢",
      goal: "시간과 가격을 숫자로 말해요",
      items: [
        { id: "ru-14-1", text: "Который час?", read: "카토리이 차스?", ko: "지금 몇 시예요?", tip: "Который час는 '카토리이 차스'." },
        { id: "ru-14-2", text: "Половина четвёртого.", read: "파라비나 치트뵤르타바.", ko: "3시 30분이에요.", tip: "Половина는 '파라비나', 30분을 뜻해요." },
        { id: "ru-14-3", text: "Это стоит двадцать долларов.", read: "에타 스토이트 드바차티 달라라프.", ko: "20달러예요.", tip: "двадцать는 '드바차티', 20." },
        { id: "ru-14-4", text: "Мне нужно ещё десять минут.", read: "므녜 누즈나 예쇼 데샤티 미누트.", ko: "10분만 더 필요해요.", tip: "ещё는 '예쇼', 더." },
        { id: "ru-14-5", text: "Встретимся через час.", read: "프스트레팀샤 체리즈 차스.", ko: "한 시간 뒤에 만나요.", tip: "через час는 '체리즈 차스', 한 시간 뒤." }
      ]
    }
  ];

  var ES_UNITS = [
    {
      id: "es-01", no: 1, title: "인사", emoji: "👋",
      goal: "스페인어로 인사하고 안부를 물어봐요",
      items: [
        { id: "es-01-1", text: "¡Hola! Mucho gusto.", read: "올라! 무초 구스토.", ko: "안녕하세요! 만나서 반가워요.", tip: "¡Hola!의 h는 소리 내지 않아 '올라'." },
        { id: "es-01-2", text: "Buenos días, ¿cómo estás?", read: "부에노스 디아스, 꼬모 에스따스?", ko: "좋은 아침이에요, 어떻게 지내세요?", tip: "¿cómo estás?는 끝을 올려 물어요." },
        { id: "es-01-3", text: "Estoy bien, gracias.", read: "에스또이 비엔, 그라시아스.", ko: "잘 지내요, 고마워요.", tip: "gracias의 c는 'ㅅ' 소리, '그라시아스'." },
        { id: "es-01-4", text: "¡Hasta mañana!", read: "아스따 마냐나!", ko: "내일 봐요!", tip: "Hasta의 h는 묵음, mañana의 ñ는 '뇨'." },
        { id: "es-01-5", text: "¡Que tengas un buen día!", read: "께 뗑가스 운 부엔 디아!", ko: "좋은 하루 보내세요!", tip: "que는 '께', tengas는 '뗑가스'." }
      ]
    },
    {
      id: "es-02", no: 2, title: "자기소개", emoji: "🙋",
      goal: "이름과 나라, 좋아하는 것을 말해요",
      items: [
        { id: "es-02-1", text: "Me llamo Seungwoo.", read: "메 야모 승우.", ko: "제 이름은 승우예요.", tip: "ll은 '예'에 가까운 소리, Me llamo는 '메 야모'." },
        { id: "es-02-2", text: "Soy de Corea.", read: "소이 데 꼬레아.", ko: "저는 한국에서 왔어요.", tip: "Soy는 '소이', de는 '데'." },
        { id: "es-02-3", text: "Trabajo en una empresa.", read: "뜨라바호 엔 우나 엠프레사.", ko: "저는 회사에서 일해요.", tip: "Trabajo의 j는 목구멍에서 나는 'ㅎ'." },
        { id: "es-02-4", text: "Me gustan el café y la música.", read: "메 구스딴 엘 까페 이 라 무시까.", ko: "저는 커피와 음악을 좋아해요.", tip: "여러 개를 좋아할 때는 gustan." },
        { id: "es-02-5", text: "Mucho gusto a todos.", read: "무초 구스토 아 또도스.", ko: "모두 만나서 반가워요.", tip: "a todos는 '아 또도스', 모두에게." }
      ]
    },
    {
      id: "es-03", no: 3, title: "카페에서", emoji: "☕",
      goal: "카페에서 주문하고 계산해요",
      items: [
        { id: "es-03-1", text: "¿Me das un americano helado?", read: "메 다스 운 아메리까노 엘라도?", ko: "아이스 아메리카노 한 잔 주세요.", tip: "helado는 '엘라도', 차갑게." },
        { id: "es-03-2", text: "¿Cuánto cuesta esto?", read: "꽌또 꾸에스따 에스또?", ko: "이거 얼마예요?", tip: "cuesta는 '꾸에스따', 값이 들다." },
        { id: "es-03-3", text: "Para tomar aquí, por favor.", read: "빠라 또마르 아끼, 뽀르 파보르.", ko: "여기서 먹을게요.", tip: "aquí는 '아끼', 여기." },
        { id: "es-03-4", text: "¿Me da un recibo?", read: "메 다 운 레시보?", ko: "영수증 주시겠어요?", tip: "recibo는 '레시보', 영수증." },
        { id: "es-03-5", text: "¡Está delicioso!", read: "에스따 델리시오소!", ko: "맛있어요!", tip: "delicioso는 '델리시오소'." }
      ]
    },
    {
      id: "es-04", no: 4, title: "식당에서", emoji: "🍜",
      goal: "자리를 잡고 음식을 주문해요",
      items: [
        { id: "es-04-1", text: "¿Tienen mesa para dos?", read: "띠에넨 메사 빠라 도스?", ko: "두 명 자리 있나요?", tip: "Tienen은 '띠에넨', mesa는 '메사'." },
        { id: "es-04-2", text: "¿Puedo ver el menú?", read: "뿌에도 베르 엘 메누?", ko: "메뉴판 좀 볼 수 있을까요?", tip: "Puedo는 '뿌에도', ~해도 되나요." },
        { id: "es-04-3", text: "Quiero esto, por favor.", read: "끼에로 에스또, 뽀르 파보르.", ko: "이걸로 주세요.", tip: "Quiero는 '끼에로', 원해요." },
        { id: "es-04-4", text: "No muy picante, por favor.", read: "노 무이 삐깐떼, 뽀르 파보르.", ko: "너무 맵지 않게 해주세요.", tip: "picante는 '삐깐떼', 맵다." },
        { id: "es-04-5", text: "La cuenta, por favor.", read: "라 꾸엔따, 뽀르 파보르.", ko: "계산해 주세요.", tip: "cuenta는 '꾸엔따', 계산서." }
      ]
    },
    {
      id: "es-05", no: 5, title: "길 묻기", emoji: "🗺️",
      goal: "길을 묻고 방향을 알아들어요",
      items: [
        { id: "es-05-1", text: "Perdón, ¿dónde está la estación?", read: "뻬르돈, 돈데 에스따 라 에스따시온?", ko: "실례합니다, 역이 어디예요?", tip: "Perdón은 '뻬르돈', 실례합니다." },
        { id: "es-05-2", text: "¿Está lejos de aquí?", read: "에스따 레호스 데 아끼?", ko: "여기서 먼가요?", tip: "lejos는 '레호스', 멀다." },
        { id: "es-05-3", text: "Siga recto y gire a la izquierda.", read: "시가 렉또 이 히레 아 라 이스끼에르다.", ko: "직진해서 왼쪽으로 도세요.", tip: "izquierda는 '이스끼에르다', 왼쪽." },
        { id: "es-05-4", text: "Son unos cinco minutos a pie.", read: "손 우노스 신꼬 미누또스 아 삐에.", ko: "걸어서 5분쯤 걸려요.", tip: "a pie는 '아 삐에', 걸어서." },
        { id: "es-05-5", text: "Gracias por su ayuda.", read: "그라시아스 뽀르 수 아유다.", ko: "도와주셔서 고마워요.", tip: "ayuda는 '아유다', 도움." }
      ]
    },
    {
      id: "es-06", no: 6, title: "쇼핑", emoji: "🛍️",
      goal: "가격과 사이즈를 물어보고 계산해요",
      items: [
        { id: "es-06-1", text: "¿Cuánto cuesta esta camisa?", read: "꽌또 꾸에스따 에스따 까미사?", ko: "이 셔츠 얼마예요?", tip: "camisa는 '까미사', 셔츠." },
        { id: "es-06-2", text: "¿Tiene una talla más grande?", read: "띠에네 우나 때야 마스 그란데?", ko: "더 큰 사이즈 있나요?", tip: "talla는 '때야', 사이즈." },
        { id: "es-06-3", text: "¿Puedo probármelo?", read: "뿌에도 쁘로바르멜로?", ko: "입어봐도 될까요?", tip: "probármelo는 '쁘로바르멜로', 입어 보다." },
        { id: "es-06-4", text: "Me llevo este.", read: "메 예보 에스떼.", ko: "이걸로 할게요.", tip: "Me llevo는 '메 예보', 가져갈게요." },
        { id: "es-06-5", text: "¿Puedo pagar con tarjeta?", read: "뿌에도 빠가르 꼰 따르헤따?", ko: "카드로 계산할 수 있나요?", tip: "tarjeta는 '따르헤따', 카드." }
      ]
    },
    {
      id: "es-07", no: 7, title: "하루 일과", emoji: "⏰",
      goal: "내 하루를 순서대로 말해요",
      items: [
        { id: "es-07-1", text: "Me levanto a las siete.", read: "메 레반또 아 라스 시에떼.", ko: "저는 7시에 일어나요.", tip: "levanto는 '레반또', 일어나다." },
        { id: "es-07-2", text: "Voy al trabajo en metro.", read: "보이 알 뜨라바호 엔 메뜨로.", ko: "지하철로 출근해요.", tip: "Voy는 '보이', 가요." },
        { id: "es-07-3", text: "Como al mediodía.", read: "꼬모 알 메디오디아.", ko: "정오에 점심을 먹어요.", tip: "mediodía는 '메디오디아', 한낮." },
        { id: "es-07-4", text: "Llego a casa sobre las seis.", read: "예고 아 까사 소브레 라스 세이스.", ko: "6시쯤 집에 와요.", tip: "Llego는 '예고', 도착해요." },
        { id: "es-07-5", text: "Me acuesto antes de las once.", read: "메 아꾸에스또 안떼스 데 라스 온세.", ko: "11시 전에 자요.", tip: "acuesto는 '아꾸에스또', 눕다." }
      ]
    },
    {
      id: "es-08", no: 8, title: "날씨", emoji: "🌤️",
      goal: "오늘과 내일 날씨를 이야기해요",
      items: [
        { id: "es-08-1", text: "Hoy hace sol.", read: "오이 아세 솔.", ko: "오늘은 맑아요.", tip: "hace는 '아세', h는 묵음." },
        { id: "es-08-2", text: "Mañana va a llover.", read: "마냐나 바 아 요베르.", ko: "내일은 비가 올 거예요.", tip: "llover는 '요베르', 비가 오다." },
        { id: "es-08-3", text: "Hace mucho frío afuera.", read: "아세 무초 프리오 아푸에라.", ko: "밖이 아주 추워요.", tip: "frío는 '프리오', 추위." },
        { id: "es-08-4", text: "Lleva un paraguas.", read: "예바 운 빠라과스.", ko: "우산 챙기세요.", tip: "paraguas는 '빠라과스', 우산." },
        { id: "es-08-5", text: "Hoy el aire está muy limpio.", read: "오이 엘 아이레 에스따 무이 림피오.", ko: "오늘 공기가 정말 깨끗해요.", tip: "limpio는 '림피오', 깨끗한." }
      ]
    },
    {
      id: "es-09", no: 9, title: "취미", emoji: "🎸",
      goal: "좋아하는 것과 주말 계획을 말해요",
      items: [
        { id: "es-09-1", text: "Me gusta escuchar música.", read: "메 구스따 에스꾸차르 무시까.", ko: "저는 음악 듣는 걸 좋아해요.", tip: "escuchar는 '에스꾸차르', 듣다." },
        { id: "es-09-2", text: "Toco la guitarra los fines de semana.", read: "또꼬 라 기따라 로스 피네스 데 세마나.", ko: "주말에는 기타를 쳐요.", tip: "guitarra의 rr은 혀를 굴려 '르르'." },
        { id: "es-09-3", text: "¿Te gustan los deportes?", read: "떼 구스딴 로스 데뽀르떼스?", ko: "운동 좋아하세요?", tip: "deportes는 '데뽀르떼스', 운동." },
        { id: "es-09-4", text: "Normalmente paseo por el parque.", read: "노르말멘떼 빠세오 뽀르 엘 빠르께.", ko: "보통 공원에서 산책해요.", tip: "paseo는 '빠세오', 산책해요." },
        { id: "es-09-5", text: "¡Qué divertido!", read: "께 디베르띠도!", ko: "재미있겠네요!", tip: "divertido는 '디베르띠도', 재미있는." }
      ]
    },
    {
      id: "es-10", no: 10, title: "전화와 약속", emoji: "📞",
      goal: "전화로 약속을 잡고 미뤄요",
      items: [
        { id: "es-10-1", text: "Hola, soy Seungwoo.", read: "올라, 소이 승우.", ko: "여보세요, 승우입니다.", tip: "전화에서도 Hola로 시작해요." },
        { id: "es-10-2", text: "¿Tienes tiempo esta noche?", read: "띠에네스 띠엠뽀 에스따 노체?", ko: "오늘 저녁 시간 있어요?", tip: "noche는 '노체', 밤." },
        { id: "es-10-3", text: "Nos vemos a las seis.", read: "노스 베모스 아 라스 세이스.", ko: "6시에 만나요.", tip: "Nos vemos는 '노스 베모스', 만나요." },
        { id: "es-10-4", text: "Voy a llegar un poco tarde.", read: "보이 아 예가르 운 뽀꼬 따르데.", ko: "조금 늦을 것 같아요.", tip: "tarde는 '따르데', 늦게." },
        { id: "es-10-5", text: "¿Puedes llamarme otra vez?", read: "뿌에데스 야마르메 오뜨라 베스?", ko: "다시 전화해 주시겠어요?", tip: "llamarme는 '야마르메', 나에게 전화하다." }
      ]
    },
    {
      id: "es-11", no: 11, title: "감정과 상태", emoji: "😊",
      goal: "내 기분과 상태를 말해요",
      items: [
        { id: "es-11-1", text: "Hoy estoy muy feliz.", read: "오이 에스또이 무이 펠리스.", ko: "오늘 정말 행복해요.", tip: "feliz는 '펠리스', 행복한." },
        { id: "es-11-2", text: "Estoy un poco cansado.", read: "에스또이 운 뽀꼬 깐사도.", ko: "조금 피곤해요.", tip: "cansado는 '깐사도', 피곤한." },
        { id: "es-11-3", text: "No te preocupes.", read: "노 떼 쁘레오꾸뻬스.", ko: "걱정하지 마세요.", tip: "preocupes는 '쁘레오꾸뻬스'." },
        { id: "es-11-4", text: "¡Estoy muy emocionado!", read: "에스또이 무이 에모시오나도!", ko: "너무 신나요!", tip: "emocionado는 '에모시오나도', 들뜬." },
        { id: "es-11-5", text: "Eso me hace sentir bien.", read: "에소 메 아세 센띠르 비엔.", ko: "그건 기분이 좋아져요.", tip: "sentir는 '센띠르', 느끼다." }
      ]
    },
    {
      id: "es-12", no: 12, title: "가족과 친구", emoji: "👨‍👩‍👧",
      goal: "가족과 친구를 소개해요",
      items: [
        { id: "es-12-1", text: "Esta es la foto de mi familia.", read: "에스따 에스 라 포또 데 미 파밀리아.", ko: "이건 우리 가족 사진이에요.", tip: "familia는 '파밀리아', 가족." },
        { id: "es-12-2", text: "Tengo una hermana mayor.", read: "뗑고 우나 에르마나 마요르.", ko: "저는 누나가 한 명 있어요.", tip: "hermana는 '에르마나', 자매." },
        { id: "es-12-3", text: "Mis padres viven en Busan.", read: "미스 빠드레스 비벤 엔 부산.", ko: "부모님은 부산에 사세요.", tip: "padres는 '빠드레스', 부모님." },
        { id: "es-12-4", text: "Nos vemos todos los domingos.", read: "노스 베모스 또도스 로스 도밍고스.", ko: "우리는 매주 일요일에 만나요.", tip: "domingos는 '도밍고스', 일요일마다." },
        { id: "es-12-5", text: "Mi amigo es muy amable.", read: "미 아미고 에스 무이 아마블레.", ko: "제 친구는 아주 친절해요.", tip: "amable은 '아마블레', 친절한." }
      ]
    },
    {
      id: "es-13", no: 13, title: "여행", emoji: "✈️",
      goal: "공항과 호텔에서 필요한 말을 해요",
      items: [
        { id: "es-13-1", text: "¿Dónde está el bus del aeropuerto?", read: "돈데 에스따 엘 부스 델 아에로뿌에르또?", ko: "공항 버스는 어디예요?", tip: "aeropuerto는 '아에로뿌에르또', 공항." },
        { id: "es-13-2", text: "Quiero hacer el check-in.", read: "끼에로 아세르 엘 체크인.", ko: "체크인하고 싶어요.", tip: "hacer는 '아세르', 하다." },
        { id: "es-13-3", text: "¿Cuánto tarda?", read: "꽌또 따르다?", ko: "얼마나 걸려요?", tip: "tarda는 '따르다', 걸리다." },
        { id: "es-13-4", text: "¿Me da un asiento de ventanilla?", read: "메 다 운 아시엔또 데 벤따니야?", ko: "창가 자리로 주시겠어요?", tip: "ventanilla의 ll은 '여' 소리." },
        { id: "es-13-5", text: "Estoy aquí tres días.", read: "에스또이 아끼 뜨레스 디아스.", ko: "3일 동안 여기 있어요.", tip: "tres는 '뜨레스', 3." }
      ]
    },
    {
      id: "es-14", no: 14, title: "숫자와 시간", emoji: "🔢",
      goal: "시간과 가격을 숫자로 말해요",
      items: [
        { id: "es-14-1", text: "¿Qué hora es?", read: "께 오라 에스?", ko: "지금 몇 시예요?", tip: "hora의 h는 묵음, '오라'." },
        { id: "es-14-2", text: "Son las tres y media.", read: "손 라스 뜨레스 이 메디아.", ko: "3시 30분이에요.", tip: "y media는 '이 메디아', 30분." },
        { id: "es-14-3", text: "Cuesta veinte dólares.", read: "꾸에스따 베인떼 돌라레스.", ko: "20달러예요.", tip: "veinte는 '베인떼', 20." },
        { id: "es-14-4", text: "Necesito diez minutos más.", read: "네세시또 디에스 미누또스 마스.", ko: "10분만 더 필요해요.", tip: "Necesito는 '네세시또', 필요해요." },
        { id: "es-14-5", text: "Nos vemos en una hora.", read: "노스 베모스 엔 우나 오라.", ko: "한 시간 뒤에 만나요.", tip: "en una hora는 '엔 우나 오라'." }
      ]
    }
  ];

  var VI_UNITS = [
    {
      id: "vi-01", no: 1, title: "인사", emoji: "👋",
      goal: "베트남어로 인사하고 안부를 물어봐요",
      items: [
        { id: "vi-01-1", text: "Xin chào! Rất vui được gặp bạn.", read: "신 차오! 저엇 부이 드억 갑 반.", ko: "안녕하세요! 만나서 반가워요.", tip: "chào는 '차오'로 가볍게 내려요." },
        { id: "vi-01-2", text: "Chào buổi sáng, bạn khỏe không?", read: "차오 부오이 상, 반 콰에 콩?", ko: "좋은 아침이에요, 잘 지내세요?", tip: "khỏe không은 '콰에 콩', 안부를 물어요." },
        { id: "vi-01-3", text: "Mình khỏe, cảm ơn bạn.", read: "민 콰에, 깜 언 반.", ko: "잘 지내요, 고마워요.", tip: "cảm ơn은 '깜 언', 고마워요." },
        { id: "vi-01-4", text: "Hẹn gặp lại ngày mai!", read: "헨 갑 라이 응아이 마이!", ko: "내일 봐요!", tip: "hẹn gặp lại는 '헨 갑 라이', 또 만나요." },
        { id: "vi-01-5", text: "Chúc bạn một ngày tốt lành!", read: "축 반 못 응아이 똣 라인!", ko: "좋은 하루 보내세요!", tip: "chúc은 '축', 축하·기원할 때 써요." }
      ]
    },
    {
      id: "vi-02", no: 2, title: "자기소개", emoji: "🙋",
      goal: "이름과 나라, 하는 일을 말해요",
      items: [
        { id: "vi-02-1", text: "Mình tên là Seungwoo.", read: "민 뗀 라 승우.", ko: "제 이름은 승우예요.", tip: "tên là는 '뗀 라', 이름은." },
        { id: "vi-02-2", text: "Mình đến từ Hàn Quốc.", read: "민 덴 뜨 한 꾸옥.", ko: "저는 한국에서 왔어요.", tip: "đến từ는 '덴 뜨', ~에서 왔어요." },
        { id: "vi-02-3", text: "Mình làm việc ở công ty.", read: "민 람 비엑 어 꽁 띠.", ko: "저는 회사에서 일해요.", tip: "làm việc는 '람 비엑', 일하다." },
        { id: "vi-02-4", text: "Mình thích cà phê và âm nhạc.", read: "민 틱 까 페 바 엄 냐억.", ko: "저는 커피와 음악을 좋아해요.", tip: "thích는 '틱', 좋아하다." },
        { id: "vi-02-5", text: "Rất vui được gặp mọi người.", read: "저엇 부이 드억 갑 모이 응어이.", ko: "모두 만나서 반가워요.", tip: "mọi người는 '모이 응어이', 여러분." }
      ]
    },
    {
      id: "vi-03", no: 3, title: "카페에서", emoji: "☕",
      goal: "카페에서 주문하고 계산해요",
      items: [
        { id: "vi-03-1", text: "Cho mình một ly americano đá.", read: "쪼 민 못 리 아메리까노 다.", ko: "아이스 아메리카노 한 잔 주세요.", tip: "đá는 '다', 얼음." },
        { id: "vi-03-2", text: "Cái này bao nhiêu tiền?", read: "까이 나이 바오 니에우 띠엔?", ko: "이거 얼마예요?", tip: "bao nhiêu는 '바오 니에우', 얼마." },
        { id: "vi-03-3", text: "Mình ăn ở đây.", read: "민 안 어 더이.", ko: "여기서 먹을게요.", tip: "ở đây는 '어 더이', 여기서." },
        { id: "vi-03-4", text: "Cho mình xin hóa đơn.", read: "쪼 민 신 화 단.", ko: "영수증 주시겠어요?", tip: "hóa đơn은 '화 단', 영수증." },
        { id: "vi-03-5", text: "Ngon quá!", read: "응온 꽈!", ko: "맛있어요!", tip: "ngon은 '응온', 맛있다." }
      ]
    },
    {
      id: "vi-04", no: 4, title: "식당에서", emoji: "🍜",
      goal: "자리를 잡고 음식을 주문해요",
      items: [
        { id: "vi-04-1", text: "Có bàn cho hai người không?", read: "꼬 반 쪼 하이 응어이 콩?", ko: "두 명 자리 있나요?", tip: "bàn은 '반', 식탁." },
        { id: "vi-04-2", text: "Cho mình xem thực đơn.", read: "쪼 민 셈 툭 던.", ko: "메뉴판 좀 볼 수 있을까요?", tip: "thực đơn은 '툭 던', 메뉴." },
        { id: "vi-04-3", text: "Mình lấy món này.", read: "민 러이 몬 나이.", ko: "이걸로 주세요.", tip: "lấy는 '러이', 고르다·받다." },
        { id: "vi-04-4", text: "Đừng làm cay quá nhé.", read: "등 람 까이 꽈 네.", ko: "너무 맵지 않게 해주세요.", tip: "cay는 '까이', 맵다." },
        { id: "vi-04-5", text: "Cho mình thanh toán.", read: "쪼 민 탄 또안.", ko: "계산해 주세요.", tip: "thanh toán은 '탄 또안', 계산." }
      ]
    },
    {
      id: "vi-05", no: 5, title: "길 묻기", emoji: "🗺️",
      goal: "길을 묻고 방향을 알아들어요",
      items: [
        { id: "vi-05-1", text: "Xin lỗi, ga tàu ở đâu?", read: "신 로이, 가 따우 어 더우?", ko: "실례합니다, 역이 어디예요?", tip: "ga tàu는 '가 따우', 기차역." },
        { id: "vi-05-2", text: "Có xa đây không?", read: "꼬 사 더이 콩?", ko: "여기서 먼가요?", tip: "xa는 '사', 멀다." },
        { id: "vi-05-3", text: "Đi thẳng rồi rẽ trái.", read: "디 탕 로이 제 짜이.", ko: "직진해서 왼쪽으로 도세요.", tip: "rẽ trái는 '제 짜이', 왼쪽으로 돌다." },
        { id: "vi-05-4", text: "Đi bộ khoảng năm phút.", read: "디 보 콴 남 풋.", ko: "걸어서 5분쯤 걸려요.", tip: "khoảng는 '콴', ~쯤." },
        { id: "vi-05-5", text: "Cảm ơn bạn đã giúp.", read: "깜 언 반 다 줍.", ko: "도와주셔서 고마워요.", tip: "đã giúp은 '다 줍', 도와줘서." }
      ]
    },
    {
      id: "vi-06", no: 6, title: "쇼핑", emoji: "🛍️",
      goal: "가격과 사이즈를 물어보고 계산해요",
      items: [
        { id: "vi-06-1", text: "Áo sơ mi này bao nhiêu tiền?", read: "아오 서 미 나이 바오 니에우 띠엔?", ko: "이 셔츠 얼마예요?", tip: "áo sơ mi는 '아오 서 미', 셔츠." },
        { id: "vi-06-2", text: "Có size lớn hơn không?", read: "꼬 사이즈 런 헌 콩?", ko: "더 큰 사이즈 있나요?", tip: "lớn hơn은 '런 헌', 더 큰." },
        { id: "vi-06-3", text: "Mình mặc thử được không?", read: "민 막 트 드억 콩?", ko: "입어봐도 될까요?", tip: "mặc thử는 '막 트', 입어 보다." },
        { id: "vi-06-4", text: "Mình lấy cái này.", read: "민 러이 까이 나이.", ko: "이걸로 할게요.", tip: "cái này는 '까이 나이', 이것." },
        { id: "vi-06-5", text: "Mình trả bằng thẻ được không?", read: "민 짜 방 테 드억 콩?", ko: "카드로 계산할 수 있나요?", tip: "bằng thẻ는 '방 테', 카드로." }
      ]
    },
    {
      id: "vi-07", no: 7, title: "하루 일과", emoji: "⏰",
      goal: "내 하루를 순서대로 말해요",
      items: [
        { id: "vi-07-1", text: "Mình thức dậy lúc bảy giờ.", read: "민 툭 저이 룩 바이 저.", ko: "저는 7시에 일어나요.", tip: "thức dậy는 '툭 저이', 일어나다." },
        { id: "vi-07-2", text: "Mình đi làm bằng tàu điện.", read: "민 디 람 방 따우 디엔.", ko: "지하철로 출근해요.", tip: "tàu điện은 '따우 디엔', 지하철." },
        { id: "vi-07-3", text: "Mình ăn trưa lúc mười hai giờ.", read: "민 안 쯔어 룩 므어이 하이 저.", ko: "정오에 점심을 먹어요.", tip: "ăn trưa는 '안 쯔어', 점심을 먹다." },
        { id: "vi-07-4", text: "Mình về nhà khoảng sáu giờ.", read: "민 베 냐 콴 사우 저.", ko: "6시쯤 집에 와요.", tip: "về nhà는 '베 냐', 집에 오다." },
        { id: "vi-07-5", text: "Mình đi ngủ trước mười một giờ.", read: "민 디 응우 쯔억 므어이 못 저.", ko: "11시 전에 자요.", tip: "đi ngủ는 '디 응우', 자다." }
      ]
    },
    {
      id: "vi-08", no: 8, title: "날씨", emoji: "🌤️",
      goal: "오늘과 내일 날씨를 이야기해요",
      items: [
        { id: "vi-08-1", text: "Hôm nay trời nắng.", read: "홈 나이 쯔어이 낭.", ko: "오늘은 맑아요.", tip: "trời nắng은 '쯔어이 낭', 햇빛이 나요." },
        { id: "vi-08-2", text: "Mai trời sẽ mưa.", read: "마이 쯔어이 세 므어.", ko: "내일은 비가 올 거예요.", tip: "sẽ는 '세', ~할 거예요." },
        { id: "vi-08-3", text: "Bên ngoài rất lạnh.", read: "벤 응와이 저엇 라인.", ko: "밖이 아주 추워요.", tip: "lạnh는 '라인', 춥다." },
        { id: "vi-08-4", text: "Nhớ mang áo mưa nhé.", read: "너 망 아오 므어 네.", ko: "우산 챙기세요.", tip: "áo mưa는 '아오 므어', 우비." },
        { id: "vi-08-5", text: "Hôm nay không khí rất trong lành.", read: "홈 나이 콩 키 저엇 쫑 라인.", ko: "오늘 공기가 정말 깨끗해요.", tip: "không khí는 '콩 키', 공기." }
      ]
    },
    {
      id: "vi-09", no: 9, title: "취미", emoji: "🎸",
      goal: "좋아하는 것과 주말 계획을 말해요",
      items: [
        { id: "vi-09-1", text: "Mình thích nghe nhạc.", read: "민 틱 응에 냐억.", ko: "저는 음악 듣는 걸 좋아해요.", tip: "nghe nhạc은 '응에 냐억', 음악 듣기." },
        { id: "vi-09-2", text: "Cuối tuần mình chơi ghi-ta.", read: "꾸오이 뚜언 민 쯔어이 기따.", ko: "주말에는 기타를 쳐요.", tip: "cuối tuần은 '꾸오이 뚜언', 주말." },
        { id: "vi-09-3", text: "Bạn có thích thể thao không?", read: "반 꼬 틱 테 타오 콩?", ko: "운동 좋아하세요?", tip: "thể thao는 '테 타오', 운동." },
        { id: "vi-09-4", text: "Mình thường đi bộ trong công viên.", read: "민 트엉 디 보 쫑 꽁 비엔.", ko: "보통 공원에서 산책해요.", tip: "thường은 '트엉', 보통." },
        { id: "vi-09-5", text: "Nghe vui quá!", read: "응에 부이 꽈!", ko: "재미있겠네요!", tip: "vui는 '부이', 즐겁다." }
      ]
    },
    {
      id: "vi-10", no: 10, title: "전화와 약속", emoji: "📞",
      goal: "전화로 약속을 잡고 미뤄요",
      items: [
        { id: "vi-10-1", text: "A lô, mình là Seungwoo.", read: "아 로, 민 라 승우.", ko: "여보세요, 승우입니다.", tip: "전화에서는 A lô로 시작해요." },
        { id: "vi-10-2", text: "Tối nay bạn có rảnh không?", read: "또이 나이 반 꼬 짠 콩?", ko: "오늘 저녁 시간 있어요?", tip: "rảnh는 '짠', 시간이 비다." },
        { id: "vi-10-3", text: "Mình gặp nhau lúc sáu giờ nhé.", read: "민 갑 냐우 룩 사우 저 네.", ko: "6시에 만나요.", tip: "gặp nhau는 '갑 냐우', 서로 만나다." },
        { id: "vi-10-4", text: "Mình sẽ đến muộn một chút.", read: "민 세 덴 무언 못 줍.", ko: "조금 늦을 것 같아요.", tip: "muộn는 '무언', 늦다." },
        { id: "vi-10-5", text: "Bạn gọi lại cho mình nhé.", read: "반 고이 라이 쪼 민 네.", ko: "다시 전화해 주시겠어요?", tip: "gọi lại는 '고이 라이', 다시 전화하다." }
      ]
    },
    {
      id: "vi-11", no: 11, title: "감정과 상태", emoji: "😊",
      goal: "내 기분과 상태를 말해요",
      items: [
        { id: "vi-11-1", text: "Hôm nay mình rất vui.", read: "홈 나이 민 저엇 부이.", ko: "오늘 정말 행복해요.", tip: "vui는 '부이', 기쁘다." },
        { id: "vi-11-2", text: "Mình hơi mệt.", read: "민 허이 멧.", ko: "조금 피곤해요.", tip: "mệt는 '멧', 피곤하다." },
        { id: "vi-11-3", text: "Đừng lo nhé.", read: "등 로 네.", ko: "걱정하지 마세요.", tip: "lo는 '로', 걱정하다." },
        { id: "vi-11-4", text: "Mình rất hào hứng!", read: "민 저엇 하오 흥!", ko: "너무 신나요!", tip: "hào hứng은 '하오 흥', 들뜨다." },
        { id: "vi-11-5", text: "Điều đó làm mình thấy vui.", read: "디에우 도 람 민 타이 부이.", ko: "그건 기분이 좋아져요.", tip: "điều đó는 '디에우 도', 그것." }
      ]
    },
    {
      id: "vi-12", no: 12, title: "가족과 친구", emoji: "👨‍👩‍👧",
      goal: "가족과 친구를 소개해요",
      items: [
        { id: "vi-12-1", text: "Đây là ảnh gia đình mình.", read: "더이 라 안 자 딘 민.", ko: "이건 우리 가족 사진이에요.", tip: "ảnh는 '안', 사진." },
        { id: "vi-12-2", text: "Mình có một chị gái.", read: "민 꼬 못 찌 가이.", ko: "저는 누나가 한 명 있어요.", tip: "chị gái는 '찌 가이', 누나·언니." },
        { id: "vi-12-3", text: "Bố mẹ mình sống ở Busan.", read: "보 메 민 송 어 부산.", ko: "부모님은 부산에 사세요.", tip: "bố mẹ는 '보 메', 부모님." },
        { id: "vi-12-4", text: "Chủ nhật nào mình cũng gặp nhau.", read: "쭈 녓 나오 민 꿍 갑 냐우.", ko: "우리는 매주 일요일에 만나요.", tip: "chủ nhật은 '쭈 녓', 일요일." },
        { id: "vi-12-5", text: "Bạn mình rất tốt bụng.", read: "반 민 저엇 똣 붕.", ko: "제 친구는 아주 친절해요.", tip: "tốt bụng은 '똣 붕', 친절하다." }
      ]
    },
    {
      id: "vi-13", no: 13, title: "여행", emoji: "✈️",
      goal: "공항과 호텔에서 필요한 말을 해요",
      items: [
        { id: "vi-13-1", text: "Xe buýt sân bay ở đâu?", read: "세 부잇 산 바이 어 더우?", ko: "공항 버스는 어디예요?", tip: "sân bay는 '산 바이', 공항." },
        { id: "vi-13-2", text: "Mình muốn nhận phòng.", read: "민 무언 년 퐁.", ko: "체크인하고 싶어요.", tip: "nhận phòng은 '년 퐁', 체크인." },
        { id: "vi-13-3", text: "Mất bao lâu?", read: "멋 바오 러우?", ko: "얼마나 걸려요?", tip: "mất bao lâu는 '멋 바오 러우'." },
        { id: "vi-13-4", text: "Cho mình chỗ ngồi cạnh cửa sổ.", read: "쪼 민 쫘 응오이 깐 쯔어 소.", ko: "창가 자리로 주시겠어요?", tip: "cạnh cửa sổ는 '깐 쯔어 소', 창가." },
        { id: "vi-13-5", text: "Mình ở đây ba ngày.", read: "민 어 더이 바 응아이.", ko: "3일 동안 여기 있어요.", tip: "ba ngày는 '바 응아이', 사흘." }
      ]
    },
    {
      id: "vi-14", no: 14, title: "숫자와 시간", emoji: "🔢",
      goal: "시간과 가격을 숫자로 말해요",
      items: [
        { id: "vi-14-1", text: "Bây giờ là mấy giờ?", read: "버이 저 라 머이 저?", ko: "지금 몇 시예요?", tip: "mấy giờ는 '머이 저', 몇 시." },
        { id: "vi-14-2", text: "Ba giờ rưỡi.", read: "바 저 르어이.", ko: "3시 30분이에요.", tip: "rưỡi는 '르어이', 30분." },
        { id: "vi-14-3", text: "Cái này hai mươi đô la.", read: "까이 나이 하이 므어이 도 라.", ko: "20달러예요.", tip: "hai mươi는 '하이 므어이', 20." },
        { id: "vi-14-4", text: "Mình cần thêm mười phút.", read: "민 껀 템 므어이 풋.", ko: "10분만 더 필요해요.", tip: "thêm은 '템', 더." },
        { id: "vi-14-5", text: "Một tiếng nữa mình gặp nhé.", read: "못 띠엥 느어 민 갑 네.", ko: "한 시간 뒤에 만나요.", tip: "một tiếng nữa는 '못 띠엥 느어', 한 시간 뒤." }
      ]
    }
  ];

  var WRITING = {
    ru: {
      groups: [
        { title: "기본 모음", letters: [
          { ch: "А а", name: "아", sound: "[a]", ex: "мама (엄마)" },
          { ch: "О о", name: "오", sound: "[o] · 강세 없으면 'ㅏ'", ex: "окно (창문)" },
          { ch: "У у", name: "우", sound: "[u]", ex: "утро (아침)" },
          { ch: "Э э", name: "에", sound: "[e]", ex: "это (이것)" },
          { ch: "И и", name: "이", sound: "[i]", ex: "имя (이름)" },
          { ch: "Ы ы", name: "으", sound: "[y] '으이'", ex: "сын (아들)" }
        ] },
        { title: "요 모음", letters: [
          { ch: "Я я", name: "야", sound: "[ja] · 자음 뒤에서는 '아'", ex: "яблоко (사과)" },
          { ch: "Ё ё", name: "요", sound: "[jo] · 자음 뒤에서는 '오'", ex: "ёлка (트리)" },
          { ch: "Ю ю", name: "유", sound: "[ju] · 자음 뒤에서는 '우'", ex: "юг (남쪽)" },
          { ch: "Е е", name: "예", sound: "[je] · 자음 뒤에서는 '에'", ex: "есть (먹다)" }
        ] },
        { title: "자음 1", letters: [
          { ch: "Б б", name: "베", sound: "[b]", ex: "банк (은행)" },
          { ch: "В в", name: "브э", sound: "[v]", ex: "вода (물)" },
          { ch: "Г г", name: "게", sound: "[g]", ex: "город (도시)" },
          { ch: "Д д", name: "데", sound: "[d]", ex: "дом (집)" },
          { ch: "Ж ж", name: "줴", sound: "[zh] 혀를 대고 'ㅈ'", ex: "журнал (잡지)" },
          { ch: "З з", name: "제", sound: "[z]", ex: "зима (겨울)" },
          { ch: "К к", name: "카", sound: "[k]", ex: "кот (고양이)" },
          { ch: "Л л", name: "엘", sound: "[l]", ex: "лампа (램프)" },
          { ch: "М м", name: "엠", sound: "[m]", ex: "мама (엄마)" },
          { ch: "Н н", name: "엔", sound: "[n]", ex: "нос (코)" }
        ] },
        { title: "자음 2", letters: [
          { ch: "П п", name: "페", sound: "[p]", ex: "папа (아빠)" },
          { ch: "Р р", name: "에르", sound: "[r] 혀를 떨어 '르'", ex: "Россия (러시아)" },
          { ch: "С с", name: "에스", sound: "[s]", ex: "сок (주스)" },
          { ch: "Т т", name: "테", sound: "[t]", ex: "торт (케이크)" },
          { ch: "Ф ф", name: "에프", sound: "[f]", ex: "футбол (축구)" },
          { ch: "Х х", name: "하", sound: "[h] 거친 '흐'", ex: "хлеб (빵)" },
          { ch: "Ц ц", name: "체", sound: "[ts] '츠'", ex: "цена (가격)" },
          { ch: "Ч ч", name: "체", sound: "[ch] '치'", ex: "чай (차)" },
          { ch: "Ш ш", name: "샤", sound: "[sh] 혀를 뒤로", ex: "школа (학교)" },
          { ch: "Щ щ", name: "샤(연한)", sound: "[shch] '시치'", ex: "щенок (강아지)" }
        ] },
        { title: "부호와 반모음", letters: [
          { ch: "Й й", name: "이(짧게)", sound: "[j] '이'를 짧게", ex: "чай (차)" },
          { ch: "Ъ ъ", name: "하르드 사인", sound: "소리 없음 · 앞뒤를 끊어 줌", ex: "подъезд (현관)" },
          { ch: "Ь ь", name: "소프트 사인", sound: "소리 없음 · 앞 자음을 부드럽게", ex: "соль (소금)" }
        ] }
      ],
      rules: [
        { title: "о는 강세가 없으면 'ㅏ'", body: "молоко는 '말라코'처럼 들려요. 강세가 없는 о는 'ㅏ'로 읽어요." },
        { title: "е, ё, ю, я는 자음 뒤에서 다르게", body: "자음 뒤에서는 '에, 오, 우, 아'로 읽고, 첫소리나 모음 뒤에서는 '예, 요, 유, 야'로 읽어요." },
        { title: "ь는 앞 자음을 부드럽게", body: "соль는 '솔'이 아니라 '솔리'처럼 혀를 입천장에 붙여 부드럽게 내요." },
        { title: "р는 혀를 떨어요", body: "한국어 'ㄹ'보다 혀끝을 떨며 '르르' 소리를 내요. 처음에는 '르'로 시작해도 괜찮아요." }
      ]
    },
    es: {
      groups: [
        { title: "모음", letters: [
          { ch: "A a", name: "아", sound: "[a]", ex: "agua (물)" },
          { ch: "E e", name: "에", sound: "[e]", ex: "mesa (탁자)" },
          { ch: "I i", name: "이", sound: "[i]", ex: "isla (섬)" },
          { ch: "O o", name: "오", sound: "[o]", ex: "ojo (눈)" },
          { ch: "U u", name: "우", sound: "[u]", ex: "uva (포도)" }
        ] },
        { title: "자음 1", letters: [
          { ch: "B b", name: "베", sound: "[b]", ex: "boca (입)" },
          { ch: "C c", name: "세", sound: "[k] · e, i 앞에서 'ㅅ'", ex: "casa (집)" },
          { ch: "D d", name: "데", sound: "[d]", ex: "dedo (손가락)" },
          { ch: "F f", name: "에페", sound: "[f]", ex: "foto (사진)" },
          { ch: "G g", name: "헤", sound: "[g] · e, i 앞에서 'ㅎ'", ex: "gato (고양이)" },
          { ch: "H h", name: "아체", sound: "소리 없음", ex: "hola (안녕)" },
          { ch: "J j", name: "호타", sound: "[h] 목구멍 'ㅎ'", ex: "jugo (주스)" },
          { ch: "K k", name: "카", sound: "[k]", ex: "kilo (킬로)" },
          { ch: "L l", name: "에레", sound: "[l]", ex: "luna (달)" },
          { ch: "M m", name: "에메", sound: "[m]", ex: "mano (손)" }
        ] },
        { title: "자음 2", letters: [
          { ch: "N n", name: "에네", sound: "[n]", ex: "nube (구름)" },
          { ch: "Ñ ñ", name: "에녜", sound: "[nj] '뇨'", ex: "año (해)" },
          { ch: "P p", name: "페", sound: "[p]", ex: "pan (빵)" },
          { ch: "Q q", name: "쿠", sound: "[k] · 항상 u와 함께", ex: "queso (치즈)" },
          { ch: "R r", name: "에레", sound: "[r] 짧게 '르'", ex: "pera (배)" },
          { ch: "S s", name: "에세", sound: "[s]", ex: "sol (해)" },
          { ch: "T t", name: "테", sound: "[t]", ex: "taza (컵)" },
          { ch: "V v", name: "우베", sound: "[b] b와 거의 같아요", ex: "vino (와인)" },
          { ch: "W w", name: "우베 도블레", sound: "[w]", ex: "wifi (와이파이)" },
          { ch: "X x", name: "에키스", sound: "[ks]", ex: "taxi (택시)" },
          { ch: "Y y", name: "예", sound: "[j]", ex: "yo (나)" },
          { ch: "Z z", name: "세타", sound: "[θ] 'ㅆ'에 가까운 번데기 소리", ex: "zapato (신발)" }
        ] }
      ],
      rules: [
        { title: "ñ는 '뇨'", body: "ñ는 n과 y가 합쳐진 소리예요. año(해)는 '아뇨'처럼 들려요." },
        { title: "ll은 '예'", body: "llave(열쇠)는 '야베', llover(비 오다)는 '요베르'처럼 들려요." },
        { title: "rr은 혀를 굴려", body: "perro(개)는 '뻬로'보다 혀를 떨어 '뻬르로'에 가깝게 내요." },
        { title: "j는 목구멍 'ㅎ'", body: "jugo(주스)의 j는 한국어 'ㅎ'보다 목 안쪽에서 거칠게 나요." },
        { title: "h는 소리 내지 않아요", body: "hola, hora, ahora의 h는 모두 묵음이에요." },
        { title: "c, z는 'ㅆ' 소리", body: "스페인에서는 gracias, zapato의 c·z를 혀끝을 윗니에 붙여 'ㅆ'처럼 내요." },
        { title: "g는 e, i 앞에서 'ㅎ'", body: "gente(사람들)는 '헨떼', gato(고양이)는 '가또'로 읽어요." },
        { title: "강세는 끝에서 두 번째", body: "모음이나 n, s로 끝나면 끝에서 두 번째 음절을 세게 읽어요. música는 '무시까'." }
      ]
    },
    vi: {
      groups: [
        { title: "모음", letters: [
          { ch: "A a", name: "아", sound: "[a]", ex: "ăn (먹다)" },
          { ch: "Ă ă", name: "아(짧게)", sound: "[ă] 짧은 '아'", ex: "ăn (먹다)" },
          { ch: "Â â", name: "어", sound: "[ə] '어'에 가까운 '아'", ex: "cân (저울)" },
          { ch: "E e", name: "에", sound: "[ɛ]", ex: "em (동생)" },
          { ch: "Ê ê", name: "에(입술 옆으로)", sound: "[e]", ex: "đê (제방)" },
          { ch: "I i", name: "이", sound: "[i]", ex: "im (조용한)" },
          { ch: "O o", name: "오", sound: "[ɔ]", ex: "ong (할아버지)" },
          { ch: "Ô ô", name: "오(입술 오므려)", sound: "[o]", ex: "ông (할아버지)" },
          { ch: "Ơ ơ", name: "어", sound: "[ə:] 길게 '어'", ex: "ơi (부를 때)" },
          { ch: "U u", name: "우", sound: "[u]", ex: "uống (마시다)" },
          { ch: "Ư ư", name: "으(우에 가깝게)", sound: "[ɨ]", ex: "ưa (좋아하다)" },
          { ch: "Y y", name: "이", sound: "[i]", ex: "yêu (사랑)" }
        ] },
        { title: "자음 1", letters: [
          { ch: "B b", name: "브", sound: "[b]", ex: "bà (할머니)" },
          { ch: "C c", name: "끄", sound: "[k]", ex: "cá (물고기)" },
          { ch: "D d", name: "즈", sound: "[z] 북부는 'ㅈ'", ex: "da (피부)" },
          { ch: "Đ đ", name: "드", sound: "[d] 혀를 윗니에", ex: "đi (가다)" },
          { ch: "G g", name: "그", sound: "[g]", ex: "gà (닭)" },
          { ch: "H h", name: "흐", sound: "[h]", ex: "hoa (꽃)" },
          { ch: "K k", name: "끄", sound: "[k]", ex: "kem (아이스크림)" },
          { ch: "L l", name: "를", sound: "[l]", ex: "lá (잎)" },
          { ch: "M m", name: "므", sound: "[m]", ex: "mèo (고양이)" },
          { ch: "N n", name: "느", sound: "[n]", ex: "nước (물)" }
        ] },
        { title: "자음 2", letters: [
          { ch: "P p", name: "뻐", sound: "[p] 끝소리로 자주 써요", ex: "đẹp (예쁘다)" },
          { ch: "Q q", name: "꾸", sound: "[kw] 항상 u와 함께", ex: "quả (과일)" },
          { ch: "R r", name: "르(혀 굴려)", sound: "[r]", ex: "ra (나가다)" },
          { ch: "S s", name: "ㅅ", sound: "[s] 북부는 'ㅆ'처럼", ex: "sông (강)" },
          { ch: "T t", name: "뜨", sound: "[t]", ex: "tay (손)" },
          { ch: "V v", name: "브", sound: "[v]", ex: "vàng (노란)" },
          { ch: "X x", name: "ㅅ", sound: "[s]", ex: "xanh (푸른)" }
        ] }
      ],
      tones: [
        { mark: "a", name: "ngang · 평성", ex: "ma", ko: "유령", tip: "높이를 그대로 유지해요." },
        { mark: "á", name: "sắc · 올림", ex: "má", ko: "뺨", tip: "끝을 위로 올려요." },
        { mark: "à", name: "huyền · 내림", ex: "mà", ko: "그러나", tip: "낮게 내려요." },
        { mark: "ả", name: "hỏi · 내렸다 올림", ex: "mả", ko: "무덤", tip: "내렸다 살짝 올려요." },
        { mark: "ã", name: "ngã · 꺾어 올림", ex: "mã", ko: "말", tip: "한 번 꺾어 올려요." },
        { mark: "ạ", name: "nặng · 끊어 내림", ex: "mạ", ko: "벼", tip: "짧고 낮게 끊어요." }
      ],
      rules: [
        { title: "성조 6가지", body: "같은 'ma'도 성조에 따라 뜻이 달라져요: ngang(평) ma 유령, sắc(á) má 뺨, huyền(à) mà 그러나, hỏi(ả) mả 무덤, ngã(ã) mã 말, nặng(ạ) mạ 벼." },
        { title: "sắc은 올리고, huyền은 내려요", body: "á는 끝을 올리고 à는 낮게 내려요. 손으로 높낮이를 그리며 따라 해 보세요." },
        { title: "hỏi와 ngã는 꺾는 소리", body: "ả는 내렸다가 올리고, ã는 한 번 꺾어 올려요. 천천히 크게 연습해 보세요." },
        { title: "nặng은 짧게 끊어요", body: "ạ는 낮게 눌러 짧게 끊어요. 목에 힘을 빼고 낮게 내려 보세요." },
        { title: "끝 자음은 가볍게", body: "ăn, uống처럼 끝에 오는 n, ng은 코로 가볍게 울려 마무리해요." }
      ]
    }
  };

  global.APP_DATA = {
    mode: "beginner",
    name: "킹링고 입문",
    mark: "입",
    storageKey: "kinglingo.beginner.v1",
    tabs: [
      { id: "today", label: "오늘", icon: "home" },
      { id: "write", label: "읽기·쓰기", icon: "pen" },
      { id: "cards", label: "카드", icon: "cards" },
      { id: "quiz", label: "퀴즈", icon: "quiz" }
    ],
    courses: [
      {
        code: "ru", name: "러시아어", native: "Русский", locale: "ru-RU", flag: "🇷🇺",
        rate: { normal: 0.85, slow: 0.55 },
        writingGoal: "키릴 문자 33자를 읽고 손으로 써 봐요",
        units: RU_UNITS
      },
      {
        code: "es", name: "스페인어", native: "Español", locale: "es-ES", flag: "🇪🇸",
        rate: { normal: 0.9, slow: 0.6 },
        writingGoal: "알파벳 27자와 발음 규칙을 익혀요",
        units: ES_UNITS
      },
      {
        code: "vi", name: "베트남어", native: "Tiếng Việt", locale: "vi-VN", flag: "🇻🇳",
        rate: { normal: 0.85, slow: 0.55 },
        writingGoal: "알파벳 29자와 6개 성조를 익혀요",
        units: VI_UNITS
      }
    ],
    writing: WRITING,
    otherApps: [
      { name: "킹링고", desc: "영어 · 중국어 · 일본어", href: "../" },
      { name: "킹한자", desc: "한자 읽기 · 따라 쓰기", href: "../hanja/" }
    ]
  };
})(typeof window !== "undefined" ? window : this);
