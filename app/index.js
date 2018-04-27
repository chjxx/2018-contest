import './index.scss';

class Game{
  constructor(id = '#game'){
    this.$container = document.querySelector(id);
    this.$currScore = document.querySelector('.current .number');
    this.$bestScore = document.querySelector('.best .number');
    this.$restartBtn = document.querySelector('.info .restart');
    this.$piecesLevel = document.querySelector('.board .pieces');
  }
}

let game = new Game();
