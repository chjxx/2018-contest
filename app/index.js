import './index.scss';

const [rows, columns] = [4, 4]; // 设定行数与列数

// 作为已有“卡片”的映射。加占位符，方便之后遍历及筛选
let piecesData = [
  [null, null, null, null],
  [null, null, null, null],
  [null, null, null, null],
  [null, null, null, null]
];

class Game{
  constructor(id = '#game'){
    this.$container = document.querySelector(id);
    this.$currScore = document.querySelector('.current .number');
    this.$bestScore = document.querySelector('.best .number');
    this.$restartBtn = document.querySelector('.info .restart');
    this.$piecesBoard = document.querySelector('.board .pieces');
    this.$pieceTemp = document.querySelector('#temp').content.firstChild;
    const keyFunctions = [this.goLeft, this.goUp, this.goRight, this.goDown];//与下面keyCode索引一一对应
    const keyCodes = [37, 38, 39, 40];

    document.body.addEventListener('keydown', (e) => {
      let idx = keyCodes.indexOf(e.keyCode)
      if(idx !== -1){
        keyFunctions[idx]();
      }
    });
    document.body.addEventListener('click', (e) => {
      if(e.target.className === 'restart'){
        this.start();
      }
    })

    this.start();
  }
  goUp(){
    console.log('up');
  }
  goDown(){
    console.log('down');
  }
  goLeft(){
    console.log('left');
  }
  goRight(){
    console.log('right');
  }
  start(){
    let self = this;
    clearData(); //清除存在数据


    for(let i = 0; i < 2; i++){
      self.insertOnePiece(); //随机插入一个“卡片”
    }

    function clearData(){
      self.$piecesBoard.innerHTML = '';
      self.$currScore = 0;

      piecesData.forEach((row) => {
        row.forEach((column) => {
          column = null;
        });
      });
    }

  }
  /**
   * 随机生机一个数字 “2” 或 “4”
   * @return {Number}
   */
  randomCreateOnePieceNum(){
    let num = randomFrom(1, 4);
    return num === 4 ? 4 : 2;
  }
  /**
   * 随机在空的位置插入一个“卡片”
   */
  insertOnePiece(){
    let self = this;
    let emptyCells = self.searchEmptyCells(); // 获取可填充位置
    let idx = randomFrom(1, emptyCells.length); // 获取一个随机数
    let rowNum = emptyCells[idx][0];
    let columnNum = emptyCells[idx][1];
    console.log(rowNum, columnNum);
    let pieceNum = self.randomCreateOnePieceNum(); // 随机获取作为卡片的数字
    let piece = self.createPiece(rowNum, columnNum, pieceNum); // 生成卡片元素
    piecesData[rowNum][columnNum] = piece; // 插入到卡片映射；

    self.$piecesBoard.appendChild(piece); // 插入到HTML中
  }
  /**
   * 检索出当前空余的位置
   * @return {Array}
   */
  searchEmptyCells(){
    let emptyCells = [];
    piecesData.forEach((row) => {
      row.forEach((column) => {
        if(column === null){
          emptyCells.push([row, column]);
        }
      });
    });

    return emptyCells;
  }
  /**
   * 创建一个“卡片”
   * @param  {Number} rowNum
   * @param  {Number} columnNum
   * @param  {Number} num
   * @return {Element}
   */
  createPiece(rowNum, columnNum, num){
    this.$pieceTemp.className = `piece piece-row-${rowNum} piece-column-${columnNum} piece-num-${num} piece-new`;
    this.$pieceTemp.innerText = num;

    this.$pieceTemp.customNumber = num; // 加入一个定制属性，方便之后读取卡片数值

    return document.importNode(this.$pieceTemp, true);
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
    tem = min;
    min = max;
    max = temp;
  }

  return Math.floor(Math.random() * (max - min + 1) + min);
}

let game = new Game();