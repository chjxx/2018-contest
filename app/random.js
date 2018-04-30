/**
 * 取某个范围的随机数
 * @param  {Number} min
 * @param  {Number} max
 * @return {Number}
 */
function randomFrom(min, max){
  let temp;

  if(min > max){
    temp = min;
    min = max;
    max = temp;
  }

  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default randomFrom;