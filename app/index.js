import './index.scss';

let boardData = [
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
    this.$piecesLevel = document.querySelector('.board .pieces');
    const keyFunc = [this.goLeft, this.goUp, this.goRight, this.goDown];
    const keyCodes = [37, 38, 39, 40];

    document.body.addEventListener('keydown', (e) => {
      let idx = keyCodes.indexOf(e.keyCode)
      if(idx !== -1){
        keyFunc[idx]();
      }
    });
    document.body.addEventListener('click', (e) => {
      if(e.target.className === 'restart'){
        this.start();
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
  start(){
    let self = this;
    clear();
    let emptyCells = [];

    for(let i = 0; i < 2; i++){
      emptyCells = i === 0 ?
    }

    function clear(){
      self.pieces.innerHTML = '';
      self.$currScore = 0;
      boardData.forEach((row) => {
        row.forEach((piece) => {
          if(piece !== null){
            piece === null;
          }
        });
      });
    }

  }
  getOneNum(){
    let num = randomFrom(1, 4);
    return num === 4 ? 4 : 2;
  }
  getEmptyCells(){
  }
}

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

