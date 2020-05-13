export function toMs(minutes = 0) {
  return toSecond(minutes) * 1000;
}

export function toSecond(minutes = 0) {
  return minutes * 60;
}

export function getExpiryDate(minutes = 0) {
  return new Date(Date.now() + toMs(minutes));
}
