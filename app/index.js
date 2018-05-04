import './index.scss';
import CardMap from './CardMap.js';
import View from './View.js';
import randomFrom from './random.js';


const cardMap = new CardMap(); // dom 卡片映射
let $view; // dom 元素;


class Game{
  constructor(id = '#game'){
    $view = new View(id);

    const keyCodes = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

    document.body.addEventListener('keydown', (e) => {

      if(keyCodes.indexOf(e.code) !== -1){
        this[e.code]();
      }
    });
    document.body.addEventListener('click', (e) => {
      if(e.target.className === 'restart'){
        this.start();
      }
    })

    this.start();
  }
  ArrowUp(){
    let self = this;
    let changed = false;

    for(let colIdx = 0; colIdx < cardMap.colLength; colIdx++){
      for(let rowIdx = 0; rowIdx < cardMap.rowLength; rowIdx++){

        if(roll([rowIdx, colIdx], 'up')) changed = true;

      }
    }

    if(changed){
      self.insertOneCard();
    }
  }
  ArrowDown(){
    let self = this;
    let changed = false;

    for(let colIdx = 0; colIdx < cardMap.colLength; colIdx++){
      for(let rowIdx = cardMap.rowLength - 1; rowIdx >= 0; rowIdx--){

        if(roll([rowIdx, colIdx], 'down')) changed = true;

      }
    }

    if(changed){
      self.insertOneCard();
    }
  }
  ArrowLeft(){
    let self = this;
    let changed = false;

    for(let rowIdx = 0; rowIdx < cardMap.rowLength; rowIdx++){
      for(let colIdx = 0; colIdx < cardMap.colLength; colIdx++){

        if(roll([rowIdx, colIdx], 'left')) changed = true;

      }
    }

    if(changed){
      self.insertOneCard();
    }
  }
  ArrowRight(){
    let self = this;
    let changed = false;

    for(let rowIdx = 0; rowIdx < cardMap.rowLength; rowIdx++){
      for(let colIdx = cardMap.colLength - 1; colIdx >= 0; colIdx--){

        if(roll([rowIdx, colIdx], 'right')) changed = true;
      }
    }

    if(changed){
      self.insertOneCard();
    }
  }
  start(){
    let self = this;
    clearData(); //清除存在数据


    for(let i = 0; i < 2; i++){
      self.insertOneCard(); //随机插入一个“卡片”
    }

    function clearData(){
      $view.clearCardBoard();
      $view.clearCurrScore();

      cardMap.clear();
    }

  }
  /**
   * 随机生机一个数字 “2” 或 “4”
   * @return {Number}
   */
  randomCreateOnecardNum(){
    let num = randomFrom(1, 8);
    return num === 4 ? 4 : 2; // 1/8几率获得4
  }
  /**
   * 随机在空的位置插入一个“卡片”
   */
  insertOneCard(){
    let emptyCells = cardMap.searchEmpty(); // 获取可填充位置
    let idx = randomFrom(0, emptyCells.length - 1); // 获取一个随机数
    let rowNum = emptyCells[idx][0];
    let colNum = emptyCells[idx][1];
    let cardNum = this.randomCreateOnecardNum(); // 随机获取作为卡片的数字
    let card = $view.createCard(rowNum + 1, colNum + 1, cardNum); // 生成卡片元素

    cardMap.set([rowNum, colNum], card); // 插入到卡片映射；
    $view.insertOneCard(card); // 插入到HTML中
  }
}


