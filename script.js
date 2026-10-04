'use strict'
const maxNum = 14;
const maxHp = 20;
const state = {
  deck: [], 
  room: [],
  usedCard: 0,
  weapon: 0,
  potionUsed: false,
  lastMonster: maxNum + 1,
  hp: maxHp,
  beforeAvoid: false,
  gameState: 'playing'
};

stateInitialize();

for (let card of state.deck) {
  console.log("문앙: " + card['pat'] + ", 수: " + card['num']);
}

// 상태 초기화
function stateInitialize() {
  state.deck = deckConstruct();
  deckShuffle(state.deck);
  state.room = [];
  state.usedCard = 0;
  state.weapon = 0; // 무기 없음
  state.potionUsed = false;
  state.lastMonster = maxNum + 1; // 새 무기는 무조건 사용 가능
  state.hp = maxHp;
  state.beforeAvoid = false;
  state.gameState = 'playing';
}

// 덱 생성
function deckConstruct() {
  const deck = [];
  const patArray = ['S', 'C', 'H', 'D'];
  for (let pat of patArray) {
    for (let num = 2; num <= maxNum; num++) {
      if ((pat=='S') || (pat=='C') || (num <= 10)) {
        let card = {pat: pat, num: num};
        deck.push(card);
      }
    }
  }
  return deck;
}

// 덱 셔플
function deckShuffle(deck) {
  for (let pos = deck.length - 1; pos > 0; pos--) {
    let choice = Math.floor(Math.random() * (pos + 1));
    let temp = deck[choice];
    deck[choice] = deck[pos];
    deck[pos] = temp;
  }
  return deck;
}