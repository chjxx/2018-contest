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
  get([row, col]){
    return this.data[row][col];
  }
  set([row, col], val){
    this.data[row][col] = val;
  }
  has([row, col]){
    return this.data[row][col] !== null ? true : false;
  }
  move([preRow, preCol], [nowRow, nowCol]){
    let card = this.data[preRow][preCol];
    this.data[preRow][preCol] = null;
    this.data[nowRow][nowCol] = card;
  }
  delete([row, col]){
    this.data[row][col] = null;
  }
  clear(){
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
      if(typeof arg === 'Array'){
        cards.push(self.get(arg));
      }else{
        cards.push(arg);
      }
    })
    return cards[0].cardNumber === cards[1].cardNumber;
  }
  isNew(arg){
    if(typeof args === 'Array'){
      return this.get(arg).classList.contains('card-new');
    }else{
      return card.classList.contains('card-new');
    }
  }
}

export default CardMap;