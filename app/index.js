import './index.scss';
import CardMap from './CardMap.js'; // 管理卡片数据
import View from './View.js'; // 管理 dom
import randomFrom from './random.js'; // 产生随机数


const cardMap = new CardMap(); // dom 卡片映射
let $view; // dom 元素;


class Game{
  constructor(id = '#game'){
    let self = this;
    $view = new View(id);

    const keyCodes = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']; // 要处理的键值

    document.body.addEventListener('keydown', (e) => {
      if(keyCodes.indexOf(e.code) !== -1){
        $view.clearThrownCard();
        $view.deleteLabelNew();
        self[e.code]();
      }
    });

    document.body.addEventListener('click', (e) => {
      if(e.target.className === 'restart'){
        self.start();
      }
    })

    self.start();
  }
  ArrowUp(){
    let changed = false;

    for(let colIdx = 0; colIdx < cardMap.colLength; colIdx++){
      for(let rowIdx = 0; rowIdx < cardMap.rowLength; rowIdx++){
        roll([rowIdx, colIdx], 'up', (msg) => {
          if(msg) changed = true;
        });
      }
    }

    if(changed){
      this.insertOneCard();
    }
  }
  ArrowDown(){
    let changed = false;

    for(let colIdx = 0; colIdx < cardMap.colLength; colIdx++){
      for(let rowIdx = cardMap.rowLength - 1; rowIdx >= 0; rowIdx--){
        roll([rowIdx, colIdx], 'down', (msg) => {
          if(msg) changed = true;
        });
      }
    }

    if(changed) this.insertOneCard();
  }
  ArrowLeft(){
    let changed = false;

    for(let rowIdx = 0; rowIdx < cardMap.rowLength; rowIdx++){
      for(let colIdx = 0; colIdx < cardMap.colLength; colIdx++){
        roll([rowIdx, colIdx], 'left', (msg) => {
          if(msg) changed = true;
        });
      }
    }

    if(changed) this.insertOneCard();
  }
  ArrowRight(){
    let changed = false;

    for(let rowIdx = 0; rowIdx < cardMap.rowLength; rowIdx++){
      for(let colIdx = cardMap.colLength - 1; colIdx >= 0; colIdx--){
        roll([rowIdx, colIdx], 'right', (msg) => {
          if(msg) changed = true;
        });
      }
    }

    if(changed) this.insertOneCard();
  }
  start(){
    let self = this;
    reset(); //清除存在数据


    for(let i = 0; i < 2; i++){
      self.insertOneCard(); //随机插入一个“卡片”
    }

    function reset(){
      $view.clear();
      cardMap.clearData();
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
    let card = $view.createCard([rowNum + 1, colNum + 1], cardNum); // 生成卡片元素

    cardMap.setCard([rowNum, colNum], card); // 插入到卡片映射；
    $view.insertOneCard(card); // 插入到HTML中
  }
}


function roll(nowIdx, dir, callback){
  let changed = false;
  let [nowCardRowIdx, nowCardColIdx] = nowIdx;
  let [cardRowClassName, cardColClassName] = [`card-row-${nowCardRowIdx + 1}`, `card-col-${nowCardColIdx + 1}`];
  let nextIdx;

  if(['up', 'down', 'left', 'right'].indexOf(dir) === -1) return false; // 不符合这几个关键字其中一个则不处理

  if(!cardMap.hasCard(nowIdx)) return false; // 如果当前位置没有卡片，则不处理

  let nowCard = cardMap.getCard(nowIdx);

  if(isFirstIdx(nowIdx)) return false; // 如果当前位置是第一张卡片，则不处理

  seekNextCard(nowIdx, dir, (hasCard, [rowIdx, colIdx]) => {
    if(hasCard){
      compareCard([nowCardRowIdx, nowCardColIdx], [rowIdx, colIdx], (msg) => {
        if(msg) changed = true;
      })
    }else{
      let [rowClassName, colChassName] = [`card-row-${rowIdx + 1}`,`card-col-${colIdx + 1}`];

      nowCard.classList.remove(cardRowClassName);
      nowCard.classList.remove(cardColClassName);
      nowCard.classList.add(rowClassName);
      nowCard.classList.add(colChassName);

      cardMap.moveCard(nowIdx, [rowIdx, colIdx]);
      if(!changed) changed = true;
    }
  })

  callback(changed);

  function seekNextCard(nowCardIdx, dir, callback){
    let nextCardIdx = null;
    let getNextIdx = getNextIdxFunc();

    do{
      let nextIdx = getNextIdx();

      if(cardMap.hasCard(nextIdx)) nextCardIdx = nextIdx;

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

  function compareCard([nowCardRowIdx, nowCardColIdx], [rowIdx, colIdx] callback){

      if(cardMap.isNew([rowIdx, colIdx])) return false;

      if(cardMap.balanceNum([nowCardRowIdx, nowCardColIdx], [rowIdx, colIdx])){
        let nowCard = CardMap.getCard([nowCardRowIdx, nowCardColIdx]);
        let nextCard = cardMap.getCard([rowIdx, colIdx]);
        let cardNum = nowCard.cardNumber;
        cardMap.deleteCard([nowCardRowIdx, nowCardColIdx]);
        cardMap.deleteCard([rowIdx, colIdx]);
        $view.throwCards(nowCard, nextCard);
        let card = $view.insertOneCard(rowIdx, colIdx, cardNum * 2);
        cardMap.setCard([rowIdx, colIdx], card);

        callback(true);
      }else{
        if(!isClose([nowCardRowIdx, nowCardColIdx], [rowIdx, colIdx])){
          let nextIdx, card = cardMap.getCard([nowCardRowIdx, nowCardColIdx]);

          if(dir === 'up'){
            nextIdx = [rowIdx + 1, colIdx];
          }else if(dir === 'down'){
            nextIdx = [rowIdx - 1, colIdx];
          }else if(dir === 'left'){
            nextIdx = [rowIdx, colIdx + 1];
          }else{
            nextIdx = [rowIdx, colIdx - 1];
          }

          cardMap.moveCard([nowCardRowIdx, nowCardColIdx], nextIdx);

          card.classList.remove(`card-row-${nowCardRowIdx + 1}`);
          card.classList.remove(`card-col-${nowCardColIdx + 1}`);
          card.classList.add(`card-row-${nextIdx[0] + 1}`);
          card.classList.add(`card-col-${nextIdx[1] + 1}`)

          callback(true);
        }
      }


      function isClose([nowCardRowIdx, nowCardColIdx], [nextCardRowIdx, nextCardColIdx]){
        if(dir === 'up'){
          return nowCardRowIdx === nextCardRowIdx + 1;
        }else if(dir === 'down'){
          return nowCardRowIdx === nextCardRowIdx - 1;
        }else if(dir === 'left'){
          return nowCardColIdx === nextCardColIdx + 1;
        }else{
          return nowCardColIdx === nextCardColIdx - 1;
        }
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

}


let game = new Game();