class CardMap{
  constructor(){
    this.data = [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null]
    ];
    this.rowLength = this.data.length;
    this.colLength = this.data[0].length;
  }
  getCard([row, col]){
    return this.data[row][col];
  }
  setCard([row, col], val){
    this.data[row][col] = val;
  }
  hasCard([row, col]){
    return this.data[row][col] !== null ? true : false;
  }
  moveCard([preRow, preCol], [nowRow, nowCol]){
    let card = this.data[preRow][preCol];
    this.data[preRow][preCol] = null;
    this.data[nowRow][nowCol] = card;
  }
  deleteCards(...args){
    let self = this;
    args.forEach((arg) => {
      self.data[arg[0]][arg[1]] = null;
    });
  }
  clearData(){
    this.data.forEach((row, rowIdx) => {
      row.forEach((col, colIdx) => {
        this.data[rowIdx][colIdx] = null;
      });
    });
  }
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
  balanceNum(...args){
    let cards = [], self = this;

    args.forEach((arg) => {
      if(arg instanceof Array){
        cards.push(self.getCard(arg));
      }else{
        cards.push(arg);
      }
    })

    return cards[0].cardNumber === cards[1].cardNumber;
  }
  isNew(arg){
    if(arg instanceof Array){
      return this.getCard(arg).classList.contains('card-new');
    }else{
      return arg.classList.contains('card-new');
    }
  }
}

export default CardMap;