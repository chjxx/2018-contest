import './index.scss';

let boardData = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
]

class Game{
  constructor(id = '#game'){
    this.$container = document.querySelector(id);
    this.$currScore = document.querySelector('.current .number');
    this.$bestScore = document.querySelector('.best .number');
    this.$restartBtn = document.querySelector('.info .restart');
    this.$piecesLevel = document.querySelector('.board .pieces');
    const keyFunc = [this.goLeft, this.goUp, this.goRight, this.goDown];
    const keyCodes = [37, 38, 39, 40];

    document.body.addEventListener('keydown', (e) => {
      let idx = keyCodes.indexOf(e.keyCode)
      if(idx !== -1){
        keyFunc[idx]();
      }
    })
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
}

let game = new Game();

