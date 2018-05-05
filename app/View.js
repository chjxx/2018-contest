import randomFrom from './random.js';

class View{
  /**
   * 管理Dom元素的对象
   * @param  {String} id 元素ID
   * @return {Object}
   */
  constructor(id = '#game'){
    this.$container = document.querySelector(id);
    this.$currScore = this.$container.querySelector('.current .number');
    this.$bestScore = this.$container.querySelector('.best .number');
    this.$msgBoard = this.$container.querySelector('.board .msg');
    this.$cardsBoard = this.$container.querySelector('.board .cardsBoard');
    this.$cardTemp = this.$container.querySelector('#temp').content.children[0];
  }
  /**
   * 移动卡片元素位置
   * @param  {Element} card 卡片元素
   * @param  {Number} [row 卡片位置
   * @param  {Number} col]
   * @return {[type]}
   */
  move(card, [row, col]){
    let rowRe = /\b(card-row-\d+)\b/;
    let colRe = /\b(card-col-\d+)\b/;
    let nowRowClassName = rowRe.exec(card.className)[1];
    let nowColClassName = colRe.exec(card.className)[1];
    let [rowClassName, colclassName] = [`card-row-${row}`,`card-col-${col}`];
    let str = card.className;
    str = str.replace(nowRowClassName, rowClassName);
    str = str.replace(nowColClassName, colclassName);
    card.className = str;
  }
  /**
   * 创建一个卡片Element
   * @param  {Number} [row 卡片位置
   * @param  {Number} col]
   * @param  {Number} num 卡片号码
   * @return {Element} card 卡片元素
   */
  createCard([row, col], num){
    this.$cardTemp.className = `card card-row-${row} card-col-${col} card-num-${num} card-new`;
    this.$cardTemp.innerText = num;

    let card = document.importNode(this.$cardTemp, true);

    card.cardNumber = num; // 加入一个定制属性，方便之后读取卡片数值

    return card;
  }
  /**
   * 作废卡片（压低卡片位置）
   * @param  {Array} cards 卡片数组
   * @return {[type]}
   */
  throwCards(...cards){
    cards.forEach((card) => {
      card.classList.add('card-merged');
    });
  }
  /**
   * 插入一张卡片到DOM里
   * @param  {[type]} idx 卡片位置
   * @param  {[type]} num 卡片号码
   * @return {[type]} 卡片
   */
  insertOneCard(idx, num){
    let card;

    card = this.createCard(idx, num);
    this.$cardsBoard.append(card);
    return card;
  }
  /**
   * 展示提示框
   * @return {[type]}
   */
  showMsg(){
    this.$msgBoard.classList.add('msg_show');
  }
  /**
   * 隐藏提示框
   * @return {[type]}
   */
  hideMsg(){
    this.$msgBoard.classList.remove('msg_show');
  }
  /**
   * 清除丢弃的卡片
   * @return {[type]}
   */
  clearThrownCard(){
    let children = this.$cardsBoard.children;
    for(let i = children.length - 1; i >= 0; i--){
      if(children[i].classList.contains('card-merged')){
        children[i].remove();
      }
    }
  }
  /**
   * 清除卡片的 new 类名
   * @return {[type]}
   */
  deleteLabelNew(){
    Array.from(this.$cardsBoard.children).forEach((card) => {
      if(card.classList.contains('card-new')) card.classList.remove('card-new');
    })
  }
  /**
   * 清除DOM数据
   * @return {[type]}
   */
  clear(){
    this.$cardsBoard.innerHTML = '';
    this.$currScore.innerText = 0;
  }
  /**
   * 更新游戏分数
   * @param  {[type]} [currNumber 现在的分数
   * @param  {[type]} bestNumber] 历史最高分数
   * @return {[type]}
   */
  updateScore([currNumber, bestNumber]){
    this.$currScore.innerText = currNumber;
    if(bestNumber) this.$bestScore.innerText = bestNumber;
  }
}

export default View;