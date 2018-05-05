class CardMap{
  /**
   * 管理DOM元素卡片数据
   * @return {[type]}
   */
  constructor(){
    this.data = [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null]
    ];
    this.currScore = 0;
    this.bestScore = 0;
    this.rowLength = this.data.length;
    this.colLength = this.data[0].length;
  }
  /**
   * 获得某个位置的卡片
   * @param  {[type]} [row 位置
   * @param  {[type]} col]
   * @return {[type]} 卡片元素
   */
  getCard([row, col]){
    return this.data[row][col];
  }
  /**
   * 设置某个位置的卡片
   * @param {[type]} [row 位置
   * @param {[type]} col]
   * @param {[type]} val
   */
  setCard([row, col], val){
    this.data[row][col] = val;
  }
  /**
   * 判断某个位置是否有卡片
   * @param  {[type]}  [row 位置
   * @param  {[type]}  col]
   * @return {Boolean}
   */
  hasCard([row, col]){
    return this.data[row][col] !== null ? true : false;
  }
  /**
   * 移动某个位置的卡片到另一个位置
   * @param  {[type]} [preRow 当前位置
   * @param  {[type]} preCol]
   * @param  {[type]} [nowRow 目标位置
   * @param  {[type]} nowCol]
   * @return {[type]}
   */
  moveCard([preRow, preCol], [nowRow, nowCol]){
    let card = this.data[preRow][preCol];
    this.data[preRow][preCol] = null;
    this.data[nowRow][nowCol] = card;
  }
  /**
   * 寻找空白的卡片位置
   * @return {[type]} 位置数组
   */
  searchEmpty(){
    let empty = [];

    this.data.forEach((row, rowIdx) => {
      row.forEach((col, colIdx) => {
        if(col === null){
          empty.push([rowIdx, colIdx]);
        }
      });
    });

    return empty;
  }
  /**
   * 对比两张卡片的号码是否一样
   * @param  {...[type]} args 位置数组
   * @return {[type]}
   */
  balanceNum(...args){
    let cards = [], self = this;

    args.forEach((arg) => {
      cards.push(self.getCard(arg));
    })

    return cards[0].cardNumber === cards[1].cardNumber;
  }
  /**
   * 查看某个位置的卡片是否是新生成的
   * @param  {[type]}  idx 位置
   * @return {Boolean}
   */
  isNew(idx){
    return this.getCard(idx).classList.contains('card-new');
  }
  /**
   * 更新分数
   * @param  {[type]} score 要加上的分数
   * @return {[type]} 返回
   */
  updateScore(score){
    this.currScore += score;
    if(this.currScore <= this.bestScore){
      return [this.currScore];
    }else{
      this.bestScore = this.currScore;
      return [this.currScore, this.bestScore];
    }
  }
  isBookOut(){
    return this.searchEmpty().length === 0 ? true : false;
  }
  /**
   * 清除位置中卡片
   * @param  {...[type]} args 位置数组
   * @return {[type]}
   */
  deleteCards(...args){
    let self = this;
    args.forEach((arg) => {
      self.data[arg[0]][arg[1]] = null;
    });
  }
  /**
   * 清除数据
   * @return {[type]}
   */
  clear(){
    this.data.forEach((row, rowIdx) => {
      row.forEach((col, colIdx) => {
        this.data[rowIdx][colIdx] = null;
      });
    });
    this.currScore = 0;
  }
}

export default CardMap;