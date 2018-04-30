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
  throwCards(...cards){

    cards.forEach((card) => {
      card.classList.add('card-merged');
    });
  }
  createCard(row, col, num){
    this.$cardTemp.className = `card card-row-${row} card-column-${col} card-num-${num} card-new`;
    this.$cardTemp.innerText = num;

    let card = document.importNode(this.$cardTemp, true);

    card.cardNumber = num; // 加入一个定制属性，方便之后读取卡片数值
    return card;
  }
  insertOneCard(...args){
    let card;

    if(args.length === 3){
      card = this.createCard(args[0], args[1], args[2]);
    }else{
      card = args[0];
    }

    this.$cardsBoard.append(card);
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
  clearCardBoard(){
    this.$cardsBoard.innerHTML = '';
  }
  clearCurrScore(){
    this.$currScore = 0;
  }
}

export default View;