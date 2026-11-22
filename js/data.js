/* 킹링고 — 학습 콘텐츠 데이터
 * 영어 · 중국어 각 14개 주제(하루 1주제, 4개 수업)
 * 중국어 문장은 간체자(text) · 병음(pinyin) · 한국어 뜻(ko) · 발음 팁(tip) · 단어 블록(w)을 가집니다.
 */
(function (global) {
  "use strict";

  var LESSONS = [
    { no: 1, key: "learn", title: "문장 익히기", short: "익히기", desc: "듣고 뜻 확인", emoji: "📖", tone: "blue", xp: 10 },
    { no: 2, key: "build", title: "문장 만들기", short: "만들기", desc: "단어 블록 순서", emoji: "🧩", tone: "purple", xp: 10 },
    { no: 3, key: "quiz", title: "듣기 퀴즈", short: "퀴즈", desc: "듣고 뜻 고르기", emoji: "🎧", tone: "orange", xp: 10 },
    { no: 4, key: "speak", title: "말하기", short: "말하기", desc: "따라 말하기", emoji: "🎤", tone: "green", xp: 10 }
  ];

  var EN_UNITS = [
    {
      id: "en-01", no: 1, title: "인사", emoji: "👋",
      goal: "처음 만난 사람에게 인사하고 안부를 물어봐요",
      sentences: [
        { id: "en-01-1", text: "Hello! Nice to meet you.", ko: "안녕하세요! 만나서 반가워요.", tip: "Nice to meet you는 '나이스투미츄'처럼 한 덩어리로 이어서 말해요." },
        { id: "en-01-2", text: "Good morning, how are you?", ko: "좋은 아침이에요, 어떻게 지내세요?", tip: "how are you?는 '하우아유'처럼 are you를 붙여요." },
        { id: "en-01-3", text: "I'm fine, thank you.", ko: "잘 지내요, 고마워요.", tip: "thank you의 th는 혀끝을 살짝 물고 '쌩큐'에 가깝게." },
        { id: "en-01-4", text: "See you tomorrow!", ko: "내일 봐요!", tip: "See you는 '씨유'로 빠르게 붙여요." },
        { id: "en-01-5", text: "Have a nice day!", ko: "좋은 하루 보내세요!", tip: "Have a는 '해버'처럼 가볍게 이어져요." }
      ]
    },
    {
      id: "en-02", no: 2, title: "자기소개", emoji: "🙋",
      goal: "이름과 사는 곳, 좋아하는 것을 말해요",
      sentences: [
        { id: "en-02-1", text: "My name is Seungwoo.", ko: "제 이름은 승우예요.", tip: "My name is는 '마이네임이즈'로 붙여 말해요." },
        { id: "en-02-2", text: "I am from Korea.", ko: "저는 한국에서 왔어요.", tip: "from Korea는 '프럼코리아'로 자연스럽게 이어요." },
        { id: "en-02-3", text: "I work at a company.", ko: "저는 회사에서 일해요.", tip: "work at a는 '워커러'처럼 부드럽게 연결돼요." },
        { id: "en-02-4", text: "I like coffee and music.", ko: "저는 커피와 음악을 좋아해요.", tip: "and는 '앤'보다 '언'에 가깝게 약하게." },
        { id: "en-02-5", text: "Nice to meet you all.", ko: "모두 만나서 반가워요.", tip: "meet you all은 '미츄얼'처럼 붙여요." }
      ]
    },
    {
      id: "en-03", no: 3, title: "카페에서", emoji: "☕",
      goal: "카페에서 주문하고 계산해요",
      sentences: [
        { id: "en-03-1", text: "Can I get an iced Americano?", ko: "아이스 아메리카노 한 잔 주세요.", tip: "Can I는 '캐나이'처럼 붙이고 끝을 살짝 올려요." },
        { id: "en-03-2", text: "How much is this?", ko: "이거 얼마예요?", tip: "How much is this?는 '하우머치디스'로 이어요." },
        { id: "en-03-3", text: "For here, please.", ko: "여기서 먹을게요.", tip: "For here는 '포히어'로 또박또박." },
        { id: "en-03-4", text: "Can I have a receipt?", ko: "영수증 주시겠어요?", tip: "receipt의 p는 소리 내지 않아요. '리시트'." },
        { id: "en-03-5", text: "It's delicious!", ko: "맛있어요!", tip: "delicious는 '딜리셔스', 강세는 두 번째 음절." }
      ]
    },
    {
      id: "en-04", no: 4, title: "식당에서", emoji: "🍜",
      goal: "자리를 잡고 메뉴를 주문해요",
      sentences: [
        { id: "en-04-1", text: "Do you have a table for two?", ko: "두 명 자리 있나요?", tip: "Do you는 '두유'로 빠르게 붙여요." },
        { id: "en-04-2", text: "Can I see the menu?", ko: "메뉴판 좀 볼 수 있을까요?", tip: "see the는 '씨더'로 이어요." },
        { id: "en-04-3", text: "I'd like this one, please.", ko: "이걸로 주세요.", tip: "I'd like는 '아이드라이크'로 한 번에." },
        { id: "en-04-4", text: "Not too spicy, please.", ko: "너무 맵지 않게 해주세요.", tip: "spicy는 '스파이시', p를 살짝 넣어요." },
        { id: "en-04-5", text: "Check, please.", ko: "계산해 주세요.", tip: "Check, please는 두 단어를 또렷하게." }
      ]
    },
    {
      id: "en-05", no: 5, title: "길 묻기", emoji: "🗺️",
      goal: "길을 묻고 방향을 알아들어요",
      sentences: [
        { id: "en-05-1", text: "Excuse me, where is the station?", ko: "실례합니다, 역이 어디예요?", tip: "Excuse me는 '익스큐즈미', 끝을 올려 물어요." },
        { id: "en-05-2", text: "Is it far from here?", ko: "여기서 먼가요?", tip: "far from here는 '파프럼히어'로 이어요." },
        { id: "en-05-3", text: "Go straight and turn left.", ko: "직진해서 왼쪽으로 도세요.", tip: "straight의 gh는 소리 나지 않아요. '스트레이트'." },
        { id: "en-05-4", text: "It's about five minutes on foot.", ko: "걸어서 5분쯤 걸려요.", tip: "minutes on foot은 '미닛츠온풋'으로 붙여요." },
        { id: "en-05-5", text: "Thank you for your help.", ko: "도와주셔서 고마워요.", tip: "for your는 '포유어'로 부드럽게." }
      ]
    },
    {
      id: "en-06", no: 6, title: "쇼핑", emoji: "🛍️",
      goal: "가격과 사이즈를 물어보고 계산해요",
      sentences: [
        { id: "en-06-1", text: "How much is this shirt?", ko: "이 셔츠 얼마예요?", tip: "shirt의 ir는 '어'에 가깝게, '셔트'." },
        { id: "en-06-2", text: "Do you have a bigger size?", ko: "더 큰 사이즈 있나요?", tip: "bigger size는 '비거사이즈'로 이어요." },
        { id: "en-06-3", text: "Can I try it on?", ko: "입어봐도 될까요?", tip: "try it on은 '트라이이턴'으로 붙여요." },
        { id: "en-06-4", text: "I'll take this one.", ko: "이걸로 할게요.", tip: "I'll은 '아일'로 짧게." },
        { id: "en-06-5", text: "Can I pay by card?", ko: "카드로 계산할 수 있나요?", tip: "pay by는 '페이바이', by를 약하게." }
      ]
    },
    {
      id: "en-07", no: 7, title: "하루 일과", emoji: "⏰",
      goal: "내 하루를 순서대로 말해요",
      sentences: [
        { id: "en-07-1", text: "I wake up at seven.", ko: "저는 7시에 일어나요.", tip: "wake up at은 '웨이컵앳'처럼 이어요." },
        { id: "en-07-2", text: "I go to work by subway.", ko: "지하철로 출근해요.", tip: "by subway는 '바이서브웨이', 강세는 서브." },
        { id: "en-07-3", text: "I have lunch at noon.", ko: "정오에 점심을 먹어요.", tip: "have lunch는 '해브런치'로 붙여요." },
        { id: "en-07-4", text: "I come home around six.", ko: "6시쯤 집에 와요.", tip: "around six는 '어라운드식스', d를 약하게." },
        { id: "en-07-5", text: "I go to bed before eleven.", ko: "11시 전에 자요.", tip: "before eleven은 '비포일레븐'으로 이어요." }
      ]
    },
    {
      id: "en-08", no: 8, title: "날씨", emoji: "🌤️",
      goal: "오늘과 내일 날씨를 이야기해요",
      sentences: [
        { id: "en-08-1", text: "It's sunny today.", ko: "오늘은 맑아요.", tip: "sunny는 '써니', today는 '투데이'." },
        { id: "en-08-2", text: "It's going to rain tomorrow.", ko: "내일은 비가 올 거예요.", tip: "going to는 회화에서 '고나'처럼 줄어요." },
        { id: "en-08-3", text: "It's very cold outside.", ko: "밖이 아주 추워요.", tip: "cold outside는 '콜다웃사이드'로 붙여요." },
        { id: "en-08-4", text: "Take an umbrella with you.", ko: "우산 꼭 챙기세요.", tip: "an umbrella는 '언엄브렐라'로 이어요." },
        { id: "en-08-5", text: "The air is really clean today.", ko: "오늘 공기가 정말 깨끗해요.", tip: "really clean은 '릴리클린'처럼 부드럽게." }
      ]
    },
    {
      id: "en-09", no: 9, title: "취미", emoji: "🎸",
      goal: "좋아하는 것과 주말 계획을 말해요",
      sentences: [
        { id: "en-09-1", text: "I like listening to music.", ko: "저는 음악 듣는 걸 좋아해요.", tip: "listening to는 '리슨잉투'로 이어요." },
        { id: "en-09-2", text: "I play the guitar on weekends.", ko: "주말에는 기타를 쳐요.", tip: "play the guitar는 '플레이더기타'로 붙여요." },
        { id: "en-09-3", text: "Do you like sports?", ko: "운동 좋아하세요?", tip: "sports의 끝 s를 살짝 넣어요." },
        { id: "en-09-4", text: "I usually walk in the park.", ko: "보통 공원에서 산책해요.", tip: "usually는 '유주얼리', 세 음절." },
        { id: "en-09-5", text: "That sounds fun!", ko: "재미있겠네요!", tip: "sounds fun은 '사운즈펀'으로 붙여요." }
      ]
    },
    {
      id: "en-10", no: 10, title: "전화와 약속", emoji: "📞",
      goal: "전화로 약속을 잡고 미뤄요",
      sentences: [
        { id: "en-10-1", text: "Hello, this is Seungwoo.", ko: "여보세요, 승우입니다.", tip: "전화에서는 this is로 나를 소개해요." },
        { id: "en-10-2", text: "Are you free this evening?", ko: "오늘 저녁 시간 있어요?", tip: "this evening은 '디스이브닝', 끝을 올려요." },
        { id: "en-10-3", text: "Let's meet at six.", ko: "6시에 만나요.", tip: "Let's meet은 '렛츠미트'로 한 번에." },
        { id: "en-10-4", text: "I'll be there a little late.", ko: "조금 늦을 것 같아요.", tip: "a little late는 '얼리틀레이트'로 이어요." },
        { id: "en-10-5", text: "Can you call me back?", ko: "다시 전화해 주시겠어요?", tip: "call me back은 '콜미백'으로 붙여요." }
      ]
    },
    {
      id: "en-11", no: 11, title: "감정과 상태", emoji: "😊",
      goal: "내 기분과 상태를 솔직하게 말해요",
      sentences: [
        { id: "en-11-1", text: "I'm really happy today.", ko: "오늘 정말 행복해요.", tip: "I'm은 '아임'으로 짧게, happy는 '해피'." },
        { id: "en-11-2", text: "I'm a little tired.", ko: "조금 피곤해요.", tip: "tired는 '타이어드', 두 음절로." },
        { id: "en-11-3", text: "Don't worry about it.", ko: "걱정하지 마세요.", tip: "Don't worry는 '돈워리'로 붙여요." },
        { id: "en-11-4", text: "I'm so excited!", ko: "너무 신나요!", tip: "excited는 '익사이티드', 강세는 사이." },
        { id: "en-11-5", text: "That makes me feel good.", ko: "그건 기분이 좋아져요.", tip: "makes me는 '메익스미'로 이어요." }
      ]
    },
    {
      id: "en-12", no: 12, title: "가족과 친구", emoji: "👨‍👩‍👧",
      goal: "가족과 친구를 소개해요",
      sentences: [
        { id: "en-12-1", text: "This is my family photo.", ko: "이건 우리 가족 사진이에요.", tip: "family photo는 '패밀리포토', ph는 'f' 소리." },
        { id: "en-12-2", text: "I have one older sister.", ko: "저는 누나가 한 명 있어요.", tip: "older sister는 '올더시스터'로 이어요." },
        { id: "en-12-3", text: "My parents live in Busan.", ko: "부모님은 부산에 사세요.", tip: "parents는 '페어런츠', t를 살짝." },
        { id: "en-12-4", text: "We meet every Sunday.", ko: "우리는 매주 일요일에 만나요.", tip: "every Sunday는 '에브리선데이'로 붙여요." },
        { id: "en-12-5", text: "My friend is very kind.", ko: "제 친구는 아주 친절해요.", tip: "kind의 k를 살짝 터뜨려요." }
      ]
    },
    {
      id: "en-13", no: 13, title: "여행", emoji: "✈️",
      goal: "공항과 호텔에서 필요한 말을 해요",
      sentences: [
        { id: "en-13-1", text: "Where is the airport bus?", ko: "공항 버스는 어디예요?", tip: "airport는 '에어포트', 두 단어처럼 또박또박." },
        { id: "en-13-2", text: "I'd like to check in.", ko: "체크인하고 싶어요.", tip: "check in은 '체크인'으로 붙여요." },
        { id: "en-13-3", text: "How long does it take?", ko: "얼마나 걸려요?", tip: "does it은 '더짓'처럼 빠르게." },
        { id: "en-13-4", text: "Can I have a window seat?", ko: "창가 자리로 주시겠어요?", tip: "window는 '윈도우', d를 약하게." },
        { id: "en-13-5", text: "I'm here for three days.", ko: "3일 동안 여기 있어요.", tip: "for three days는 '포쓰리데이즈'로 이어요." }
      ]
    },
    {
      id: "en-14", no: 14, title: "숫자와 시간", emoji: "🔢",
      goal: "시간과 가격을 숫자로 말해요",
      sentences: [
        { id: "en-14-1", text: "What time is it now?", ko: "지금 몇 시예요?", tip: "What time is it은 '왓타임이짓'으로 붙여요." },
        { id: "en-14-2", text: "It's half past three.", ko: "3시 30분이에요.", tip: "half past는 '해프패스트'로 이어요." },
        { id: "en-14-3", text: "It costs twenty dollars.", ko: "20달러예요.", tip: "twenty는 '트웬티', t 두 번을 살려요." },
        { id: "en-14-4", text: "I need ten more minutes.", ko: "10분만 더 필요해요.", tip: "ten more는 '텐모어'로 붙여요." },
        { id: "en-14-5", text: "Let's meet in an hour.", ko: "한 시간 뒤에 만나요.", tip: "in an hour는 '인어나워'처럼 이어요." }
      ]
    }
  ];

  var ZH_UNITS = [
    {
      id: "zh-01", no: 1, title: "인사", emoji: "👋",
      goal: "중국어로 인사하고 안부를 물어봐요",
      sentences: [
        { id: "zh-01-1", text: "你好！很高兴认识你。", pinyin: "nǐ hǎo! hěn gāo xìng rèn shi nǐ.", ko: "안녕하세요! 만나서 반가워요.", w: ["你好！", "很高兴", "认识", "你。"], tip: "你好는 3성 두 개라 앞의 nǐ를 2성처럼 올려 '니 하오'." },
        { id: "zh-01-2", text: "早上好，你好吗？", pinyin: "zǎo shang hǎo, nǐ hǎo ma?", ko: "좋은 아침이에요, 잘 지내세요?", w: ["早上好，", "你好", "吗？"], tip: "早上의 shang은 가볍게, 吗？는 끝을 올려요." },
        { id: "zh-01-3", text: "我很好，谢谢你。", pinyin: "wǒ hěn hǎo, xiè xie nǐ.", ko: "잘 지내요, 고마워요.", w: ["我", "很好，", "谢谢", "你。"], tip: "谢谢는 '시에시에'보다 '시에셰'에 가깝게." },
        { id: "zh-01-4", text: "明天见！", pinyin: "míng tiān jiàn!", ko: "내일 봐요!", w: ["明天", "见！"], tip: "见은 '찌엔', 한국어 '견'보다 혀를 앞에." },
        { id: "zh-01-5", text: "祝你今天愉快！", pinyin: "zhù nǐ jīn tiān yú kuài!", ko: "좋은 하루 보내세요!", w: ["祝", "你", "今天", "愉快！"], tip: "愉快의 ü는 입술을 오므려 '위', kuài는 '콰이'." }
      ]
    },
    {
      id: "zh-02", no: 2, title: "자기소개", emoji: "🙋",
      goal: "이름과 나라, 좋아하는 것을 말해요",
      sentences: [
        { id: "zh-02-1", text: "我叫胜宇。", pinyin: "wǒ jiào shèng yǔ.", ko: "제 이름은 승우예요.", w: ["我", "叫", "胜宇。"], tip: "叫는 '쟈오', 胜宇는 중국식으로 'Shèngyǔ(성위)'." },
        { id: "zh-02-2", text: "我是韩国人。", pinyin: "wǒ shì hán guó rén.", ko: "저는 한국 사람이에요.", w: ["我", "是", "韩国人。"], tip: "是는 '스'보다 '쓰'에 가깝게 짧게." },
        { id: "zh-02-3", text: "我在公司工作。", pinyin: "wǒ zài gōng sī gōng zuò.", ko: "저는 회사에서 일해요.", w: ["我", "在", "公司", "工作。"], tip: "作은 '쭤', zuò의 z는 'ㅉ'처럼." },
        { id: "zh-02-4", text: "我喜欢咖啡和音乐。", pinyin: "wǒ xǐ huan kā fēi hé yīn yuè.", ko: "저는 커피와 음악을 좋아해요.", w: ["我", "喜欢", "咖啡", "和", "音乐。"], tip: "喜欢의 huan은 가볍게 '환', 乐은 '위에'." },
        { id: "zh-02-5", text: "很高兴认识大家。", pinyin: "hěn gāo xìng rèn shi dà jiā.", ko: "모두 만나서 반가워요.", w: ["很高兴", "认识", "大家。"], tip: "认识의 shi는 '스'처럼 약하고 짧게." }
      ]
    },
    {
      id: "zh-03", no: 3, title: "카페에서", emoji: "☕",
      goal: "카페에서 음료를 주문해요",
      sentences: [
        { id: "zh-03-1", text: "我要一杯冰美式。", pinyin: "wǒ yào yì bēi bīng měi shì.", ko: "아이스 아메리카노 한 잔 주세요.", w: ["我", "要", "一杯", "冰美式。"], tip: "一杯는 '이뻬이'처럼 붙여요. 冰은 '삥'." },
        { id: "zh-03-2", text: "这个多少钱？", pinyin: "zhè ge duō shao qián?", ko: "이거 얼마예요?", w: ["这个", "多少钱？"], tip: "这个은 '쩌거', 少는 가볍게 '샤오'." },
        { id: "zh-03-3", text: "在这儿吃。", pinyin: "zài zhèr chī.", ko: "여기서 먹을게요.", w: ["在", "这儿", "吃。"], tip: "这儿는 '쩌르', 혀를 말아 r 소리를 살짝." },
        { id: "zh-03-4", text: "请给我收据。", pinyin: "qǐng gěi wǒ shōu jù.", ko: "영수증 주세요.", w: ["请", "给", "我", "收据。"], tip: "请은 '칭', q는 '치'에 가깝게." },
        { id: "zh-03-5", text: "很好吃！", pinyin: "hěn hǎo chī!", ko: "맛있어요!", w: ["很", "好吃！"], tip: "好吃는 '하오츠', ch는 혀를 뒤로." }
      ]
    },
    {
      id: "zh-04", no: 4, title: "식당에서", emoji: "🍜",
      goal: "자리를 잡고 음식을 주문해요",
      sentences: [
        { id: "zh-04-1", text: "有两人位吗？", pinyin: "yǒu liǎng rén wèi ma?", ko: "두 명 자리 있나요?", w: ["有", "两人位", "吗？"], tip: "两은 '리앙', 位는 '웨이'." },
        { id: "zh-04-2", text: "可以看一下菜单吗？", pinyin: "kě yǐ kàn yí xià cài dān ma?", ko: "메뉴판 좀 볼 수 있을까요?", w: ["可以", "看一下", "菜单", "吗？"], tip: "可以는 '커이', 菜单은 '차이딴'." },
        { id: "zh-04-3", text: "我要这个。", pinyin: "wǒ yào zhè ge.", ko: "이걸로 주세요.", w: ["我", "要", "这个。"], tip: "要는 '야오', 4성이라 짧게 내려요." },
        { id: "zh-04-4", text: "请不要太辣。", pinyin: "qǐng bú yào tài là.", ko: "너무 맵지 않게 해주세요.", w: ["请", "不要", "太辣。"], tip: "不는 뒤에 4성이 오면 2성 '부'로 읽어요." },
        { id: "zh-04-5", text: "请结账。", pinyin: "qǐng jié zhàng.", ko: "계산해 주세요.", w: ["请", "结账。"], tip: "结账은 '지에장', zh는 혀를 뒤로." }
      ]
    },
    {
      id: "zh-05", no: 5, title: "길 묻기", emoji: "🗺️",
      goal: "길을 묻고 방향을 알아들어요",
      sentences: [
        { id: "zh-05-1", text: "请问，车站在哪儿？", pinyin: "qǐng wèn, chē zhàn zài nǎr?", ko: "실례합니다, 역이 어디예요?", w: ["请问，", "车站", "在", "哪儿？"], tip: "请问은 '칭원', 车站은 '처잔'." },
        { id: "zh-05-2", text: "离这儿远吗？", pinyin: "lí zhèr yuǎn ma?", ko: "여기서 먼가요?", w: ["离", "这儿", "远", "吗？"], tip: "远은 '위엔', ü 발음은 입술을 오므려요." },
        { id: "zh-05-3", text: "一直走，然后左转。", pinyin: "yì zhí zǒu, rán hòu zuǒ zhuǎn.", ko: "직진해서 왼쪽으로 도세요.", w: ["一直", "走，", "然后", "左转。"], tip: "左转은 '쭤좐', 转의 zhuan은 '좐'." },
        { id: "zh-05-4", text: "走路大概五分钟。", pinyin: "zǒu lù dà gài wǔ fēn zhōng.", ko: "걸어서 5분쯤 걸려요.", w: ["走路", "大概", "五分钟。"], tip: "五分钟은 '우펀종', 钟은 '종'." },
        { id: "zh-05-5", text: "谢谢你的帮助。", pinyin: "xiè xie nǐ de bāng zhù.", ko: "도와주셔서 고마워요.", w: ["谢谢", "你", "的", "帮助。"], tip: "帮助는 '빵주', bāng은 코로 살짝 울려요." }
      ]
    },
    {
      id: "zh-06", no: 6, title: "쇼핑", emoji: "🛍️",
      goal: "가격과 사이즈를 묻고 계산해요",
      sentences: [
        { id: "zh-06-1", text: "这件衬衫多少钱？", pinyin: "zhè jiàn chèn shān duō shao qián?", ko: "이 셔츠 얼마예요?", w: ["这件", "衬衫", "多少钱？"], tip: "衬衫은 '천산', ch는 혀를 뒤로." },
        { id: "zh-06-2", text: "有大一号的吗？", pinyin: "yǒu dà yí hào de ma?", ko: "더 큰 사이즈 있나요?", w: ["有", "大一号", "的", "吗？"], tip: "大는 '다', 一号는 '이하오'." },
        { id: "zh-06-3", text: "可以试穿吗？", pinyin: "kě yǐ shì chuān ma?", ko: "입어봐도 될까요?", w: ["可以", "试穿", "吗？"], tip: "试穿은 '스촨', chuān은 '촨'." },
        { id: "zh-06-4", text: "我要这个。", pinyin: "wǒ yào zhè ge.", ko: "이걸로 할게요.", w: ["我", "要", "这个。"], tip: "这个은 '쩌거'로 빠르게." },
        { id: "zh-06-5", text: "可以刷卡吗？", pinyin: "kě yǐ shuā kǎ ma?", ko: "카드로 계산할 수 있나요?", w: ["可以", "刷卡", "吗？"], tip: "刷卡은 '솨카', shuā는 '솨'." }
      ]
    },
    {
      id: "zh-07", no: 7, title: "하루 일과", emoji: "⏰",
      goal: "내 하루를 시간 순서로 말해요",
      sentences: [
        { id: "zh-07-1", text: "我七点起床。", pinyin: "wǒ qī diǎn qǐ chuáng.", ko: "저는 7시에 일어나요.", w: ["我", "七点", "起床。"], tip: "七은 '치', 起床은 '치촹'." },
        { id: "zh-07-2", text: "我坐地铁上班。", pinyin: "wǒ zuò dì tiě shàng bān.", ko: "지하철로 출근해요.", w: ["我", "坐", "地铁", "上班。"], tip: "地铁은 '디티에', 上班은 '상반'." },
        { id: "zh-07-3", text: "我中午吃午饭。", pinyin: "wǒ zhōng wǔ chī wǔ fàn.", ko: "정오에 점심을 먹어요.", w: ["我", "中午", "吃", "午饭。"], tip: "中午는 '중우', 午饭은 '우판'." },
        { id: "zh-07-4", text: "我六点左右回家。", pinyin: "wǒ liù diǎn zuǒ yòu huí jiā.", ko: "6시쯤 집에 와요.", w: ["我", "六点", "左右", "回家。"], tip: "左右는 '쭤여우', 回家는 '후이지아'." },
        { id: "zh-07-5", text: "我十一点前睡觉。", pinyin: "wǒ shí yī diǎn qián shuì jiào.", ko: "11시 전에 자요.", w: ["我", "十一点", "前", "睡觉。"], tip: "睡觉는 '쉐이지아오', shuì는 '쉐이'." }
      ]
    },
    {
      id: "zh-08", no: 8, title: "날씨", emoji: "🌤️",
      goal: "오늘과 내일 날씨를 이야기해요",
      sentences: [
        { id: "zh-08-1", text: "今天天气很好。", pinyin: "jīn tiān tiān qì hěn hǎo.", ko: "오늘 날씨가 좋아요.", w: ["今天", "天气", "很好。"], tip: "天气는 '티엔치', q는 '치'." },
        { id: "zh-08-2", text: "明天会下雨。", pinyin: "míng tiān huì xià yǔ.", ko: "내일 비가 올 거예요.", w: ["明天", "会", "下雨。"], tip: "下雨는 '시아위', 雨는 '위'." },
        { id: "zh-08-3", text: "外面很冷。", pinyin: "wài miàn hěn lěng.", ko: "밖이 아주 추워요.", w: ["外面", "很冷。"], tip: "冷은 '렁', 끝의 ng를 코로 울려요." },
        { id: "zh-08-4", text: "记得带伞。", pinyin: "jì de dài sǎn.", ko: "우산 꼭 챙기세요.", w: ["记得", "带伞。"], tip: "记得는 '지더', 伞은 '싼'." },
        { id: "zh-08-5", text: "今天空气很干净。", pinyin: "jīn tiān kōng qì hěn gān jìng.", ko: "오늘 공기가 정말 깨끗해요.", w: ["今天", "空气", "很", "干净。"], tip: "空气는 '콩치', 干净은 '간찡'." }
      ]
    },
    {
      id: "zh-09", no: 9, title: "취미", emoji: "🎸",
      goal: "좋아하는 것과 주말 계획을 말해요",
      sentences: [
        { id: "zh-09-1", text: "我喜欢听音乐。", pinyin: "wǒ xǐ huan tīng yīn yuè.", ko: "저는 음악 듣는 걸 좋아해요.", w: ["我", "喜欢", "听", "音乐。"], tip: "听은 '팅', 音乐은 '인위에'." },
        { id: "zh-09-2", text: "周末我弹吉他。", pinyin: "zhōu mò wǒ tán jí tā.", ko: "주말에는 기타를 쳐요.", w: ["周末", "我", "弹", "吉他。"], tip: "弹은 '탄', 吉他은 '지타'." },
        { id: "zh-09-3", text: "你喜欢运动吗？", pinyin: "nǐ xǐ huan yùn dòng ma?", ko: "운동 좋아하세요?", w: ["你", "喜欢", "运动", "吗？"], tip: "运动은 '윈동', yùn은 '윈'." },
        { id: "zh-09-4", text: "我常常在公园散步。", pinyin: "wǒ cháng cháng zài gōng yuán sàn bù.", ko: "보통 공원에서 산책해요.", w: ["我", "常常", "在", "公园", "散步。"], tip: "散步는 '산뿌', 公园은 '공위엔'." },
        { id: "zh-09-5", text: "听起来很有意思！", pinyin: "tīng qǐ lai hěn yǒu yì si!", ko: "재미있겠네요!", w: ["听起来", "很", "有意思！"], tip: "起来는 '치라이'로 가볍게, 意思는 '이스'." }
      ]
    },
    {
      id: "zh-10", no: 10, title: "전화와 약속", emoji: "📞",
      goal: "전화로 약속을 잡고 미뤄요",
      sentences: [
        { id: "zh-10-1", text: "喂，我是胜宇。", pinyin: "wèi, wǒ shì shèng yǔ.", ko: "여보세요, 승우입니다.", w: ["喂，", "我", "是", "胜宇。"], tip: "전화의 喂는 '웨이'로 길게, 4성." },
        { id: "zh-10-2", text: "你今天晚上有空吗？", pinyin: "nǐ jīn tiān wǎn shang yǒu kòng ma?", ko: "오늘 저녁 시간 있어요?", w: ["你", "今天", "晚上", "有空", "吗？"], tip: "有空은 '요콩', kòng은 4성으로 내려요." },
        { id: "zh-10-3", text: "我们六点见吧。", pinyin: "wǒ men liù diǎn jiàn ba.", ko: "6시에 만나요.", w: ["我们", "六点", "见", "吧。"], tip: "见은 '찌엔', 吧는 가볍게 '바'." },
        { id: "zh-10-4", text: "我会晚一点到。", pinyin: "wǒ huì wǎn yì diǎn dào.", ko: "조금 늦을 것 같아요.", w: ["我", "会", "晚一点", "到。"], tip: "晚은 '완', 到는 '따오'." },
        { id: "zh-10-5", text: "你能再打给我吗？", pinyin: "nǐ néng zài dǎ gěi wǒ ma?", ko: "다시 전화해 주시겠어요?", w: ["你", "能", "再", "打给", "我", "吗？"], tip: "能은 '넝', 再는 '짜이'." }
      ]
    },
    {
      id: "zh-11", no: 11, title: "감정과 상태", emoji: "😊",
      goal: "내 기분과 상태를 말해요",
      sentences: [
        { id: "zh-11-1", text: "我今天很开心。", pinyin: "wǒ jīn tiān hěn kāi xīn.", ko: "오늘 정말 행복해요.", w: ["我", "今天", "很", "开心。"], tip: "开心은 '카이신', 두 글자를 고르게." },
        { id: "zh-11-2", text: "我有点累。", pinyin: "wǒ yǒu diǎn lèi.", ko: "조금 피곤해요.", w: ["我", "有点", "累。"], tip: "累는 '레이', 有点은 '요디엔'." },
        { id: "zh-11-3", text: "别担心。", pinyin: "bié dān xīn.", ko: "걱정하지 마세요.", w: ["别", "担心。"], tip: "别은 '비에', 担心은 '단신'." },
        { id: "zh-11-4", text: "我太兴奋了！", pinyin: "wǒ tài xīng fèn le!", ko: "너무 신나요!", w: ["我", "太", "兴奋", "了！"], tip: "兴奋은 '싱펀', 太는 '타이'." },
        { id: "zh-11-5", text: "这让我感觉很好。", pinyin: "zhè ràng wǒ gǎn jué hěn hǎo.", ko: "그건 기분이 좋아져요.", w: ["这", "让", "我", "感觉", "很好。"], tip: "感觉는 '간쥐에', 让은 '랑'." }
      ]
    },
    {
      id: "zh-12", no: 12, title: "가족과 친구", emoji: "👨‍👩‍👧",
      goal: "가족과 친구를 소개해요",
      sentences: [
        { id: "zh-12-1", text: "这是我的全家福。", pinyin: "zhè shì wǒ de quán jiā fú.", ko: "이건 우리 가족 사진이에요.", w: ["这", "是", "我的", "全家福。"], tip: "全家福은 '취안지아푸', 福은 '푸'." },
        { id: "zh-12-2", text: "我有一个姐姐。", pinyin: "wǒ yǒu yí ge jiě jie.", ko: "저는 누나가 한 명 있어요.", w: ["我", "有", "一个", "姐姐。"], tip: "姐姐은 '지에지에', 첫 글자만 강하게." },
        { id: "zh-12-3", text: "我父母住在釜山。", pinyin: "wǒ fù mǔ zhù zài fǔ shān.", ko: "부모님은 부산에 사세요.", w: ["我", "父母", "住在", "釜山。"], tip: "父母는 '푸무', 住는 '주'." },
        { id: "zh-12-4", text: "我们每个星期天见面。", pinyin: "wǒ men měi ge xīng qī tiān jiàn miàn.", ko: "우리는 매주 일요일에 만나요.", w: ["我们", "每个", "星期天", "见面。"], tip: "星期은 '싱치', 见面은 '지엔미엔'." },
        { id: "zh-12-5", text: "我的朋友很热情。", pinyin: "wǒ de péng you hěn rè qíng.", ko: "제 친구는 아주 친절해요.", w: ["我的", "朋友", "很", "热情。"], tip: "朋友는 '펑여우', 热情은 '러칭'." }
      ]
    },
    {
      id: "zh-13", no: 13, title: "여행", emoji: "✈️",
      goal: "공항과 호텔에서 필요한 말을 해요",
      sentences: [
        { id: "zh-13-1", text: "机场大巴在哪儿？", pinyin: "jī chǎng dà bā zài nǎr?", ko: "공항 버스는 어디예요?", w: ["机场", "大巴", "在", "哪儿？"], tip: "机场은 '지창', 大巴는 '따바'." },
        { id: "zh-13-2", text: "我想办入住。", pinyin: "wǒ xiǎng bàn rù zhù.", ko: "체크인하고 싶어요.", w: ["我", "想", "办", "入住。"], tip: "入住는 '루주', rù는 '루'." },
        { id: "zh-13-3", text: "要多久？", pinyin: "yào duō jiǔ?", ko: "얼마나 걸려요?", w: ["要", "多久？"], tip: "多久는 '뚜어지우', 久는 3성으로 내렸다 올려요." },
        { id: "zh-13-4", text: "可以给我靠窗的座位吗？", pinyin: "kě yǐ gěi wǒ kào chuāng de zuò wèi ma?", ko: "창가 자리로 주시겠어요?", w: ["可以", "给", "我", "靠窗的", "座位", "吗？"], tip: "靠窗은 '카오촹', 座位는 '쭤웨이'." },
        { id: "zh-13-5", text: "我在这里待三天。", pinyin: "wǒ zài zhè lǐ dāi sān tiān.", ko: "3일 동안 여기 있어요.", w: ["我", "在", "这里", "待", "三天。"], tip: "待는 '다이', 这里는 '쩌리'." }
      ]
    },
    {
      id: "zh-14", no: 14, title: "숫자와 시간", emoji: "🔢",
      goal: "시간과 가격을 숫자로 말해요",
      sentences: [
        { id: "zh-14-1", text: "现在几点？", pinyin: "xiàn zài jǐ diǎn?", ko: "지금 몇 시예요?", w: ["现在", "几点？"], tip: "现在는 '시엔짜이', 几는 '지'." },
        { id: "zh-14-2", text: "三点半。", pinyin: "sān diǎn bàn.", ko: "3시 30분이에요.", w: ["三点半。"], tip: "半은 '반', 三은 '싼'." },
        { id: "zh-14-3", text: "这个二十美元。", pinyin: "zhè ge èr shí měi yuán.", ko: "이거 20달러예요.", w: ["这个", "二十", "美元。"], tip: "二十는 '얼스', 美元은 '메이위엔'." },
        { id: "zh-14-4", text: "我还需要十分钟。", pinyin: "wǒ hái xū yào shí fēn zhōng.", ko: "10분만 더 필요해요.", w: ["我", "还", "需要", "十分钟。"], tip: "需要는 '쉬야오', xū는 '쉬'." },
        { id: "zh-14-5", text: "我们一小时后见。", pinyin: "wǒ men yì xiǎo shí hòu jiàn.", ko: "한 시간 뒤에 만나요.", w: ["我们", "一小时", "后见。"], tip: "小时는 '샤오스', 后는 '허우'." }
      ]
    }
  ];

  global.KING_DATA = {
    version: 3,
    appName: "킹링고",
    dailyGoal: 30,
    lessons: LESSONS,
    courses: {
      en: {
        code: "en",
        name: "영어",
        native: "English",
        locale: "en-US",
        flag: "🇺🇸",
        accent: "#1cb0f6",
        tipLabel: "발음 팁",
        units: EN_UNITS
      },
      zh: {
        code: "zh",
        name: "중국어",
        native: "中文",
        locale: "zh-CN",
        flag: "🇨🇳",
        accent: "#ff9600",
        tipLabel: "발음 팁",
        units: ZH_UNITS
      }
    }
  };
})(typeof window !== "undefined" ? window : this);
