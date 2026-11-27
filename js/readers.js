/* 킹링고 — 영어원서 오디오북 도서관
 * 초등 입문~초급 수준의 짧은 영어 이야기 8권.
 * 각 책은 페이지(문장 2~3개 + 한국어 해석 + 장면 이모지)와 독후 퀴즈로 이루어집니다.
 * 문장은 Web Speech API로 한 줄씩 읽어 주고, 읽는 줄을 화면에서 강조합니다.
 */
(function (global) {
  "use strict";

  var BOOKS = [
    {
      id: "red-hen",
      title: "The Little Red Hen",
      ko: "빨간 암탉",
      level: "입문",
      levelNo: 1,
      emoji: "🐔",
      scene: "🐔 🌾",
      tone: "orange",
      minutes: 4,
      blurb: "밀을 심고 빵을 만드는 빨간 암탉. 친구들은 도와줄까요?",
      pages: [
        { scene: "🐔🏡", lines: ["Little Red Hen lives on a farm.", "She has three friends: a duck, a cat, and a dog."], ko: "빨간 암탉은 농장에 살아요. 그녀에게는 오리, 고양이, 개 세 친구가 있어요." },
        { scene: "🌾👀", lines: ["One day, she finds some wheat.", "\"Who will help me plant the wheat?\""], ko: "어느 날 그녀는 밀을 발견해요. \"누가 나를 도와 밀을 심을래?\"" },
        { scene: "🦆🐱🐶", lines: ["\"Not I,\" says the duck.", "\"Not I,\" say the cat and the dog."], ko: "\"난 싫어.\" 오리가 말해요. \"난 싫어.\" 고양이와 개도 말해요." },
        { scene: "🐔💪", lines: ["So the hen plants the wheat by herself.", "The sun is hot, but she works hard."], ko: "그래서 암탉은 혼자 밀을 심어요. 해는 뜨겁지만 그녀는 열심히 일해요." },
        { scene: "🌾🌾", lines: ["The wheat grows tall and yellow.", "\"Who will help me cut the wheat?\""], ko: "밀이 크고 노랗게 자랐어요. \"누가 나를 도와 밀을 벨래?\"" },
        { scene: "🦆🙅", lines: ["\"Not I,\" say her friends again.", "So she cuts it by herself."], ko: "친구들은 또 \"난 싫어\"라고 해요. 그래서 그녀는 혼자 밀을 베어요." },
        { scene: "🍞❓", lines: ["\"Who will help me make the bread?\"", "No one answers."], ko: "\"누가 나를 도와 빵을 만들래?\" 아무도 대답하지 않아요." },
        { scene: "🍞😋", lines: ["The hen makes soft, warm bread.", "It smells very good."], ko: "암탉은 폭신하고 따뜻한 빵을 만들어요. 아주 좋은 냄새가 나요." },
        { scene: "🐔🍞🐾", lines: ["\"Who will help me eat the bread?\"", "\"I will!\" say all her friends."], ko: "\"누가 나를 도와 빵을 먹을래?\" \"내가 할게!\" 친구들이 모두 말해요." },
        { scene: "🐔🙅", lines: ["\"No,\" says the hen.", "\"I made it by myself. I will eat it by myself.\""], ko: "\"안 돼.\" 암탉이 말해요. \"나는 혼자 만들었어. 혼자 먹을 거야.\"" },
        { scene: "🐔🐤🍞", lines: ["So she eats the bread with her little chicks.", "Her friends learn: help first, then you can share."], ko: "그래서 그녀는 병아리들과 빵을 먹어요. 친구들은 배워요. 먼저 도와야 함께 나눌 수 있다는 것을." }
      ],
      quiz: [
        { q: "Who lives on the farm?", ko: "농장에 사는 것은 누구인가요?", options: ["Little Red Hen", "A big fox", "A little boy", "A white cat"], answer: 0, why: "이야기의 주인공은 빨간 암탉(Little Red Hen)이에요." },
        { q: "What does the hen find?", ko: "암탉이 발견한 것은 무엇인가요?", options: ["Some wheat", "A book", "A coin", "An egg"], answer: 0, why: "\"she finds some wheat\" — 밀을 발견했어요." },
        { q: "Who helps the hen plant the wheat?", ko: "밀을 심을 때 도와준 친구는 누구인가요?", options: ["No one", "The duck", "The cat", "The dog"], answer: 0, why: "세 친구 모두 \"Not I\"라고 했어요. 아무도 돕지 않았어요." },
        { q: "What do the friends want at the end?", ko: "마지막에 친구들이 원하는 것은 무엇인가요?", options: ["To eat the bread", "To plant wheat", "To go home", "To sleep"], answer: 0, why: "빵을 먹고 싶어 했지만, 암탉은 혼자 만든 빵을 나눠 주지 않았어요." }
      ]
    },
    {
      id: "three-pigs",
      title: "The Three Little Pigs",
      ko: "아기 돼지 삼형제",
      level: "입문",
      levelNo: 1,
      emoji: "🐷",
      scene: "🐷🐷🐷",
      tone: "blue",
      minutes: 4,
      blurb: "짚, 나무, 벽돌로 집을 지은 세 아기 돼지와 늑대 이야기.",
      pages: [
        { scene: "🐷👋", lines: ["Three little pigs leave home.", "They want to build their own houses."], ko: "아기 돼지 삼형제가 집을 떠나요. 그들은 자기 집을 짓고 싶어 해요." },
        { scene: "🐷🌾", lines: ["The first pig builds a house of straw.", "It is fast and easy."], ko: "첫 번째 돼지는 짚으로 집을 지어요. 빠르고 쉬워요." },
        { scene: "🐷🌳", lines: ["The second pig builds a house of sticks.", "It is a little stronger."], ko: "두 번째 돼지는 나뭇가지로 집을 지어요. 조금 더 튼튼해요." },
        { scene: "🐷🧱", lines: ["The third pig works all day.", "He builds a house of bricks."], ko: "세 번째 돼지는 하루 종일 일해요. 그는 벽돌로 집을 지어요." },
        { scene: "🐺🌾", lines: ["A big bad wolf comes to the straw house.", "\"Little pig, let me in!\""], ko: "나쁜 늑대가 짚집에 와요. \"아기 돼지야, 문 열어!\"" },
        { scene: "🐺💨", lines: ["The wolf huffs and puffs.", "The straw house falls down."], ko: "늑대가 후욱 불어요. 짚집이 무너져요." },
        { scene: "🐷🏃🧱", lines: ["The first pig runs to the brick house.", "The second pig runs there, too."], ko: "첫 번째 돼지가 벽돌집으로 달려가요. 두 번째 돼지도 그리로 달려가요." },
        { scene: "🐺🧱💨", lines: ["The wolf huffs and puffs at the brick house.", "He cannot blow it down."], ko: "늑대가 벽돌집에 후욱 불어요. 하지만 집을 무너뜨릴 수 없어요." },
        { scene: "🐺🕳", lines: ["The wolf tries to come down the chimney.", "But there is a hot pot of water!"], ko: "늑대가 굴뚝으로 내려오려고 해요. 그런데 뜨거운 물이 담긴 냄비가 있어요!" },
        { scene: "🐷🍲", lines: ["The wolf runs away.", "The three pigs laugh and eat dinner together."], ko: "늑대가 도망가요. 세 돼지는 웃으며 함께 저녁을 먹어요." }
      ],
      quiz: [
        { q: "What is the first house made of?", ko: "첫 번째 집은 무엇으로 만들었나요?", options: ["Straw", "Bricks", "Sticks", "Glass"], answer: 0, why: "첫 번째 돼지는 짚(straw)으로 집을 지었어요." },
        { q: "Which house is the strongest?", ko: "가장 튼튼한 집은 어느 집인가요?", options: ["The brick house", "The straw house", "The stick house", "The tree house"], answer: 0, why: "벽돌집만 늑대가 무너뜨리지 못했어요." },
        { q: "Where do the pigs eat dinner?", ko: "돼지들은 어디서 저녁을 먹나요?", options: ["In the brick house", "In the straw house", "In the woods", "At the river"], answer: 0, why: "안전한 벽돌집에서 함께 저녁을 먹었어요." }
      ]
    },
    {
      id: "gingerbread-man",
      title: "The Gingerbread Man",
      ko: "과자 인간",
      level: "입문",
      levelNo: 1,
      emoji: "🍪",
      scene: "🍪🏃",
      tone: "orange",
      minutes: 4,
      blurb: "오븐에서 뛰어나온 과자 인간은 누구도 잡을 수 없어요. 정말 그럴까요?",
      pages: [
        { scene: "👵🍪", lines: ["A little old woman makes a gingerbread man.", "She puts him in the oven."], ko: "작은 할머니가 과자 인간을 만들어요. 그를 오븐에 넣어요." },
        { scene: "🏃😄", lines: ["The oven opens. The gingerbread man jumps out!", "\"Run, run, as fast as you can!\""], ko: "오븐이 열려요. 과자 인간이 뛰어나와요! \"빨리, 빨리 달려!\"" },
        { scene: "🍪💨", lines: ["\"You can't catch me, I'm the gingerbread man!\"", "He runs down the road."], ko: "\"나를 잡을 수 없어, 나는 과자 인간이니까!\" 그는 길을 따라 달려요." },
        { scene: "🐄🍪", lines: ["He runs past a cow.", "\"Stop!\" says the cow. But he runs faster."], ko: "그는 소 옆을 지나 달려요. \"멈춰!\" 소가 말해요. 하지만 그는 더 빨리 달려요." },
        { scene: "🐴🐔🍪", lines: ["He runs past a horse and a chicken.", "No one can catch him."], ko: "그는 말과 닭 옆을 지나 달려요. 아무도 그를 잡을 수 없어요." },
        { scene: "🌊🍪", lines: ["Then he comes to a river.", "He cannot swim."], ko: "그때 그가 강에 다다라요. 그는 헤엄을 칠 수 없어요." },
        { scene: "🦊💬", lines: ["A fox says, \"I can help you.\"", "\"Sit on my nose and I will carry you.\""], ko: "여우가 말해요. \"내가 도와줄게.\" \"내 코에 앉아. 그러면 내가 데려다줄게.\"" },
        { scene: "🦊🌊🍪", lines: ["The gingerbread man sits on the fox's nose.", "The fox swims across the river."], ko: "과자 인간이 여우의 코에 앉아요. 여우가 강을 헤엄쳐 건너요." },
        { scene: "🦊😋", lines: ["But the fox is hungry.", "Snap! The gingerbread man is gone."], ko: "하지만 여우는 배가 고파요. 아작! 과자 인간이 사라졌어요." }
      ],
      quiz: [
        { q: "Who makes the gingerbread man?", ko: "과자 인간을 만든 사람은 누구인가요?", options: ["A little old woman", "A little boy", "A cat", "A farmer"], answer: 0, why: "\"A little old woman makes a gingerbread man.\"" },
        { q: "What stops the gingerbread man?", ko: "과자 인간을 멈추게 한 것은 무엇인가요?", options: ["A river", "A wall", "A tree", "A dog"], answer: 0, why: "그는 헤엄을 칠 수 없어서 강 앞에서 멈췄어요." },
        { q: "Who helps him cross the river?", ko: "강을 건너도록 도와준 동물은 누구인가요?", options: ["A fox", "A cow", "A horse", "A chicken"], answer: 0, why: "여우가 코에 태워 강을 건네 주었어요." }
      ]
    },
    {
      id: "goldilocks",
      title: "Goldilocks and the Three Bears",
      ko: "골디락스와 곰 세 마리",
      level: "입문",
      levelNo: 1,
      emoji: "🐻",
      scene: "🐻🐻🐻🥣",
      tone: "green",
      minutes: 5,
      blurb: "숲속 곰의 집에 들어간 골디락스. 죽도 의자도 침대도 딱 맞는 건 하나뿐!",
      pages: [
        { scene: "🐻🏡", lines: ["Three bears live in a small house in the woods.", "There is Papa Bear, Mama Bear, and Baby Bear."], ko: "곰 세 마리가 숲속 작은 집에 살아요. 아빠 곰, 엄마 곰, 아기 곰이 있어요." },
        { scene: "🐻🚶", lines: ["One morning they go for a walk.", "Their porridge is too hot."], ko: "어느 아침 그들은 산책을 나가요. 그들의 죽이 너무 뜨거워요." },
        { scene: "👧🚪", lines: ["A girl named Goldilocks comes to the house.", "She knocks, but no one answers."], ko: "골디락스라는 여자아이가 그 집에 와요. 노크하지만 아무도 대답하지 않아요." },
        { scene: "👧🥣🥣🥣", lines: ["She tastes the porridge.", "The first is too hot, the second is too cold, the third is just right."], ko: "그녀는 죽을 맛봐요. 첫 번째는 너무 뜨겁고, 두 번째는 너무 차갑고, 세 번째는 딱 좋아요." },
        { scene: "👧🪑💥", lines: ["She sits on the chairs.", "Baby Bear's chair breaks!"], ko: "그녀가 의자에 앉아요. 아기 곰의 의자가 부서져요!" },
        { scene: "👧🛏💤", lines: ["She goes upstairs and lies on the beds.", "Baby Bear's bed is just right. She falls asleep."], ko: "그녀는 위층으로 올라가 침대에 눕어요. 아기 곰의 침대가 딱 좋아요. 그녀는 잠이 들어요." },
        { scene: "🐻🐻🐻🏠", lines: ["The bears come home.", "\"Someone ate my porridge!\" says Baby Bear."], ko: "곰들이 집에 돌아와요. \"누가 내 죽을 먹었어!\" 아기 곰이 말해요." },
        { scene: "🐻😮👧", lines: ["They find Goldilocks in the bed.", "She wakes up and sees three bears!"], ko: "그들은 침대에서 골디락스를 발견해요. 그녀는 깨어나 곰 세 마리를 봐요!" },
        { scene: "👧🏃🌳", lines: ["Goldilocks runs out of the house.", "She never goes into the woods alone again."], ko: "골디락스는 집 밖으로 달려나가요. 그녀는 다시는 혼자 숲에 들어가지 않아요." }
      ],
      quiz: [
        { q: "Whose porridge is just right?", ko: "누구의 죽이 딱 좋았나요?", options: ["Baby Bear's", "Papa Bear's", "Mama Bear's", "Goldilocks'"], answer: 0, why: "아기 곰의 죽만 먹기 딱 좋았어요." },
        { q: "What breaks in the house?", ko: "집에서 부서진 것은 무엇인가요?", options: ["Baby Bear's chair", "The door", "A window", "A bed"], answer: 0, why: "\"Baby Bear's chair breaks!\" — 아기 곰의 의자가 부서졌어요." },
        { q: "Where does Goldilocks go at the end?", ko: "마지막에 골디락스는 어디로 가나요?", options: ["She runs out of the house", "She sleeps again", "She eats more porridge", "She sits in a chair"], answer: 0, why: "곰들을 보고 놀라 집 밖으로 달려나갔어요." }
      ]
    },
    {
      id: "tortoise-hare",
      title: "The Tortoise and the Hare",
      ko: "거북이와 토끼",
      level: "초급",
      levelNo: 2,
      emoji: "🐢",
      scene: "🐢🐇🏁",
      tone: "green",
      minutes: 5,
      blurb: "느린 거북이와 빠른 토끼의 달리기 시합. 끝까지 꾸준한 쪽이 이겨요.",
      pages: [
        { scene: "🐇😆🐢", lines: ["A hare laughs at a tortoise.", "\"You are so slow! You cannot do anything fast.\""], ko: "토끼가 거북이를 비웃어요. \"너는 정말 느려! 아무것도 빨리 못 하잖아.\"" },
        { scene: "🐢💬", lines: ["\"I can race you,\" says the tortoise.", "\"Let's run to the big tree.\""], ko: "\"나랑 경주할 수 있어.\" 거북이가 말해요. \"큰 나무까지 달리자.\"" },
        { scene: "🦊🏁", lines: ["The fox says, \"Ready, set, go!\"", "The hare runs very fast."], ko: "여우가 말해요. \"준비, 땅! 출발!\" 토끼가 아주 빨리 달려요." },
        { scene: "🐢🚶", lines: ["The tortoise walks slowly, step by step.", "The hare is soon far away."], ko: "거북이는 한 걸음씩 천천히 걸어요. 토끼는 곧 아주 멀리 가 있어요." },
        { scene: "🐇👀", lines: ["The hare looks back.", "He cannot see the tortoise."], ko: "토끼가 뒤를 돌아봐요. 거북이가 보이지 않아요." },
        { scene: "🐇🌳💤", lines: ["\"I have time,\" he says.", "\"I will take a little nap.\""], ko: "\"시간이 많아.\" 그가 말해요. \"잠깐 낮잠을 자야겠다.\"" },
        { scene: "🐢🚶🐇💤", lines: ["The hare sleeps under a tree.", "The tortoise keeps walking."], ko: "토끼가 나무 아래에서 자요. 거북이는 계속 걸어요." },
        { scene: "🐢🛣", lines: ["The tortoise passes the hare.", "He does not stop."], ko: "거북이가 토끼를 지나쳐요. 그는 멈추지 않아요." },
        { scene: "🐇🏃💨", lines: ["The hare wakes up and runs fast.", "But it is too late."], ko: "토끼가 깨어나 빨리 달려요. 하지만 너무 늦었어요." },
        { scene: "🐢🏆", lines: ["The tortoise wins the race.", "Slow and steady wins the race."], ko: "거북이가 경주에서 이겨요. 꾸준한 느림이 경주를 이겨요." }
      ],
      quiz: [
        { q: "Who races in the story?", ko: "이야기에서 경주하는 동물은 누구인가요?", options: ["A tortoise and a hare", "A fox and a bear", "A cat and a dog", "Two hares"], answer: 0, why: "거북이와 토끼가 큰 나무까지 경주했어요." },
        { q: "What does the hare do during the race?", ko: "경주 중에 토끼는 무엇을 하나요?", options: ["He takes a nap", "He drinks water", "He helps the tortoise", "He goes home"], answer: 0, why: "토끼는 나무 아래에서 낮잠을 잤어요." },
        { q: "Who wins the race?", ko: "경주에서 이긴 동물은 누구인가요?", options: ["The tortoise", "The hare", "The fox", "Nobody"], answer: 0, why: "꾸준히 걸은 거북이가 이겼어요." }
      ]
    },
    {
      id: "lion-mouse",
      title: "The Lion and the Mouse",
      ko: "사자와 생쥐",
      level: "초급",
      levelNo: 2,
      emoji: "🦁",
      scene: "🦁🐭",
      tone: "orange",
      minutes: 4,
      blurb: "작은 생쥐가 큰 사자를 살려 줘요. 작은 친구도 큰 도움이 돼요.",
      pages: [
        { scene: "🦁☀️💤", lines: ["A big lion is sleeping in the sun.", "A little mouse runs over his nose."], ko: "큰 사자가 햇볕에서 자고 있어요. 작은 생쥐가 그의 코 위를 달려가요." },
        { scene: "🦁😠🐭", lines: ["The lion wakes up and catches the mouse.", "\"Please let me go,\" says the mouse."], ko: "사자가 깨어나 생쥐를 잡아요. \"제발 놓아주세요.\" 생쥐가 말해요." },
        { scene: "🐭🤝", lines: ["\"I am small, but one day I can help you.\"", "The lion laughs, but he lets the mouse go."], ko: "\"저는 작지만, 언젠가 사자를 도울 수 있어요.\" 사자는 웃지만 생쥐를 놓아줘요." },
        { scene: "🦁🕸", lines: ["One day, the lion is caught in a net.", "He roars and roars."], ko: "어느 날 사자가 그물에 걸려요. 그는 계속 으르렁거려요." },
        { scene: "🐭👂", lines: ["The mouse hears the lion.", "She runs to the net."], ko: "생쥐가 사자 소리를 들어요. 그녀는 그물로 달려가요." },
        { scene: "🐭🦷🪢", lines: ["She bites the ropes with her small teeth.", "Snap, snap, snap!"], ko: "그녀는 작은 이로 밧줄을 갉아요. 아작, 아작, 아작!" },
        { scene: "🦁😊🐭", lines: ["The net opens and the lion is free.", "\"Thank you, little friend,\" says the lion."], ko: "그물이 열리고 사자가 자유로워져요. \"고마워, 작은 친구.\" 사자가 말해요." },
        { scene: "🦁🐭💛", lines: ["\"You helped me first,\" says the mouse.", "A kind friend is a big help."], ko: "\"먼저 도와주셨잖아요.\" 생쥐가 말해요. 친절한 친구는 큰 도움이에요." }
      ],
      quiz: [
        { q: "What does the lion catch?", ko: "사자가 잡은 것은 무엇인가요?", options: ["A little mouse", "A big fish", "A bird", "A rabbit"], answer: 0, why: "코 위를 지나가던 작은 생쥐를 잡았어요." },
        { q: "How does the mouse help the lion?", ko: "생쥐는 어떻게 사자를 도와주나요?", options: ["She bites the net", "She brings water", "She calls the fox", "She pushes the tree"], answer: 0, why: "작은 이로 그물의 밧줄을 갉아 끊었어요." },
        { q: "What is the lesson of the story?", ko: "이 이야기가 알려 주는 것은 무엇인가요?", options: ["Small friends can help too", "Never sleep in the sun", "Big animals are bad", "Nets are dangerous"], answer: 0, why: "작은 친구도 큰 도움을 줄 수 있다는 이야기예요." }
      ]
    },
    {
      id: "ugly-duckling",
      title: "The Ugly Duckling",
      ko: "미운 아기 오리",
      level: "초급",
      levelNo: 2,
      emoji: "🦢",
      scene: "🦆🌊",
      tone: "blue",
      minutes: 5,
      blurb: "회색 아기 오리는 왜 다른 오리와 다를까요? 봄이 오면 알게 돼요.",
      pages: [
        { scene: "🦆🥚", lines: ["A mother duck sits on her eggs.", "One morning, five eggs open."], ko: "엄마 오리가 알 위에 앉아 있어요. 어느 아침, 알 다섯 개가 깨져요." },
        { scene: "🐤🐤🐤🐤🩶", lines: ["Four ducklings are yellow and small.", "The last one is big and grey."], ko: "네 마리 아기 오리는 노랗고 작아요. 마지막 한 마리는 크고 회색이에요." },
        { scene: "🦆🙅🩶", lines: ["\"You are not like us,\" say the other ducks.", "\"You are too big and too grey.\""], ko: "\"너는 우리와 달라.\" 다른 오리들이 말해요. \"너는 너무 크고 너무 회색이야.\"" },
        { scene: "🩶😢🌊", lines: ["The little duck feels sad.", "He swims away alone."], ko: "아기 오리는 슬퍼져요. 그는 혼자 헤엄쳐 떠나요." },
        { scene: "🍂🩶", lines: ["Autumn comes and the leaves fall.", "He hides in the cold reeds."], ko: "가을이 오고 나뭇잎이 떨어져요. 그는 차가운 갈대숲에 숨어요." },
        { scene: "❄️🩶", lines: ["Winter is very cold and hard.", "But spring comes again."], ko: "겨울은 아주 춥고 힘들어요. 그러나 봄이 다시 와요." },
        { scene: "🦢🦢🦢", lines: ["He sees three beautiful white birds in the lake.", "They have long necks and wide wings."], ko: "그는 호수에서 아름다운 흰 새 세 마리를 봐요. 그들은 긴 목과 넓은 날개를 가졌어요." },
        { scene: "🩶💧🦢", lines: ["He looks into the water.", "\"It's me! I am a swan, not a duck.\""], ko: "그는 물속을 들여다봐요. \"나야! 나는 오리가 아니라 백조였어.\"" },
        { scene: "🦢☀️🎉", lines: ["The white swans call to him.", "He is happy and flies with them."], ko: "흰 백조들이 그를 불러요. 그는 행복하게 그들과 함께 날아가요." }
      ],
      quiz: [
        { q: "What color is the last duckling?", ko: "마지막 아기 오리는 무슨 색인가요?", options: ["Grey", "Yellow", "White", "Brown"], answer: 0, why: "\"The last one is big and grey.\"" },
        { q: "What is the ugly duckling really?", ko: "미운 아기 오리의 진짜 모습은 무엇인가요?", options: ["A swan", "A goose", "A chicken", "A pigeon"], answer: 0, why: "\"I am a swan, not a duck.\" — 백조였어요." },
        { q: "When does he find out?", ko: "그는 언제 그것을 알게 되나요?", options: ["In spring", "In autumn", "In winter", "In summer"], answer: 0, why: "겨울이 지나 봄이 왔을 때 호수에서 알게 됐어요." }
      ]
    },
    {
      id: "two-mice",
      title: "The Town Mouse and the Country Mouse",
      ko: "도시 생쥐와 시골 생쥐",
      level: "초급",
      levelNo: 2,
      emoji: "🐭",
      scene: "🐭🏙🌾",
      tone: "purple",
      minutes: 5,
      blurb: "화려한 도시의 음식과 조용한 시골의 평화. 시골 생쥐의 선택은?",
      pages: [
        { scene: "🌾🐭", lines: ["A country mouse lives in a field.", "His cousin comes from the city."], ko: "시골 생쥐가 들판에 살아요. 그의 사촌이 도시에서 와요." },
        { scene: "🧀🐭", lines: ["The country mouse gives him bread and cheese.", "\"This is simple food,\" says the town mouse."], ko: "시골 생쥐가 빵과 치즈를 줘요. \"이건 너무 간단한 음식이야.\" 도시 생쥐가 말해요." },
        { scene: "🏙🐭💬", lines: ["\"Come to my house,\" says the town mouse.", "\"My food is much better.\""], ko: "\"우리 집에 와.\" 도시 생쥐가 말해요. \"내 음식이 훨씬 좋아.\"" },
        { scene: "🏠🐭🐭", lines: ["They go to the city.", "The house is big and beautiful."], ko: "그들은 도시로 가요. 집은 크고 아름다워요." },
        { scene: "🍰🍯🐭", lines: ["There is cake, fruit, and honey on the table.", "The country mouse is happy."], ko: "탁자 위에 케이크와 과일, 꿀이 있어요. 시골 생쥐는 기뻐요." },
        { scene: "🐶💥🐭", lines: ["But then a big dog runs in.", "The two mice hide under a chair."], ko: "그런데 큰 개가 뛰어들어와요. 두 생쥐는 의자 밑에 숨어요." },
        { scene: "🐭😰🐭", lines: ["\"Is it always like this?\" asks the country mouse.", "\"Yes,\" says the town mouse. \"We must be careful.\""], ko: "\"항상 이래?\" 시골 생쥐가 물어요. \"응.\" 도시 생쥐가 말해요. \"우리는 조심해야 해.\"" },
        { scene: "🌾🐭🏃", lines: ["The country mouse runs back home.", "\"I like my simple food and quiet field.\""], ko: "시골 생쥐는 집으로 달려가요. \"나는 간단한 음식과 조용한 들판이 좋아.\"" },
        { scene: "☀️🧀🐭", lines: ["He eats his cheese in the sun.", "Small and simple can be happy and safe."], ko: "그는 햇볕에서 치즈를 먹어요. 작고 간단한 것이 행복하고 안전할 수 있어요." }
      ],
      quiz: [
        { q: "Where does the town mouse live?", ko: "도시 생쥐는 어디에 사나요?", options: ["In the city", "In a field", "In the woods", "At the river"], answer: 0, why: "도시 생쥐는 크고 아름다운 도시 집에 살아요." },
        { q: "What runs into the room?", ko: "방으로 뛰어든 것은 무엇인가요?", options: ["A big dog", "A cat", "A boy", "A bird"], answer: 0, why: "\"a big dog runs in\" — 큰 개가 뛰어들었어요." },
        { q: "What does the country mouse choose?", ko: "시골 생쥐는 무엇을 선택하나요?", options: ["His simple home", "The city cake", "A new house", "The town mouse's chair"], answer: 0, why: "화려한 음식보다 조용하고 안전한 자기 집을 택했어요." }
      ]
    }
  ];

  function byId(id) {
    for (var i = 0; i < BOOKS.length; i++) {
      if (BOOKS[i].id === id) return BOOKS[i];
    }
    return null;
  }

  global.KING_READERS = {
    version: 1,
    locale: "en-US",
    books: BOOKS,
    byId: byId
  };
})(typeof window !== "undefined" ? window : this);
