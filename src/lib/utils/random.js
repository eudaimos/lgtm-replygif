export function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export function getRandomArrayItem(array) {
  let rv;
  if (Array.isArray(array)) {
    const i = getRandomInt(array.length);
    return array[i];
  }
  return rv;
}
