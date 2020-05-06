export function toMs(duration) {
  return toSecond(duration) * 1000;
}

export function toSecond(duration) {
  return duration * 60 * 1000;
}

export function getExpiryDate({ minutes }) {
  if (minutes) {
    return new Date(Date.now() + toMs(minutes));
  }
}
