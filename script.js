'use strict'
const room = document.querySelector("#room");
const hpMessage = document.querySelector("#hpMessage");
const leftCardMessage = document.querySelector("#leftCardMessage");
const weaponMessage = document.querySelector("#weaponMessage");
const lastMonsterMessage = document.querySelector("#lastMonsterMessage");
const avoidBtn = document.querySelector('#avoidBtn');
const maxNum = 14;
const maxHp = 20;
const patterns = {S: '♠', C: '♣', H: '♥', D: '♦'};
const letters = {11: 'J', 12: 'Q', 13: 'K', 14: 'A'};
const state = {};

// 리스너 추가
avoidBtn.addEventListener('click', function () {
  state.room = [];
  state.beforeAvoid = true;
  roomStart();
  render();
});

// 게임 시작
stateInitialize();
roomStart();
render();

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
  if (state.beforeAvoid || state.usedCard > 0) {
    avoidBtn.disabled = true;
  }
  else {
    avoidBtn.disabled = false;
  }
}

// 방 카드 갱신
function roomRender() {
  room.replaceChildren();
  for (let i = 0; i < state.room.length; i++) {
    room.appendChild(createCardElement(state.room[i], i));
  }
}

// 카드 요소 만들기
function createCardElement(card, index) {
  let cardMessage = document.createElement("div");
  let cardShow = document.createElement("div");
  let cardBtn = document.createElement("div");
  cardMessage.appendChild(cardShow);
  cardMessage.appendChild(cardBtn);
  cardMessage.classList.add('cardMessage');
  cardShow.textContent = cardText(card);
  if (cardType(card) === 'monster') {
    cardShow.classList.add('blackCard');
    let cardAttackHand = createButton((cardText(card) + " 맨손"), 'blackCard');
    cardAttackHand.addEventListener('click', () => cardSelect(index, 'attackHand'));
    cardBtn.appendChild(cardAttackHand);
    let cardAttackWeapon = createButton((cardText(card) + " 무기"), 'blackCard');
    cardAttackWeapon.addEventListener('click', () => cardSelect(index, 'attackWeapon'));
    cardBtn.appendChild(cardAttackWeapon);
    if ((card['num'] >= state.lastMonster) || (state.weapon === 0)) {
      cardAttackWeapon.disabled = true;
    }
  }
  else if (cardType(card) === 'weapon') {
    cardShow.classList.add('redCard');
    let cardWeapon = createButton((cardText(card) + " 선택"), 'redCard');
    cardWeapon.addEventListener('click', () => cardSelect(index, 'weapon'));
    cardBtn.appendChild(cardWeapon);
  }
  else {
    cardShow.classList.add('redCard');
    let cardPotion = createButton((cardText(card) + " 선택"), 'redCard')
    cardPotion.addEventListener('click', () => cardSelect(index, 'potion'));
    cardBtn.appendChild(cardPotion);
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

// 카드 선택
function cardSelect(index, type) {
  if (type === 'attackWeapon') {
    state.hp -= Math.max(0, state.room[index]['num'] - state.weapon);
    state.lastMonster = state.room[index]['num'];
  }
  else if (type === 'attackHand') {
    state.hp -= state.room[index]['num'];
  }
  else if (type === 'weapon') {
    state.weapon = state.room[index]['num'];
    state.lastMonster = maxNum + 1;
  }
  else {
    state.hp = Math.min(maxHp, state.hp + state.room[index]['num']);
    state.potionUsed = true;
  }
  state.room.splice(index, 1);
  state.usedCard++;
  if (state.usedCard === 3) {
    state.beforeAvoid = false;
    roomStart();
  }
  render();
}