function roll(nowIdx, dir){
  let changed = false;
  let [nowCardRowIdx, nowCardColIdx] = nowIdx;
  let [cardRowClassName, cardColClassName] = [`card-row-${nowCardRowIdx + 1}`, `card-col-${nowCardColIdx + 1}`];
  let nextIdx;

  if(['up', 'down', 'left', 'right'].indexOf(dir) === -1) return false; // 不符合这几个关键字其中一个则不处理

  if(!cardMap.has(nowIdx)) return false; // 如果当前位置没有卡片，则不处理

  let nowCard = cardMap.get(nowIdx);

  if(isFirstIdx(nowIdx)) return false; // 如果当前位置是第一张卡片，则不处理

  seekNextCard(nowIdx, dir, (hasCard, [rowIdx, colIdx]) => {
    if(hasCard){
      if(compareCard([nowCardRowIdx, nowCardColIdx], [rowIdx, colIdx])) changed = true;
    }else{
      let [rowClassName, colChassName] = [`card-row-${rowIdx + 1}`,`card-col-${colIdx + 1}`];

      nowCard.classList.remove(cardRowClassName);
      nowCard.classList.remove(cardColClassName);
      nowCard.classList.add(rowClassName);
      nowCard.classList.add(colChassName);

      cardMap.move(nowIdx, [rowIdx, colIdx]);
      if(!changed) changed = true;
    }
  })

  return changed;

  function seekNextCard(nowCardIdx, dir, callback){
    let nextCardIdx = null;
    let getNextIdx = getNextIdxFunc();

    do{
      let nextIdx = getNextIdx();

      if(cardMap.has(nextIdx)) nextCardIdx = nextIdx;

    }while(!isLastIdx(nextIdx) && !nextCardIdx);

    nextCardIdx !== null ? callback(true, nextCardIdx) : callback(false, nextIdx);


    function getNextIdxFunc([rowIdx, colIdx], dir){
      let func;

      if(dir === 'up'){
        func = function(){ return [rowIdx + 1, colIdx]};
      }else if(dir === 'down'){
        func = function(){ return [rowIdx - 1, colIdx]};
      }else if(dir === 'left'){
        func = function(){ return [rowIdx, colIdx + 1]};
      }else{
        func = function(){ return [rowIdx, colIdx - 1]};
      }
      return func;
    }

    function isLastIdx([rowIdx, colIdx]){
      if(dir === 'up'){
        return rowIdx === 3 ? true : false;
      }else if(dir === 'down'){
        return rowIdx === 0 ? true : false;
      }else if(dir === 'left'){
        return colIdx === 3 ? true : false;
      }else{
        return colIdx === 0 ? true : false;
      }
    }
  }

  function compareCard([nowCardRowIdx, nowCardColIdx], [rowIdx, colIdx]){

      let equel

      if(cardMap.isNew([rowIdx, colIdx])) return false;

      if(cardMap.balanceNum([nowCardRowIdx, nowCardColIdx], [rowIdx, colIdx])){
        equel = true
      }else{
        equel = false;
      }
  }

  function isFirstIdx(idx){
    if(dir === 'up'){
      return nowCardRowIdx === 0 ? true : false;
    }else if(dir === 'down'){
      return nowCardRowIdx === 3 ? true : false;
    }else if(dir === 'left'){
      return nowCardColIdx === 0 ? true : false;
    }else{
      return nowCardColIdx === 3 ? true : false;
    }
  }

  next(nextIdx, nowIdx, dir);

  function next(nextIdx, nowIdx, dir){
    let nextCard = cardMap.get([nextIdx[0], nextIdx[1]]);
    let nowCard = cardMap.get([nowIdx[0], nowIdx[1]]);
    let nextCardRow = nextIdx[0] + 1;
    let nextCardCol = nextIdx[1] + 1;
    let preCardDirIdx, nextCardDirIdx, nowDirClassName, nextDirClassName, preDirClassName, preCardIdx, nextNextIdx, minIdx;

    if(dir === 'up'){
      preCardDirIdx = nowIdx[0] - 1;
      nextCardDirIdx = nextIdx[0];
      nowDirClassName = `card-row-${nowIdx[0] + 1}`;
      nextDirClassName = `card-row-${nextIdx[0] + 1}`;
      preDirClassName = `card-row-${nextIdx[0] + 1 + 1}`;
      preCardIdx = [nextIdx[0] + 1, nextIdx[1]];
      nextNextIdx = [nextIdx[0] - 1, nextIdx[1]];
      minIdx = 0;
    }else if(dir === 'down'){
      preCardDirIdx = nowIdx[0] + 1;
      nextCardDirIdx = nextIdx[0];
      nowDirClassName = `card-row-${nowIdx[0] + 1}`;
      nextDirClassName = `card-row-${nextIdx[0] + 1}`;
      preDirClassName = `card-row-${nextIdx[0] + 1 - 1}`;
      preCardIdx = [nextIdx[0] - 1, nextIdx[1]];
      nextNextIdx = [nextIdx[0] + 1, nextIdx[1]];
      minIdx = 3;
    }else if(dir === 'left'){
      preCardDirIdx === nowIdx[1] - 1;
      nextCardDirIdx = nextIdx[1];
      nowDirClassName = `card-col-${nowIdx[1] + 1}`;
      nextDirClassName = `card-col-${nextIdx[1] + 1}`;
      preDirClassName = `card-row-${nextIdx[0] + 1 + 1}`;
      preCardIdx = [nextIdx[0], nextIdx[1] + 1];
      nextNextIdx = [nextIdx[0], nextIdx[1] - 1];
      minIdx = 0;
    }else{
      preCardDirIdx === nowIdx[1] + 1;
      nextCardDirIdx = nextIdx[1];
      nowDirClassName = `card-col-${nowIdx[1] + 1}`;
      nextDirClassName = `card-col-${nextIdx[1] + 1}`;
      preDirClassName = `card-row-${nextIdx[0] + 1 - 1}`;
      preCardIdx = [nextIdx[0], nextIdx[1] - 1];
      nextNextIdx = [nextIdx[0], nextIdx[1] + 1];
      minIdx = 3;
    }

    if(nextCard !== null){
      console.log(nextIdx, nowIdx)
      if(!cardMap.isNew(nextCard)){
        if(cardMap.balanceNum(nextCard, nowCard)){
          nowCard.className = nextCard.className; // 改变卡片位置
          $view.throwCards(nextCard, nowCard); // 将卡片压到低位，不会挡到新增卡片
          cardMap.delete(nowIdx) // 将卡片从映射表删除
          cardMap.delete(nextIdx) // 将卡片从映射表删除
          let card = $view.createCard(nextCardRow, nextCardCol, nextCard.cardNumber + nowCard.cardNumber);
          $view.insertOneCard(card);

          cardMap.set(nextIdx, card);

          if(changed === false) changed = true;
        }
      }else{
        if(preCardDirIdx !== nextCardDirIdx){
          nowCard.classList.remove(nowDirClassName);
          nowCard.classList.add(preDirClassName);

          cardMap.move(nowIdx, preCardIdx)

          if(changed === false) changed = true;
        }
      }
    }else{
      if(nextCardDirIdx === minIdx){
        console.log(nowDirClassName, nextDirClassName);
        console.log(nowIdx, nextIdx)
        nowCard.classList.remove(nowDirClassName);
        nowCard.classList.add(nextDirClassName);
        cardMap.move(nowIdx, nextIdx);

        if(changed === false) changed = true;
      }else{
        next(nextNextIdx, nowIdx, dir);
      }
    }
  }


}


let game = new Game();