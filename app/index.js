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
        let changed;
        $view.clearThrownCard(); // 清除上一次合并操作遗留在底部的元素
        $view.deleteLabelNew(); // 清除上一次操作为辨别新旧卡片额外添加的类
        changed = self[e.code](); // 执行这一次操作
        if(changed) self.randomInsertOneCard(); // 随机插入一张新卡片
        if(cardMap.isBookOut()){ // 如果这一些操作后没有空余位置
          testNextStep(); // 测试有没有下一步可行，如果没有则游戏结束
        }
        e.preventDefault();
      }
    });

    document.body.addEventListener('click', (e) => {
      if(e.target.className === 'restart'){
        if(e.target.parentElement.classList.contains('msg')){ // 如果是提示页面的按钮
          $view.hideMsg(); // 隐藏提示页
        }
        self.start();
      }
    })

    self.start();
  }
  /**
   * 向上移动
   */
  ArrowUp(){
    let changed = false;

    for(let colIdx = 0; colIdx < cardMap.colLength; colIdx++){
      for(let rowIdx = 0; rowIdx < cardMap.rowLength; rowIdx++){
        roll([rowIdx, colIdx], 'up', (msg) => {// 如果有改变，则会调用这个函数
          changed = msg;
        });
      }
    }

    return changed;
  }
  /**
   * 向下移动
   */
  ArrowDown(){
    let changed = false;

    for(let colIdx = 0; colIdx < cardMap.colLength; colIdx++){
      for(let rowIdx = cardMap.rowLength - 1; rowIdx >= 0; rowIdx--){
        roll([rowIdx, colIdx], 'down', (msg) => {
          changed = msg;
        });
      }
    }

    return changed;
  }
  /**
   * 向左移动
   */
  ArrowLeft(){
    let changed = false;

    for(let rowIdx = 0; rowIdx < cardMap.rowLength; rowIdx++){
      for(let colIdx = 0; colIdx < cardMap.colLength; colIdx++){
        roll([rowIdx, colIdx], 'left', (msg) => {
          changed = msg;
        });
      }
    }

    return changed;
  }
  /**
   * 向右移动
   */
  ArrowRight(){
    let changed = false;

    for(let rowIdx = 0; rowIdx < cardMap.rowLength; rowIdx++){
      for(let colIdx = cardMap.colLength - 1; colIdx >= 0; colIdx--){
        roll([rowIdx, colIdx], 'right', (msg) => {
          changed = msg;
        });
      }
    }

    return changed;
  }
  /**
   * 开始游戏
   * @return {[type]}
   */
  start(){
    reset(); //清除存在数据

    for(let i = 0; i < 2; i++){
      this.randomInsertOneCard();
    }

    function reset(){
      $view.clear();
      cardMap.clear();
    }
  }
  /**
   * 随机插入一张卡片
   * @return {[type]}
   */
  randomInsertOneCard(){
    let emptyCells = cardMap.searchEmpty(); // 获取可填充位置
    let idx = randomFrom(0, emptyCells.length - 1); // 获取一个要插入卡片的位置的随机索引
    let cellIdx = emptyCells[idx];
    let cardNum = randomCardNum(); // 随机获取作为卡片的数字
    let card = $view.insertOneCard([cellIdx[0] + 1, cellIdx[1] + 1], cardNum);
    cardMap.setCard(cellIdx, card); // 插入到卡片映射；
  }
}

/**
 * 处理卡片匹配、移动等
 * @param  {[type]}   nowCardIdx 当前处理的卡片位置
 * @param  {[type]}   dir 移动方向
 * @param  {Function} callback 改变数据后的回调
 * @return {[type]}
 */
function roll(nowCardIdx, dir, callback){
  let nowCard = cardMap.getCard(nowCardIdx);

  if(['up', 'down', 'left', 'right'].indexOf(dir) === -1) return false; // 不符合这几个关键字其中一个则不处理

  if(!cardMap.hasCard(nowCardIdx)) return false; // 如果当前位置没有卡片，则不处理

  if(isFirstIdx(nowCardIdx, dir)) return false; // 如果当前位置是第一张卡片，则不处理

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

  /**
   * 查找该方向的底部之前是否有卡片
   * @param  {[type]}   nowCardIdx 当前卡片位置
   * @param  {[type]}   dir 移动方向
   * @param  {Function} callback 如果有的话则第一个参数为true, 第二个参数为找到的卡片的位置，如果没有的话第一个参数为false，第二个参数为该方向最底部位置
   * @return {[type]}
   */
  function seekNextCard(nowCardIdx, dir, callback){
    let nextCardIdx = null, nextIdx;
    let getNextIdx = nextIdxFunc(nowCardIdx, dir);

    do{
      nextIdx = getNextIdx();
      if(cardMap.hasCard(nextIdx)) nextCardIdx = nextIdx;
    }while(!isFirstIdx(nextIdx, dir) && !nextCardIdx);

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
      let score = cardMap.updateScore(cardNum * 2);
      $view.updateScore(score);
      callback(true);
    }else{
      if(!isCloser(nowCardIdx, targetIdx, dir)){
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


    function isCloser([nowCardRowIdx, nowCardColIdx], [nextCardRowIdx, nextCardColIdx], dir){
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

  function isFirstIdx([rowIdx, colIdx], dir){
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

function testNextStep(){
  let nextStep = false;

  for(let rowIdx = 0; rowIdx < cardMap.rowLength; rowIdx++){
    for(let colIdx = 0; colIdx < cardMap.colLength; colIdx++){
      let idxs = [];

      if(rowIdx - 1 > 0) idxs.push([rowIdx - 1, colIdx]);
      if(rowIdx + 1 < 3) idxs.push([rowIdx + 1, colIdx]);
      if(colIdx - 1 > 0) idxs.push([rowIdx, colIdx - 1]);
      if(colIdx + 1 < 3) idxs.push([rowIdx, colIdx + 1]);

      for(let key of idxs){
        if(cardMap.balanceNum([rowIdx, colIdx], key)){
          nextStep = true;
          break;
        }
      }
      if(nextStep) break;
    }
    if(nextStep) break;
  }

  if(!nextStep){
    $view.showMsg();
  }
}


let game = new Game();