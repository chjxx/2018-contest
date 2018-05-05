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
        $view.clearThrownCard(); // 清除上一次操作合并遗留在底部的元素
        $view.deleteLabelNew(); // 清除上一次操作为辨别新旧卡片额外添加的类
        self[e.code](); // 执行这一次操作
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

    if(changed) this.randomInsertOneCard();
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

    if(changed) this.randomInsertOneCard();
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

    if(changed) this.randomInsertOneCard();
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

    if(changed) this.randomInsertOneCard();
  }
  start(){
    reset(); //清除存在数据

    for(let i = 0; i < 2; i++){
      this.randomInsertOneCard();
    }

    function reset(){
      $view.clear();
      cardMap.clearData();
    }
  }
  randomInsertOneCard(){
    let emptyCells = cardMap.searchEmpty(); // 获取可填充位置
    let idx = randomFrom(0, emptyCells.length - 1); // 获取一个要插入卡片的位置的随机索引
    let cellIdx = emptyCells[idx];
    let cardNum = randomCardNum(); // 随机获取作为卡片的数字
    let card = $view.insertOneCard([cellIdx[0] + 1, cellIdx[1] + 1], cardNum);
    cardMap.setCard(cellIdx, card); // 插入到卡片映射；
  }
}


function roll(nowCardIdx, dir, callback){
  console.log(nowCardIdx)
  let [nowCardRowIdx, nowCardColIdx] = nowCardIdx;
  let [cardRowClassName, cardColClassName] = [`card-row-${nowCardRowIdx + 1}`, `card-col-${nowCardColIdx + 1}`];
  let nextIdx;

  if(['up', 'down', 'left', 'right'].indexOf(dir) === -1) return false; // 不符合这几个关键字其中一个则不处理

  if(!cardMap.hasCard(nowCardIdx)) return false; // 如果当前位置没有卡片，则不处理

  let nowCard = cardMap.getCard(nowCardIdx);

  if(isFirstIdx(nowCardIdx)) return false; // 如果当前位置是第一张卡片，则不处理

  seekNextCard(nowCardIdx, dir, (hasCard, targetIdx) => {
    if(hasCard){
      compareCard(nowCardIdx, targetIdx, (msg) => {
          callback(msg);
      })
    }else{
      $view.move(nowCard, [targetIdx[0] + 1, targetIdx[1] + 1]);
      cardMap.moveCard(nowCardIdx, targetIdx);
      callback(true);
    }
  })

  function seekNextCard(nowCardIdx, dir, callback){
    let nextCardIdx = null, nextIdx;
    let getNextIdx = nextIdxFunc(nowCardIdx, dir);

    do{
      nextIdx = getNextIdx();
      if(cardMap.hasCard(nextIdx)) nextCardIdx = nextIdx;
    }while(!isFirstIdx(nextIdx) && !nextCardIdx);

    nextCardIdx !== null ? callback(true, nextCardIdx) : callback(false, nextIdx);


    function nextIdxFunc([rowIdx, colIdx], dir){

      let func;

      if(dir === 'up'){
        func = function(){ return [--rowIdx, colIdx]};
      }else if(dir === 'down'){
        func = function(){ return [++rowIdx, colIdx]};
      }else if(dir === 'left'){
        func = function(){ return [rowIdx, --colIdx]};
      }else{
        func = function(){ return [rowIdx, ++colIdx]};
      }
      return func;
    }
  }

  function compareCard(nowCardIdx, targetIdx, callback){

      if(!cardMap.isNew(targetIdx) && cardMap.balanceNum(nowCardIdx, targetIdx)){
        let nextCard = cardMap.getCard(targetIdx);
        let cardNum = nowCard.cardNumber;

        $view.throwCards(nowCard, nextCard); // 下压dom元素
        $view.move(nowCard, [targetIdx[0] + 1, targetIdx[1] + 1]);
        cardMap.deleteCards(nowCardIdx, targetIdx); // 删除映射上的数据
        let card = $view.insertOneCard([targetIdx[0] + 1, targetIdx[1] + 1], cardNum * 2);
        cardMap.setCard(targetIdx, card);

        callback(true);
      }else{
        if(!isCloser(nowCardIdx, targetIdx)){
          let idx;

          if(dir === 'up'){
            idx = [targetIdx[0] + 1, targetIdx[1]];
          }else if(dir === 'down'){
            idx = [targetIdx[0] - 1, targetIdx[1]];
          }else if(dir === 'left'){
            idx = [targetIdx[0], targetIdx[1] + 1];
          }else{
            idx = [targetIdx[0], targetIdx[1] - 1];
          }
          cardMap.moveCard(nowCardIdx, idx);
          $view.move(nowCard, [idx[0] + 1, idx[1] + 1]);

          callback(true);
        }
      }


      function isCloser([nowCardRowIdx, nowCardColIdx], [nextCardRowIdx, nextCardColIdx]){
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

  function isFirstIdx([rowIdx, colIdx]){
    if(dir === 'up'){
      return rowIdx === 0 ? true : false;
    }else if(dir === 'down'){
      return rowIdx === 3 ? true : false;
    }else if(dir === 'left'){
      return colIdx === 0 ? true : false;
    }else{
      return colIdx === 3 ? true : false;
    }
  }

}

function randomCardNum(){
  let num = randomFrom(1, 8);
  return num === 4 ? 4 : 2; // 1/8几率获得4
}


let game = new Game();