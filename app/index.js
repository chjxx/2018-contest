import './index.scss';

// 作为已有“卡片”的映射。加占位符，方便之后遍历及筛选
const cardsData = [
  [null, null, null, null],
  [null, null, null, null],
  [null, null, null, null],
  [null, null, null, null]
];

const [rowLength, colLength] = [cardsData.length, cardsData[0].length]; // 设定行数与列数，方便后面使用;

class Game{
  constructor(id = '#game'){
    this.$container = document.querySelector(id);
    this.$currScore = document.querySelector('.current .number');
    this.$bestScore = document.querySelector('.best .number');
    this.$restartBtn = document.querySelector('.info .restart');
    this.$cardsBoard = document.querySelector('.board .cardsBoard');
    this.$cardTemp = document.querySelector('#temp').content.children[0];
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
    let task = false;

    for(let colIdx = 0; colIdx < colLength; colIdx++){
      for(let rowIdx = 0; rowIdx < rowLength; rowIdx++){

        if(cardsData[rowIdx][colIdx] === null) continue;

        if(rowIdx === 0) continue;

        roll([rowIdx - 1]);

        function roll(idx){
          let preCard = cardsData[idx][colIdx];
          let nowCard = cardsData[rowIdx][colIdx];
          if(preCard !== null){
            if(preCard.cardNumber === nowCard.cardNumber){
              // if(!preCard.classList.contains('card-new')){
                nowCard.className = preCard.className; // 改变卡片位置
                self.throwCards([preCard, nowCard]); // 将卡片压到低位，不会挡到新增卡片
                cardsData[rowIdx][colIdx] = null; // 将卡片从映射表删除
                cardsData[idx][colIdx] = null; // 将卡片从映射表删除
                let card = self.createCard(idx + 1, colIdx + 1, nowCard.cardNumber + preCard.cardNumber);
                cardsData[idx][colIdx] = card;
                self.$cardsBoard.append(card);
                if(task === false) task = true;
              // }
            }else{
              if(rowIdx - 1 !== idx){
                nowCard.classList.remove(`card-row-${rowIdx + 1}`);
                nowCard.classList.add(`card-row-${idx + 2}`);
                let card = nowCard;
                cardsData[idx + 1][colIdx] = cardsData[rowIdx][colIdx];
                cardsData[rowIdx][colIdx] = null;
                if(task === false) task = true;
              }
            }
          }else{
            if(idx === 0){
              nowCard.classList.remove(`card-row-${rowIdx + 1}`);
              nowCard.classList.add(`card-row-${idx + 1}`);
              let card = nowCard;
              cardsData[rowIdx][colIdx] = null;
              cardsData[idx][colIdx] = card;
              if(task === false) task = true;
            }else{
              roll(idx - 1);
            }
          }
        }
      }
    }

    if(task){
      self.insertOneCard();
      clearMergedCard();
      deleteLabelNew();
    }

    function clearMergedCard(){
      let children = self.$cardsBoard.children;
      for(let i = children.length - 1; i >= 0; i--){
        if(children[i].classList.contains('card-merged')){
          children[i].remove();
          console.log(i);
        }
      }
    }

    function deleteLabelNew(){
      Array.from(self.$cardsBoard.children).forEach((card) => {
        if(card.classList.contains('card-new')) card.classList.remove('card-new');
      })
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
      self.$cardsBoard.innerHTML = '';
      self.$currScore = 0;

      cardsData.forEach((row, rowIdx) => {
        row.forEach((col, colIdx) => {
          cardsData[rowIdx][colIdx] = null;
        });
      });
    }

  }
  throwCards(cards){
    for(let i = 0; i < cards.length; i++){
      cards[i].classList.add('card-merged');
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
    let emptyCells = this.searchEmptyCells(); // 获取可填充位置
    let idx = randomFrom(0, emptyCells.length - 1); // 获取一个随机数
    let rowNum = emptyCells[idx][0];
    let colNum = emptyCells[idx][1];
    let cardNum = this.randomCreateOnecardNum(); // 随机获取作为卡片的数字
    let card = this.createCard(rowNum + 1, colNum + 1, cardNum); // 生成卡片元素

    cardsData[rowNum][colNum] = card; // 插入到卡片映射；
    this.$cardsBoard.append(card); // 插入到HTML中
  }
  /**
   * 检索出当前空余的位置
   * @return {Array}
   */
  searchEmptyCells(){
    let emptyCells = [];

    cardsData.forEach((row, rowIdx) => {
      row.forEach((col, colIdx) => {
        if(col === null){
          emptyCells.push([rowIdx, colIdx]);
        }
      });
    });

    return emptyCells;
  }
  /**
   * 创建一个“卡片”
   * @param  {Number} rowNum
   * @param  {Number} colNum
   * @param  {Number} cardNum
   * @return {Element}
   */
  createCard(rowNum, colNum, cardNum){
    this.$cardTemp.className = `card card-row-${rowNum} card-column-${colNum} card-num-${cardNum} card-new`;
    this.$cardTemp.innerText = cardNum;

    let card = document.importNode(this.$cardTemp, true);


    card.cardNumber = cardNum; // 加入一个定制属性，方便之后读取卡片数值

    return card;
  }
}

/**
 * 取某个范围的随机数
 * @param  {Number} min
 * @param  {Number} max
 * @return {Number}
 */
function randomFrom(min, max){
  let temp;

  if(min > max){
    temp = min;
    min = max;
    max = temp;
  }

  return Math.floor(Math.random() * (max - min + 1) + min);
}

let game = new Game();