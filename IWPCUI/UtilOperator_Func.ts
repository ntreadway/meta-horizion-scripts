
export const operatorUtils = {
  getDaySinceEpoch,
  toLocaleString,
  getRandomNumberFromRange,
}

const msInADay = 1000 * 60 * 60 * 24;


function getDaySinceEpoch(): number {
  return Math.floor(Date.now() / msInADay);
}


function toLocaleString(separator: string, num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}


/**
 * @param isInteger when true, returns a whole value, not inclusive of the end number
 */
function getRandomNumberFromRange(start: number, end: number, isInteger: boolean) {
  const randomResult = start + (Math.random() * (end - start));

  if (isInteger) {
    return Math.floor(randomResult);
  }
  else {
    return randomResult;
  }
}