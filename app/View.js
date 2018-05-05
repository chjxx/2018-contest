import randomFrom from './random.js';

class View{
  constructor(id = '#game'){
    this.$container = document.querySelector(id);
    this.$currScore = this.$container.querySelector('.current .number');;
    this.$bestScore = this.$container.querySelector('.best .number');
    this.$restartBtn = this.$container.querySelector('.info .restart');
    this.$cardsBoard = this.$container.querySelector('.board .cardsBoard');
    this.$cardTemp = this.$container.querySelector('#temp').content.children[0];
  }
  move(card, [row, col]){
    let rowRe = /\b(card-row-\d+)\b/;
    let colRe = /\b(card-col-\d+)\b/;
    let nowRowClassName = rowRe.exec(card.className)[1];
    let nowColClassName = colRe.exec(card.className)[1];
    let [rowClassName, colclassName] = [`card-row-${row}`,`card-col-${col}`];
    card.classList.remove(nowRowClassName);
    card.classList.remove(nowColClassName);
    card.classList.add(rowClassName);
    card.classList.add(colclassName);
  }
  throwCards(...cards){
    cards.forEach((card) => {
      card.classList.add('card-merged');
    });
  }
  createCard([row, col], num){
    this.$cardTemp.className = `card card-row-${row} card-col-${col} card-num-${num} card-new`;
    this.$cardTemp.innerText = num;

    let card = document.importNode(this.$cardTemp, true);

    card.cardNumber = num; // 加入一个定制属性，方便之后读取卡片数值

    return card;
  }
  insertOneCard(...args){
    let card;

    if(args[0] instanceof Element){
      card = args[0];
    }else{
      card = this.createCard(args[0], args[1]);
    }

    this.$cardsBoard.append(card);
    return card;
  }
  clearThrownCard(){
    let children = this.$cardsBoard.children;
    for(let i = children.length - 1; i >= 0; i--){
      if(children[i].classList.contains('card-merged')){
        children[i].remove();
      }
    }
  }
  deleteLabelNew(){
    Array.from(this.$cardsBoard.children).forEach((card) => {
      if(card.classList.contains('card-new')) card.classList.remove('card-new');
    })
  }
  clear(){
    this.$cardsBoard.innerHTML = '';
    this.$currScore = 0;
  }
}

export default View;