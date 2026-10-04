'use strict'
const room = document.querySelector("#room");
const hpMessage = document.querySelector("#hpMessage");
const leftCardMessage = document.querySelector("#leftCardMessage");
const weaponMessage = document.querySelector("#weaponMessage");
const lastMonsterMessage = document.querySelector("#lastMonsterMessage");
const maxNum = 14;
const maxHp = 20;
const patterns = {S: '♠', C: '♣', H: '♥', D: '♦'};
const letters = {11: 'J', 12: 'Q', 13: 'K', 14: 'A'};
const state = {};

stateInitialize();
roomStart();
render();

for (let card of state.room) {
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
      if ((pat === 'S') || (pat === 'C') || (num <= 10)) {
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

// 방 뽑기
function roomStart() {
  state.potionUsed = false;
  state.usedCard = 0;
  while ((state.room.length < 4) && (state.deck.length !== 0)) {
    state.room.push(state.deck.shift());
  }
}

// 카드 텍스트 변환
function cardText(card) {
  let text = '';
  text += patterns[card['pat']];
  text += (card['num'] > 10) ? letters[card['num']] : card['num'];
  return text;
}

// 카드 종류 변환
function cardType(card) {
  if (card['pat'] === 'D') {
    return 'weapon';
   } 
  else if (card['pat'] === 'H') {
    return 'potion';
  }
  else {
    return 'monster';
  }
}

// 화면 갱신
function render() {
  stateMessageRender();
  roomRender();
}

// 상태 메시지 갱신
function stateMessageRender() {
  hpMessage.textContent = "남은 체력: " + state.hp;
  leftCardMessage.textContent = "남은 카드 수: " + state.deck.length;
  weaponMessage.textContent = "장착 무기: " + ((state.weapon > 0) ? state.weapon : "없음");
  lastMonsterMessage.textContent = "무기로 제거된 마지막 몬스터: " + ((state.lastMonster <= maxNum) ? state.lastMonster : "없음");
}

// 방 카드 갱신
function roomRender() {
  room.replaceChildren();
  for (let card of state.room) {
    room.appendChild(createCardElement(card));
  }
}

// 카드 요소 만들기
function createCardElement(card) {
  let cardMessage = document.createElement("div");
  let cardShow = document.createElement("div");
  let cardSelect = document.createElement("div");
  cardMessage.appendChild(cardShow);
  cardMessage.appendChild(cardSelect);
  cardMessage.classList.add('cardMessage');
  cardShow.textContent = cardText(card);
  if (cardType(card) === 'monster') {
    cardShow.classList.add('blackCard');
    cardSelect.appendChild(createButton((cardText(card) + " 맨손"), 'blackCard'));
    cardSelect.appendChild(createButton((cardText(card) + " 무기"), 'blackCard'));
  }
  else {
    cardShow.classList.add('redCard');
    cardSelect.appendChild(createButton((cardText(card) + " 선택"), 'redCard'));
  }
  return cardMessage;
}

// 버튼 만들기
function createButton(text, className) {
  let button = document.createElement("button");
  button.textContent = text;
  button.classList.add(className);
  return button;
}