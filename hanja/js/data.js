/* 킹한자 — 기초 한자 14단원 × 5자 (70자)
 * 한자 · 훈과 음 · 뜻 · 부수 · 획수 · 예시 낱말
 */
(function (global) {
  "use strict";

  var HANJA_UNITS = [
    {
      id: "hanja-01", no: 1, title: "숫자", emoji: "🔢",
      goal: "한자로 수를 세고 읽어요",
      items: [
        { id: "hanja-01-1", text: "一", read: "한 일", hun: "한", eum: "일", ko: "하나", radical: "一", strokes: 1, tip: "가로획 하나. '하나'를 뜻하고 부수도 一이에요.", ex: ["일등", "일주일", "통일"] },
        { id: "hanja-01-2", text: "二", read: "두 이", hun: "두", eum: "이", ko: "둘", radical: "二", strokes: 2, tip: "가로획 두 개. 一 위에 하나를 더 그어요.", ex: ["이층", "이중", "십이"] },
        { id: "hanja-01-3", text: "三", read: "석 삼", hun: "석", eum: "삼", ko: "셋", radical: "一", strokes: 3, tip: "가로획 세 개. 一二三 순서로 익혀요.", ex: ["삼각형", "삼일절", "삼겹살"] },
        { id: "hanja-01-4", text: "十", read: "열 십", hun: "열", eum: "십", ko: "열", radical: "十", strokes: 2, tip: "가로와 세로가 만나는 모양. 10을 뜻해요.", ex: ["십분", "십이월", "수십"] },
        { id: "hanja-01-5", text: "百", read: "일백 백", hun: "일백", eum: "백", ko: "백", radical: "白", strokes: 6, tip: "一 + 白(흰 백). 100을 뜻해요.", ex: ["백원", "백점", "오백"] }
      ]
    },
    {
      id: "hanja-02", no: 2, title: "자연", emoji: "🌿",
      goal: "산과 물, 불과 나무를 한자로 익혀요",
      items: [
        { id: "hanja-02-1", text: "山", read: "뫼 산", hun: "뫼", eum: "산", ko: "산", radical: "山", strokes: 3, tip: "산봉우리 세 개가 솟은 모양에서 왔어요.", ex: ["등산", "산속", "산맥"] },
        { id: "hanja-02-2", text: "水", read: "물 수", hun: "물", eum: "수", ko: "물", radical: "水", strokes: 4, tip: "물이 흐르는 모양. 왼쪽에 오면 氵로 줄어요.", ex: ["수영", "홍수", "수도"] },
        { id: "hanja-02-3", text: "火", read: "불 화", hun: "불", eum: "화", ko: "불", radical: "火", strokes: 4, tip: "불꽃이 타오르는 모양. 아래에 오면 灬가 돼요.", ex: ["화산", "화재", "소화"] },
        { id: "hanja-02-4", text: "木", read: "나무 목", hun: "나무", eum: "목", ko: "나무", radical: "木", strokes: 4, tip: "가지와 뿌리가 있는 나무 모양이에요.", ex: ["목재", "수목", "목공"] },
        { id: "hanja-02-5", text: "土", read: "흙 토", hun: "흙", eum: "토", ko: "흙", radical: "土", strokes: 3, tip: "땅 위에 흙이 쌓인 모양. 흙을 뜻해요.", ex: ["토양", "국토", "토기"] }
      ]
    },
    {
      id: "hanja-03", no: 3, title: "하늘과 날", emoji: "☀️",
      goal: "해와 달, 하늘과 날씨 한자를 익혀요",
      items: [
        { id: "hanja-03-1", text: "日", read: "날 일", hun: "날", eum: "일", ko: "해·날", radical: "日", strokes: 4, tip: "해가 둥글게 빛나는 모양. '날'이라는 뜻도 있어요.", ex: ["일요일", "매일", "일기"] },
        { id: "hanja-03-2", text: "月", read: "달 월", hun: "달", eum: "월", ko: "달", radical: "月", strokes: 4, tip: "초승달 모양에서 왔어요. 달과 월을 뜻해요.", ex: ["월요일", "정월", "월급"] },
        { id: "hanja-03-3", text: "天", read: "하늘 천", hun: "하늘", eum: "천", ko: "하늘", radical: "大", strokes: 4, tip: "사람(大) 위에 하늘이 있다는 모양이에요.", ex: ["천국", "천재", "하늘천"] },
        { id: "hanja-03-4", text: "雨", read: "비 우", hun: "비", eum: "우", ko: "비", radical: "雨", strokes: 8, tip: "하늘에서 빗방울이 떨어지는 모양이에요.", ex: ["우산", "강우", "우기"] },
        { id: "hanja-03-5", text: "雲", read: "구름 운", hun: "구름", eum: "운", ko: "구름", radical: "雨", strokes: 12, tip: "비(雨)를 머금은 구름. 위에 雨가 있어요.", ex: ["성운", "운무", "흑운"] }
      ]
    },
    {
      id: "hanja-04", no: 4, title: "사람", emoji: "🧑",
      goal: "사람과 크고 작음을 나타내는 한자를 익혀요",
      items: [
        { id: "hanja-04-1", text: "人", read: "사람 인", hun: "사람", eum: "인", ko: "사람", radical: "人", strokes: 2, tip: "사람이 서 있는 옆모습. 왼쪽에 오면 亻가 돼요.", ex: ["인구", "인기", "한국인"] },
        { id: "hanja-04-2", text: "大", read: "큰 대", hun: "큰", eum: "대", ko: "크다", radical: "大", strokes: 3, tip: "팔을 벌린 사람 모양. '크다'를 뜻해요.", ex: ["대문", "대학", "대형"] },
        { id: "hanja-04-3", text: "小", read: "작을 소", hun: "작을", eum: "소", ko: "작다", radical: "小", strokes: 3, tip: "작은 점 세 개 모양. '작다'를 뜻해요.", ex: ["소년", "소문", "축소"] },
        { id: "hanja-04-4", text: "子", read: "아들 자", hun: "아들", eum: "자", ko: "아이", radical: "子", strokes: 3, tip: "팔을 벌린 아기 모양. 아이를 뜻해요.", ex: ["자녀", "남자", "여자"] },
        { id: "hanja-04-5", text: "女", read: "계집 여", hun: "계집", eum: "여", ko: "여자", radical: "女", strokes: 3, tip: "여자가 앉아 있는 모양에서 왔어요.", ex: ["여자", "여성", "소녀"] }
      ]
    },
    {
      id: "hanja-05", no: 5, title: "몸", emoji: "👁️",
      goal: "눈과 입, 손과 발, 마음을 한자로 익혀요",
      items: [
        { id: "hanja-05-1", text: "目", read: "눈 목", hun: "눈", eum: "목", ko: "눈", radical: "目", strokes: 5, tip: "눈을 옆으로 세운 모양. 부수로 쓰여요.", ex: ["목표", "주목", "목록"] },
        { id: "hanja-05-2", text: "口", read: "입 구", hun: "입", eum: "구", ko: "입", radical: "口", strokes: 3, tip: "입을 벌린 네모 모양. 말하는 것과도 이어져요.", ex: ["입구", "인구", "식구"] },
        { id: "hanja-05-3", text: "手", read: "손 수", hun: "손", eum: "수", ko: "손", radical: "手", strokes: 4, tip: "손가락 다섯 개를 편 모양. 왼쪽에 오면 扌가 돼요.", ex: ["박수", "수첩", "악수"] },
        { id: "hanja-05-4", text: "足", read: "발 족", hun: "발", eum: "족", ko: "발", radical: "足", strokes: 7, tip: "발과 다리 모양. '충분하다'는 뜻도 있어요.", ex: ["족구", "부족", "만족"] },
        { id: "hanja-05-5", text: "心", read: "마음 심", hun: "마음", eum: "심", ko: "마음", radical: "心", strokes: 4, tip: "심장 모양에서 왔어요. 아래에 오면 忄가 돼요.", ex: ["중심", "관심", "안심"] }
      ]
    },
    {
      id: "hanja-06", no: 6, title: "가족", emoji: "👨‍👩‍👧",
      goal: "가족을 나타내는 한자를 익혀요",
      items: [
        { id: "hanja-06-1", text: "父", read: "아비 부", hun: "아비", eum: "부", ko: "아버지", radical: "父", strokes: 4, tip: "아버지가 지팡이를 짚은 모양에서 왔어요.", ex: ["부모", "부친", "부부"] },
        { id: "hanja-06-2", text: "母", read: "어미 모", hun: "어미", eum: "모", ko: "어머니", radical: "母", strokes: 5, tip: "아이를 품은 어머니 모양이에요.", ex: ["모친", "부모", "모성"] },
        { id: "hanja-06-3", text: "兄", read: "형 형", hun: "형", eum: "형", ko: "형", radical: "儿", strokes: 5, tip: "입(口)과 다리(儿)로 된 형의 모양이에요.", ex: ["형제", "형님", "의형제"] },
        { id: "hanja-06-4", text: "弟", read: "아우 제", hun: "아우", eum: "제", ko: "동생", radical: "弓", strokes: 7, tip: "형을 따라가는 아우의 모양에서 왔어요.", ex: ["형제", "제자", "매제"] },
        { id: "hanja-06-5", text: "家", read: "집 가", hun: "집", eum: "가", ko: "집", radical: "宀", strokes: 10, tip: "지붕(宀) 아래에 돼지(豕)가 있는 집이에요.", ex: ["가족", "국가", "가정"] }
      ]
    },
    {
      id: "hanja-07", no: 7, title: "방향", emoji: "🧭",
      goal: "위아래와 좌우를 한자로 익혀요",
      items: [
        { id: "hanja-07-1", text: "上", read: "위 상", hun: "위", eum: "상", ko: "위", radical: "一", strokes: 3, tip: "기준선 위에 표시를 한 모양. '위'를 뜻해요.", ex: ["상하", "지상", "상승"] },
        { id: "hanja-07-2", text: "下", read: "아래 하", hun: "아래", eum: "하", ko: "아래", radical: "一", strokes: 3, tip: "기준선 아래에 표시를 한 모양. '아래'를 뜻해요.", ex: ["지하", "하강", "하반기"] },
        { id: "hanja-07-3", text: "左", read: "왼 좌", hun: "왼", eum: "좌", ko: "왼쪽", radical: "工", strokes: 5, tip: "왼손으로 도구(工)를 잡은 모양이에요.", ex: ["좌우", "좌회전", "좌측"] },
        { id: "hanja-07-4", text: "右", read: "오른 우", hun: "오른", eum: "우", ko: "오른쪽", radical: "口", strokes: 5, tip: "오른손으로 입에 음식을 가져가는 모양이에요.", ex: ["우회전", "우측", "좌우"] },
        { id: "hanja-07-5", text: "中", read: "가운데 중", hun: "가운데", eum: "중", ko: "가운데", radical: "丨", strokes: 4, tip: "네모 가운데를 세로로 뚫은 모양이에요.", ex: ["중심", "중간", "중학교"] }
      ]
    },
    {
      id: "hanja-08", no: 8, title: "학교와 배움", emoji: "🏫",
      goal: "배움과 학교에 쓰는 한자를 익혀요",
      items: [
        { id: "hanja-08-1", text: "學", read: "배울 학", hun: "배울", eum: "학", ko: "배우다", radical: "子", strokes: 16, tip: "아이(子)가 집에서 배우는 모양이에요.", ex: ["학교", "학생", "유학"] },
        { id: "hanja-08-2", text: "校", read: "학교 교", hun: "학교", eum: "교", ko: "학교", radical: "木", strokes: 10, tip: "나무(木)로 지은 학교 건물에서 왔어요.", ex: ["학교", "교실", "교장"] },
        { id: "hanja-08-3", text: "書", read: "글 서", hun: "글", eum: "서", ko: "글·책", radical: "曰", strokes: 10, tip: "붓으로 글을 쓰는 모양. 책을 뜻해요.", ex: ["서점", "도서관", "서류"] },
        { id: "hanja-08-4", text: "讀", read: "읽을 독", hun: "읽을", eum: "독", ko: "읽다", radical: "言", strokes: 22, tip: "말(言)을 소리 내어 읽는 모양이에요.", ex: ["독서", "구독", "독해"] },
        { id: "hanja-08-5", text: "問", read: "물을 문", hun: "물을", eum: "문", ko: "묻다", radical: "口", strokes: 11, tip: "문(門) 안에서 입(口)으로 묻는 모양이에요.", ex: ["질문", "문제", "문답"] }
      ]
    },
    {
      id: "hanja-09", no: 9, title: "생활", emoji: "🍚",
      goal: "먹고 입고 사는 생활 한자를 익혀요",
      items: [
        { id: "hanja-09-1", text: "食", read: "먹을 식", hun: "먹을", eum: "식", ko: "밥·먹다", radical: "食", strokes: 9, tip: "음식이 담긴 그릇 모양에서 왔어요.", ex: ["음식", "식당", "식사"] },
        { id: "hanja-09-2", text: "衣", read: "옷 의", hun: "옷", eum: "의", ko: "옷", radical: "衣", strokes: 6, tip: "옷깃이 여며진 웃옷 모양이에요.", ex: ["의복", "의류", "의상"] },
        { id: "hanja-09-3", text: "住", read: "살 주", hun: "살", eum: "주", ko: "살다", radical: "人", strokes: 7, tip: "사람(亻)이 머무는(主) 곳, 사는 것을 뜻해요.", ex: ["주소", "거주", "주거"] },
        { id: "hanja-09-4", text: "行", read: "다닐 행", hun: "다닐", eum: "행", ko: "가다", radical: "行", strokes: 6, tip: "네거리에서 사람이 다니는 모양이에요.", ex: ["여행", "은행", "행진"] },
        { id: "hanja-09-5", text: "車", read: "수레 차", hun: "수레", eum: "차", ko: "차", radical: "車", strokes: 7, tip: "바퀴가 달린 수레를 위에서 본 모양이에요.", ex: ["자동차", "주차", "기차"] }
      ]
    },
    {
      id: "hanja-10", no: 10, title: "시간", emoji: "⏰",
      goal: "때와 날을 나타내는 한자를 익혀요",
      items: [
        { id: "hanja-10-1", text: "年", read: "해 년", hun: "해", eum: "년", ko: "해·년", radical: "干", strokes: 6, tip: "곡식이 익는 한 해를 나타내요.", ex: ["작년", "내년", "매년"] },
        { id: "hanja-10-2", text: "時", read: "때 시", hun: "때", eum: "시", ko: "때", radical: "日", strokes: 10, tip: "해(日)와 절구(寺)로 된 글자, 때를 뜻해요.", ex: ["시간", "시계", "동시"] },
        { id: "hanja-10-3", text: "分", read: "나눌 분", hun: "나눌", eum: "분", ko: "나누다", radical: "刀", strokes: 4, tip: "칼(刀)로 나눈다는 뜻에서 시간의 '분'이 됐어요.", ex: ["삼분", "분단", "충분"] },
        { id: "hanja-10-4", text: "今", read: "이제 금", hun: "이제", eum: "금", ko: "지금", radical: "人", strokes: 4, tip: "지금 이 순간을 뜻해요. 오늘(今日)에 쓰여요.", ex: ["오늘", "지금", "금년"] },
        { id: "hanja-10-5", text: "明", read: "밝을 명", hun: "밝을", eum: "명", ko: "밝다", radical: "日", strokes: 8, tip: "해(日)와 달(月)이 함께 빛나는 밝음이에요.", ex: ["명랑", "설명", "조명"] }
      ]
    },
    {
      id: "hanja-11", no: 11, title: "감정", emoji: "😊",
      goal: "기쁨과 슬픔을 나타내는 한자를 익혀요",
      items: [
        { id: "hanja-11-1", text: "好", read: "좋을 호", hun: "좋을", eum: "호", ko: "좋다", radical: "女", strokes: 6, tip: "여자(女)와 아이(子)가 함께 있는 좋은 모양이에요.", ex: ["호감", "기호", "호의"] },
        { id: "hanja-11-2", text: "喜", read: "기쁠 희", hun: "기쁠", eum: "희", ko: "기쁘다", radical: "口", strokes: 12, tip: "북을 치며 기뻐하는 모양에서 왔어요.", ex: ["희소식", "희로애락", "희비"] },
        { id: "hanja-11-3", text: "怒", read: "성낼 노", hun: "성낼", eum: "노", ko: "화내다", radical: "心", strokes: 9, tip: "마음(心) 아래 노여움이 쌓인 모양이에요.", ex: ["분노", "노기", "격노"] },
        { id: "hanja-11-4", text: "哀", read: "슬플 애", hun: "슬플", eum: "애", ko: "슬프다", radical: "口", strokes: 9, tip: "옷 속에 입을 두고 우는 슬픔의 모양이에요.", ex: ["애도", "애환", "애수"] },
        { id: "hanja-11-5", text: "樂", read: "즐거울 락", hun: "즐거울", eum: "락", ko: "즐겁다", radical: "木", strokes: 15, tip: "나무(木)에 북을 매단 즐거움. 음악(音樂)에서는 '악'으로 읽어요.", ex: ["음악", "쾌락", "오락"] }
      ]
    },
    {
      id: "hanja-12", no: 12, title: "두 글자 낱말 1", emoji: "🔤",
      goal: "두 글자로 된 한자어를 익혀요",
      items: [
        { id: "hanja-12-1", text: "學校", read: "학교", hun: "배움터", eum: "학교", ko: "배우는 곳", radical: "學", strokes: 26, tip: "學(배울 학) + 校(학교 교). 배우는 집이에요.", ex: ["학교", "초등학교", "학교생활"] },
        { id: "hanja-12-2", text: "工夫", read: "공부", hun: "배움을 익힘", eum: "공부", ko: "배우고 익힘", radical: "工", strokes: 7, tip: "工(장인 공) + 夫(사내 부). 애써 익힌다는 뜻이에요.", ex: ["공부", "공부방", "한자공부"] },
        { id: "hanja-12-3", text: "父母", read: "부모", hun: "아버지와 어머니", eum: "부모", ko: "아버지와 어머니", radical: "父", strokes: 9, tip: "父(아비 부) + 母(어미 모).", ex: ["부모", "부모님", "부모사랑"] },
        { id: "hanja-12-4", text: "兄弟", read: "형제", hun: "형과 아우", eum: "형제", ko: "형과 아우", radical: "兄", strokes: 12, tip: "兄(형 형) + 弟(아우 제).", ex: ["형제", "형제자매", "삼형제"] },
        { id: "hanja-12-5", text: "山川", read: "산천", hun: "산과 내", eum: "산천", ko: "산과 내", radical: "山", strokes: 6, tip: "山(뫼 산) + 川(내 천). 자연을 뜻해요.", ex: ["산천", "산천어", "명산대천"] }
      ]
    },
    {
      id: "hanja-13", no: 13, title: "두 글자 낱말 2", emoji: "✏️",
      goal: "생활에서 자주 쓰는 한자어를 익혀요",
      items: [
        { id: "hanja-13-1", text: "韓國", read: "한국", hun: "우리나라", eum: "한국", ko: "우리나라", radical: "韓", strokes: 28, tip: "韓(나라 한) + 國(나라 국).", ex: ["한국", "한국어", "대한민국"] },
        { id: "hanja-13-2", text: "人生", read: "인생", hun: "사람이 사는 삶", eum: "인생", ko: "삶", radical: "人", strokes: 7, tip: "人(사람 인) + 生(날 생). 사람이 사는 동안이에요.", ex: ["인생", "인생길", "인생의"] },
        { id: "hanja-13-3", text: "時間", read: "시간", hun: "때와 사이", eum: "시간", ko: "때", radical: "時", strokes: 22, tip: "時(때 시) + 間(사이 간).", ex: ["시간", "시간표", "약속시간"] },
        { id: "hanja-13-4", text: "世上", read: "세상", hun: "사람이 사는 곳", eum: "세상", ko: "세상", radical: "世", strokes: 8, tip: "世(인간 세) + 上(위 상). 사람이 사는 곳이에요.", ex: ["세상", "세상사", "온세상"] },
        { id: "hanja-13-5", text: "人口", read: "인구", hun: "사람 수", eum: "인구", ko: "사람 수", radical: "人", strokes: 5, tip: "人(사람 인) + 口(입 구). 사람의 수를 뜻해요.", ex: ["인구", "인구수", "총인구"] }
      ]
    },
    {
      id: "hanja-14", no: 14, title: "사자성어", emoji: "📜",
      goal: "뜻이 깊은 사자성어를 익혀요",
      items: [
        { id: "hanja-14-1", text: "一石二鳥", read: "일석이조", hun: "돌 하나로 새 두 마리", eum: "일석이조", ko: "한 번에 두 가지 이득", radical: "一", strokes: 19, tip: "一(한 일) 石(돌 석) 二(두 이) 鳥(새 조).", ex: ["일석이조", "일석이조로", "일석이조의 지혜"] },
        { id: "hanja-14-2", text: "七顚八起", read: "칠전팔기", hun: "일곱 번 넘어져도 여덟 번 일어남", eum: "칠전팔기", ko: "거듭 실패해도 다시 일어남", radical: "七", strokes: 33, tip: "七(일곱 칠) 顚(넘어질 전) 八(여덟 팔) 起(일어날 기).", ex: ["칠전팔기", "칠전팔기 정신"] },
        { id: "hanja-14-3", text: "大器晩成", read: "대기만성", hun: "큰 그릇은 늦게 이뤄짐", eum: "대기만성", ko: "큰 인물은 늦게 완성됨", radical: "大", strokes: 37, tip: "大(큰 대) 器(그릇 기) 晩(늦을 만) 成(이룰 성).", ex: ["대기만성", "대기만성형"] },
        { id: "hanja-14-4", text: "畫龍點睛", read: "화룡점정", hun: "용을 그리고 눈동자를 찍음", eum: "화룡점정", ko: "가장 중요한 마무리", radical: "畫", strokes: 58, tip: "畫(그림 화) 龍(용 룡) 點(점 점) 睛(눈동자 정).", ex: ["화룡점정", "화룡점정이다"] },
        { id: "hanja-14-5", text: "堂堂正正", read: "당당정정", hun: "당당하고 바름", eum: "당당정정", ko: "떳떳하고 바른 모습", radical: "堂", strokes: 32, tip: "堂(집 당) 堂(집 당) 正(바를 정) 正(바를 정).", ex: ["당당정정", "당당정정하게"] }
      ]
    }
  ];

  global.APP_DATA = {
    mode: "hanja",
    name: "킹한자",
    mark: "漢",
    storageKey: "kinglingo.hanja.v1",
    tabs: [
      { id: "today", label: "오늘", icon: "home" },
      { id: "write", label: "따라 쓰기", icon: "pen" },
      { id: "cards", label: "카드", icon: "cards" },
      { id: "quiz", label: "퀴즈", icon: "quiz" }
    ],
    courses: [
      {
        code: "hanja", name: "한자", native: "漢字", locale: "ko-KR", flag: "漢",
        rate: { normal: 0.8, slow: 0.55 },
        writingGoal: "한자를 손으로 따라 쓰며 획과 모양을 익혀요",
        units: HANJA_UNITS
      }
    ],
    otherApps: [
      { name: "킹링고", desc: "영어 · 중국어 · 일본어", href: "../" },
      { name: "킹링고 입문", desc: "러시아어 · 스페인어 · 베트남어", href: "../beginner/" }
    ]
  };
})(typeof window !== "undefined" ? window : this);
