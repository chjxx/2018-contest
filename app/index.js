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
    let changed;

    for(let colIdx = 0; colIdx < cardMap.colLength; colIdx++){
      for(let rowIdx = 0; rowIdx < cardMap.rowLength; rowIdx++){

        if(!cardMap.has([rowIdx, colIdx])) continue;

        if(rowIdx === 0) continue;

        changed = roll(rowIdx - 1);

      }
    }

    if(changed){
      self.insertOneCard();
    }
  }
  ArrowDown(){
    console.log('down');
  }
  ArrowLeft(){
    console.log('left');
  }
  ArrowRight(){
    console.log('right');
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

function roll(preIdx){
  let changed = false;
  let preCard = cardMap.get([preIdx, colIdx]);
  let nowCard = cardMap.get([rowIdx, colIdx]);
  if(preCard !== null){
    if(preCard.cardNumber === nowCard.cardNumber){
      // if(!preCard.classList.contains('card-new')){
        nowCard.className = preCard.className; // 改变卡片位置

        $view.throwCards(preCard, nowCard); // 将卡片压到低位，不会挡到新增卡片
        cardMap.delete([rowIdx, colIdx]) // 将卡片从映射表删除
        cardMap.delete([preIdx, colIdx]) // 将卡片从映射表删除
        let card = $view.createCard(preIdx + 1, colIdx + 1, nowCard.cardNumber + preCard.cardNumber);
        $view.insertOneCard(card);

        cardMap.set([preIdx, colIdx], card);

        if(changed === false) changed = true;
      // }
    }else{
      if(rowIdx - 1 !== preIdx){
        nowCard.classList.remove(`card-row-${rowIdx + 1}`);
        nowCard.classList.add(`card-row-${preIdx + 2}`);

        cardMap.move([rowIdx, colIdx], [preIdx + 1, colIdx])

        if(changed === false) changed = true;
      }
    }
  }else{
    if(preIdx === 0){
      nowCard.classList.remove(`card-row-${rowIdx + 1}`);
      nowCard.classList.add(`card-row-${preIdx + 1}`);

      cardMap.move([rowIdx, colIdx], [preIdx, colIdx]);

      if(changed === false) changed = true;
    }else{
      roll(preIdx - 1);
    }
  }

  return changed;
}

let game = new Game();